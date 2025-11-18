import type { Command } from 'commander';
import prompts from 'prompts';
import picocolors from 'picocolors';
import type { GitBranchOptions } from '../../types/index.js';
import { isGitRepository, createBranch, getCurrentBranch } from '../../utils/index.js';
import { logger } from '../../utils/index.js';

/**
 * Create a new git branch with naming conventions
 */
export async function createBranchWithConvention(
  nameArg?: string,
  options: { checkout?: boolean; issue?: string; debug?: boolean } = {}
): Promise<void> {
  try {
    const cwd = process.cwd();

    // Check if we're in a git repository
    const isRepo = await isGitRepository(cwd);
    if (!isRepo) {
      logger.error('Not a git repository. Initialize git with: git init');
      process.exit(1);
    }

    // Get current branch
    const currentBranch = await getCurrentBranch(cwd);
    console.log(picocolors.cyan(`\n🌿 Create New Branch (current: ${currentBranch})\n`));

    // Select branch type
    const { type } = await prompts({
      type: 'select',
      name: 'type',
      message: 'Select branch type:',
      choices: [
        { title: '✨ Feature - New feature or enhancement', value: 'feat' },
        { title: '🐛 Fix - Bug fix', value: 'fix' },
        { title: '🔧 Chore - Maintenance task', value: 'chore' },
        { title: '♻️  Refactor - Code refactoring', value: 'refactor' },
        { title: '📚 Docs - Documentation changes', value: 'docs' },
      ],
    });

    if (!type) {
      logger.info('Branch creation cancelled');
      return;
    }

    // Get branch name
    let branchName = nameArg;

    if (!branchName) {
      const response = await prompts({
        type: 'text',
        name: 'name',
        message: 'Branch name (kebab-case):',
        validate: (value: string) => {
          if (!value) return 'Branch name is required';
          if (!/^[a-z0-9-]+$/.test(value)) {
            return 'Branch name must be lowercase alphanumeric with hyphens';
          }
          return true;
        },
      });

      branchName = response.name;
    }

    if (!branchName) {
      logger.info('Branch creation cancelled');
      return;
    }

    // Optional issue number
    let issueNumber = options.issue;

    if (!issueNumber) {
      const { hasIssue } = await prompts({
        type: 'confirm',
        name: 'hasIssue',
        message: 'Link to an issue number?',
        initial: false,
      });

      if (hasIssue) {
        const response = await prompts({
          type: 'text',
          name: 'issueNumber',
          message: 'Issue number (e.g., 123):',
          validate: (value: string) => {
            if (value && !/^\d+$/.test(value)) {
              return 'Issue number must be numeric';
            }
            return true;
          },
        });

        issueNumber = response.issueNumber;
      }
    }

    // Format branch name
    let fullBranchName = `${type}/${branchName}`;

    if (issueNumber) {
      fullBranchName = `${type}/${issueNumber}-${branchName}`;
    }

    // Confirm checkout
    let shouldCheckout = options.checkout ?? true;

    if (options.checkout === undefined) {
      const response = await prompts({
        type: 'confirm',
        name: 'checkout',
        message: `Create and checkout branch "${fullBranchName}"?`,
        initial: true,
      });

      shouldCheckout = response.checkout ?? false;
    }

    if (shouldCheckout === false && options.checkout === undefined) {
      logger.info('Branch creation cancelled');
      return;
    }

    // Create the branch
    await createBranch(fullBranchName, shouldCheckout, cwd);

    if (shouldCheckout) {
      logger.success(`✨ Created and checked out branch: ${picocolors.green(fullBranchName)}`);
    } else {
      logger.success(`✨ Created branch: ${picocolors.green(fullBranchName)}`);
      logger.info(`To checkout: git checkout ${fullBranchName}`);
    }
  } catch (error) {
    logger.error(`Failed to create branch: ${(error as Error).message}`);
    if (options.debug) {
      console.error(error);
    }
    process.exit(1);
  }
}

/**
 * Register the branch command
 */
export function registerBranchCommand(program: Command): void {
  program
    .command('branch [name]')
    .description('Create a new branch with naming conventions')
    .option('--no-checkout', 'Create branch without checking it out')
    .option('-i, --issue <number>', 'Link to issue number')
    .option('--debug', 'Enable debug mode')
    .action(createBranchWithConvention);
}
