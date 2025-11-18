import type { Command } from 'commander';
import type { CommonCommandOptions } from '../../types/index.js';
import { detectProject } from '../../core/index.js';
import { logger } from '../../utils/index.js';
import { execa } from 'execa';

/**
 * Run lint command
 */
export async function runLint(options: CommonCommandOptions): Promise<void> {
  try {
    const cwd = options.cwd ?? process.cwd();
    const project = await detectProject(cwd);

    logger.info(`Running lint with ${project.packageManager}...`);

    // Run package manager lint script
    const { stdout, stderr } = await execa(project.packageManager, ['run', 'lint'], {
      cwd,
      reject: false,
    });

    if (stdout) {
      console.log(stdout);
    }

    if (stderr) {
      console.error(stderr);
    }

    logger.success('✨ Lint completed!');
  } catch (error) {
    if ((error as { exitCode?: number }).exitCode) {
      // Lint failed with issues
      logger.error('Lint found issues. Please fix them and try again.');
      process.exit((error as { exitCode: number }).exitCode);
    } else {
      logger.error(`Failed to run lint: ${(error as Error).message}`);
      if (options.debug) {
        console.error(error);
      }
      process.exit(1);
    }
  }
}

/**
 * Register the lint command
 */
export function registerLintCommand(program: Command): void {
  program
    .command('lint')
    .description('Run ESLint on your project')
    .option('--debug', 'Enable debug mode')
    .action(runLint);
}
