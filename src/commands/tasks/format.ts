import type { Command } from 'commander';
import type { CommonCommandOptions } from '../../types/index.js';
import { detectProject } from '../../core/index.js';
import { logger } from '../../utils/index.js';
import { execa } from 'execa';

/**
 * Run format command
 */
export async function runFormat(options: CommonCommandOptions): Promise<void> {
  try {
    const cwd = options.cwd ?? process.cwd();
    const project = await detectProject(cwd);

    logger.info(`Running format with ${project.packageManager}...`);

    // Run package manager format script
    const { stdout, stderr } = await execa(project.packageManager, ['run', 'format'], {
      cwd,
      reject: false,
    });

    if (stdout) {
      console.log(stdout);
    }

    if (stderr) {
      console.error(stderr);
    }

    logger.success('✨ Format completed!');
  } catch (error) {
    if ((error as { exitCode?: number }).exitCode) {
      // Format failed with issues
      logger.error('Format found issues. Please fix them and try again.');
      process.exit((error as { exitCode: number }).exitCode);
    } else {
      logger.error(`Failed to run format: ${(error as Error).message}`);
      if (options.debug) {
        console.error(error);
      }
      process.exit(1);
    }
  }
}

/**
 * Register the format command
 */
export function registerFormatCommand(program: Command): void {
  program
    .command('format')
    .description('Run Prettier on your project')
    .option('--debug', 'Enable debug mode')
    .action(runFormat);
}
