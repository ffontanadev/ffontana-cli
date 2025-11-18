import path from 'path';
import type { Command } from 'commander';
import type { HookGenerateOptions } from '../../types/index.js';
import { detectProject } from '../../core/index.js';
import { loadConfig } from '../../core/index.js';
import { renderTemplateToFile } from '../../core/index.js';
import { logger } from '../../utils/index.js';
import { fileExists, getDirname } from '../../utils/index.js';
import prompts from 'prompts';

/**
 * Get the hook output directory based on framework
 */
function getHookDir(framework: string, cwd: string): string {
  switch (framework) {
    case 'next':
      return path.join(cwd, 'src', 'hooks');
    case 'react':
      return path.join(cwd, 'src', 'hooks');
    default:
      return path.join(cwd, 'src', 'hooks');
  }
}

/**
 * Get template directory
 */
function getTemplateDir(): string {
  const currentDir = getDirname(import.meta.url);
  return path.join(currentDir, '..', 'templates');
}

/**
 * Prompt for hook name
 */
async function promptHookName(): Promise<string> {
  const response = await prompts({
    type: 'text',
    name: 'name',
    message: 'Hook name (e.g., useCounter):',
    validate: (value) => (value.trim().length > 0 ? true : 'Hook name is required'),
  });

  return response.name;
}

/**
 * Prompt for hook options
 */
async function promptHookOptions(): Promise<{ test: boolean }> {
  const response = await prompts([
    {
      type: 'confirm',
      name: 'test',
      message: 'Generate test file?',
      initial: true,
    },
  ]);

  return response;
}

/**
 * Prompt for overwrite confirmation
 */
async function promptOverwrite(path: string): Promise<boolean> {
  const response = await prompts({
    type: 'confirm',
    name: 'overwrite',
    message: `File/directory ${path} already exists. Overwrite?`,
    initial: false,
  });

  return response.overwrite;
}

/**
 * Generate a React hook
 */
export async function generateHook(
  name: string | undefined,
  options: HookGenerateOptions
): Promise<void> {
  try {
    const cwd = options.cwd ?? process.cwd();

    // Detect project
    const project = await detectProject(cwd);

    // Only React and Next.js support hooks
    if (project.framework !== 'react' && project.framework !== 'next') {
      logger.error('Hook generation is only supported in React and Next.js projects');
      process.exit(1);
    }

    const config = await loadConfig(cwd);

    // Get hook name
    let hookName = name ?? (await promptHookName());

    // Ensure hook name starts with 'use'
    if (!hookName.startsWith('use')) {
      hookName = 'use' + hookName.charAt(0).toUpperCase() + hookName.slice(1);
    }

    // Get options (merge CLI flags, config, and prompts)
    let hookOptions = {
      test: options.test ?? config.generators?.hook?.test ?? true,
      typescript: options.typescript ?? config.generators?.hook?.typescript ?? true,
    };

    // If no options provided via CLI, prompt for them
    if (options.test === undefined) {
      const prompted = await promptHookOptions();
      hookOptions = { ...hookOptions, ...prompted };
    }

    // Determine output directory
    const baseDir = options.outDir ?? getHookDir(project.framework, cwd);
    const hookFile = hookOptions.typescript ? `${hookName}.ts` : `${hookName}.js`;
    const hookPath = path.join(baseDir, hookFile);

    // Check if hook already exists
    if (await fileExists(hookPath)) {
      const shouldOverwrite = options.force ?? (await promptOverwrite(hookPath));
      if (!shouldOverwrite) {
        logger.info('Hook generation cancelled');
        return;
      }
    }

    // Get templates directory
    const templatesDir = getTemplateDir();
    const frameworkTemplateDir = path.join(templatesDir, 'hooks', 'react');

    // Prepare template data
    const templateData = {
      name: hookName.charAt(0).toUpperCase() + hookName.slice(1).replace(/^use/, ''),
      typescript: hookOptions.typescript,
    };

    // Hook file extension
    const ext = hookOptions.typescript ? 'ts' : 'js';

    // Generate hook file
    const hookTemplatePath = path.join(frameworkTemplateDir, `hook.${ext}.hbs`);
    const hookOutputPath = path.join(baseDir, `${hookName}.${ext}`);

    await renderTemplateToFile(hookTemplatePath, hookOutputPath, templateData);
    logger.success(`Generated ${hookOutputPath}`);

    // Generate test file
    if (hookOptions.test) {
      const testTemplatePath = path.join(frameworkTemplateDir, `hook.test.${ext}.hbs`);
      const testOutputPath = path.join(baseDir, `${hookName}.test.${ext}`);

      if (await fileExists(testTemplatePath)) {
        await renderTemplateToFile(testTemplatePath, testOutputPath, templateData);
        logger.success(`Generated ${testOutputPath}`);
      }
    }

    logger.success(`\n✨ Hook "${hookName}" generated successfully!`);
  } catch (error) {
    logger.error(`Failed to generate hook: ${(error as Error).message}`);
    if (options.debug) {
      console.error(error);
    }
    process.exit(1);
  }
}

/**
 * Register the hook command
 */
export function registerHookCommand(program: Command): void {
  program
    .command('hook')
    .alias('h')
    .description('Generate a new React hook')
    .argument('[name]', 'Hook name (e.g., useCounter)')
    .option('--test', 'Generate test file')
    .option('--no-test', 'Skip test file generation')
    .option('--typescript', 'Use TypeScript')
    .option('--no-typescript', 'Use JavaScript')
    .option('-o, --out-dir <dir>', 'Output directory')
    .option('-f, --force', 'Overwrite existing files')
    .option('--debug', 'Enable debug mode')
    .action(generateHook);
}
