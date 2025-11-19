import path from 'path';
import os from 'os';
import type { Command } from 'commander';
import { execa } from 'execa';
import type { AddTemplateOptions } from '../types/index.js';
import { logger, fileExists, ensureDir, copy, promptConfirm } from '../utils/index.js';
import { loadConfig } from '../core/config-loader.js';

/**
 * Get the user templates directory
 */
async function getUserTemplatesDir(cwd: string): Promise<string> {
  const config = await loadConfig(cwd);

  // Use configured directory or default
  const defaultDir = path.join(os.homedir(), '.config', 'ff-cli', 'user-templates');
  return config.userTemplatesDir ?? defaultDir;
}

/**
 * Validate template name
 */
function validateTemplateName(name: string): { valid: boolean; error?: string } {
  // Allow alphanumeric, hyphens, and underscores
  const pattern = /^[a-zA-Z0-9_-]+$/;

  if (!pattern.test(name)) {
    return {
      valid: false,
      error: 'Template name must contain only alphanumeric characters, hyphens, and underscores',
    };
  }

  return { valid: true };
}

/**
 * Check if source is a GitHub URL
 */
function isGitHubUrl(source: string): boolean {
  const githubPatterns = [/^https?:\/\/github\.com\//, /^git@github\.com:/, /^github:/];

  return githubPatterns.some((pattern) => pattern.test(source));
}

/**
 * Extract template name from GitHub URL
 */
function extractTemplateNameFromUrl(url: string): string {
  // Remove .git extension if present
  const cleanUrl = url.replace(/\.git$/, '');

  // Extract repo name from URL
  const match = cleanUrl.match(/\/([^\/]+)$/);
  return match?.[1] ?? 'template';
}

/**
 * Clone GitHub repository to user templates directory
 */
async function cloneGitHubRepo(
  url: string,
  templateName: string,
  targetDir: string
): Promise<void> {
  try {
    logger.info(`Cloning repository: ${url}`);

    // Clone the repository
    await execa('git', ['clone', url, templateName], { cwd: targetDir });

    // Remove .git directory from cloned template
    const gitDir = path.join(targetDir, templateName, '.git');
    if (await fileExists(gitDir)) {
      await execa('rm', ['-rf', '.git'], { cwd: path.join(targetDir, templateName) });
    }

    logger.success(`Template "${templateName}" added successfully`);
  } catch (error) {
    throw new Error(`Failed to clone repository: ${(error as Error).message}`);
  }
}

/**
 * Copy local directory to user templates directory
 */
async function copyLocalTemplate(
  sourcePath: string,
  templateName: string,
  targetDir: string,
  cwd: string
): Promise<void> {
  try {
    const absoluteSource = path.isAbsolute(sourcePath) ? sourcePath : path.join(cwd, sourcePath);

    // Check if source exists
    if (!(await fileExists(absoluteSource))) {
      throw new Error(`Source directory not found: ${absoluteSource}`);
    }

    logger.info(`Copying template from: ${absoluteSource}`);

    const destination = path.join(targetDir, templateName);
    await copy(absoluteSource, destination);

    logger.success(`Template "${templateName}" added successfully`);
  } catch (error) {
    throw new Error(`Failed to copy template: ${(error as Error).message}`);
  }
}

/**
 * Add a new template to user templates directory
 */
export async function addTemplate(
  source: string | undefined,
  options: AddTemplateOptions
): Promise<void> {
  try {
    const cwd = options.cwd ?? process.cwd();

    // Require source argument
    if (!source) {
      logger.error('Template source is required');
      logger.info('Usage: ff add template <github-url|local-path>');
      logger.info('Examples:');
      logger.info('  ff add template https://github.com/user/my-template');
      logger.info('  ff add template ./my-local-template');
      logger.info('  ff add template ../shared-templates/react-custom');
      process.exit(1);
    }

    // Get user templates directory
    const userTemplatesDir = await getUserTemplatesDir(cwd);
    await ensureDir(userTemplatesDir);

    // Determine template name
    let templateName: string;
    if (options.name) {
      templateName = options.name;
    } else if (isGitHubUrl(source)) {
      templateName = extractTemplateNameFromUrl(source);
    } else {
      // Use directory name from path
      templateName = path.basename(source);
    }

    // Validate template name
    const validation = validateTemplateName(templateName);
    if (!validation.valid) {
      logger.error(validation.error ?? 'Invalid template name');
      process.exit(1);
    }

    // Check if template already exists
    const templatePath = path.join(userTemplatesDir, templateName);
    if (await fileExists(templatePath)) {
      if (!options.force) {
        const shouldOverwrite = await promptConfirm(
          `Template "${templateName}" already exists. Overwrite?`,
          false
        );

        if (!shouldOverwrite) {
          logger.info('Template addition cancelled');
          return;
        }
      }

      // Remove existing template
      logger.info(`Removing existing template: ${templateName}`);
      await execa('rm', ['-rf', templateName], { cwd: userTemplatesDir });
    }

    // Add template based on source type
    if (isGitHubUrl(source)) {
      await cloneGitHubRepo(source, templateName, userTemplatesDir);
    } else {
      await copyLocalTemplate(source, templateName, userTemplatesDir, cwd);
    }

    // Display location
    logger.info(`Template location: ${templatePath}`);
    logger.info(`\nYou can now use this template with:`);
    logger.info(`  ff init my-project --template ${templateName}`);
  } catch (error) {
    logger.error(`Failed to add template: ${(error as Error).message}`);
    if (options.debug) {
      console.error(error);
    }
    process.exit(1);
  }
}

/**
 * Register the add command with template subcommand
 */
export function registerAddCommand(program: Command): void {
  const add = program.command('add').alias('a').description('Add resources (templates, etc.)');

  add
    .command('template')
    .alias('t')
    .description('Add a custom template from GitHub or local directory')
    .argument('[source]', 'GitHub URL or local directory path')
    .option('-n, --name <name>', 'Custom template name')
    .option('-f, --force', 'Force overwrite if template exists')
    .option('--debug', 'Enable debug mode')
    .action(addTemplate);
}
