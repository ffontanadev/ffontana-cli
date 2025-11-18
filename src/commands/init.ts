import path from 'path';
import type { Command } from 'commander';
import type { InitCommandOptions } from '../types/index.js';
import { logger } from '../utils/index.js';
import {
  promptTemplate,
  promptProjectName,
  promptPackageManager,
  promptConfirm,
} from '../utils/index.js';
import { copy, ensureDir, isEmptyDir, writeJSON, getDirname } from '../utils/index.js';
import { installDependencies } from '../utils/index.js';
import { execa } from 'execa';

/**
 * Get template directory
 */
function getTemplateDir(): string {
  const currentDir = getDirname(import.meta.url);
  return path.join(currentDir, 'templates');
}

/**
 * Initialize a new project
 */
export async function initProject(
  projectName: string | undefined,
  options: InitCommandOptions
): Promise<void> {
  try {
    const cwd = options.cwd ?? process.cwd();

    // Get project name
    const name = projectName ?? (await promptProjectName());

    // Get template
    const template = options.template ?? (await promptTemplate());

    // Determine project directory
    const projectDir = path.join(cwd, name);

    // Check if directory exists and is not empty
    const dirIsEmpty = await isEmptyDir(projectDir);
    if (!dirIsEmpty) {
      const shouldContinue = await promptConfirm(
        `Directory "${name}" is not empty. Continue?`,
        false
      );
      if (!shouldContinue) {
        logger.info('Project initialization cancelled');
        return;
      }
    }

    // Create project directory
    await ensureDir(projectDir);
    logger.success(`Created project directory: ${projectDir}`);

    // Copy template
    const templatesDir = getTemplateDir();
    const templateDir = path.join(templatesDir, template);

    logger.info(`Copying template: ${template}`);
    await copy(templateDir, projectDir);
    logger.success('Template copied');

    // Update package.json with project name
    const packageJsonPath = path.join(projectDir, 'package.json');
    const packageJson = await import('fs-extra').then((fs) => fs.readJSON(packageJsonPath));
    packageJson.name = name;
    await writeJSON(packageJsonPath, packageJson);

    // Initialize git
    if (!options.skipGit) {
      logger.info('Initializing git repository');
      try {
        await execa('git', ['init'], { cwd: projectDir });
        await execa('git', ['add', '.'], { cwd: projectDir });
        await execa('git', ['commit', '-m', 'Initial commit from ff-cli'], {
          cwd: projectDir,
        });
        logger.success('Git repository initialized');
      } catch (error) {
        logger.warn('Failed to initialize git repository');
        if (options.debug) {
          console.error(error);
        }
      }
    }

    // Install dependencies
    if (!options.skipInstall) {
      const packageManager = options.packageManager ?? (await promptPackageManager());

      logger.info(`Installing dependencies with ${packageManager}...`);
      try {
        await installDependencies(projectDir, packageManager);
        logger.success('Dependencies installed');
      } catch (error) {
        logger.error('Failed to install dependencies');
        if (options.debug) {
          console.error(error);
        }
        logger.info(`You can install dependencies manually by running:`);
        logger.info(`  cd ${name}`);
        logger.info(`  ${packageManager} install`);
      }
    }

    // Success message
    logger.success(`\n✨ Project "${name}" created successfully!`);
    logger.info(`\nNext steps:`);
    logger.info(`  cd ${name}`);
    if (options.skipInstall) {
      const pm = options.packageManager ?? 'npm';
      logger.info(`  ${pm} install`);
    }
    logger.info(`  npm run dev`);
  } catch (error) {
    logger.error(`Failed to initialize project: ${(error as Error).message}`);
    if (options.debug) {
      console.error(error);
    }
    process.exit(1);
  }
}

/**
 * Register the init command
 */
export function registerInitCommand(program: Command): void {
  program
    .command('init')
    .description('Initialize a new project')
    .argument('[name]', 'Project name')
    .option('-t, --template <template>', 'Template to use (react-ts|nextjs-app|lit-component)')
    .option('--skip-git', 'Skip git initialization')
    .option('--skip-install', 'Skip dependency installation')
    .option('--typescript', 'Use TypeScript (default: true)')
    .option('--package-manager <pm>', 'Package manager to use (npm|pnpm|yarn|bun)')
    .option('--debug', 'Enable debug mode')
    .action(initProject);
}
