import type { Command } from 'commander';
import type { CommonCommandOptions } from '../../types/index.js';
import { detectProject } from '../../core/index.js';
import { logger } from '../../utils/index.js';
import { execa } from 'execa';

/**
 * Run test command
 */
export async function runTest(options: CommonCommandOptions): Promise<void> {
  try {
    const cwd = options.cwd ?? process.cwd();
    const project = await detectProject(cwd);

    logger.info(`Running tests with ${project.packageManager}...`);

    // Run package manager test script
    const { stdout, stderr } = await execa(project.packageManager, ['run', 'test'], {
      cwd,
      reject: false,
    });

    if (stdout) {
      console.log(stdout);
    }

    if (stderr) {
      console.error(stderr);
    }

    logger.success('✨ Tests completed!');
  } catch (error) {
    if ((error as { exitCode?: number }).exitCode) {
      // Tests failed
      logger.error('Some tests failed. Please fix them and try again.');
      process.exit((error as { exitCode: number }).exitCode);
    } else {
      logger.error(`Failed to run tests: ${(error as Error).message}`);
      if (options.debug) {
        console.error(error);
      }
      process.exit(1);
    }
  }
}

/**
 * Register the test command
 */
export function registerTestCommand(program: Command): void {
  program
    .command('test')
    .description('Run tests on your project')
    .option('--debug', 'Enable debug mode')
    .action(runTest);
}
