import type { Command } from 'commander';
import prompts from 'prompts';
import picocolors from 'picocolors';
import type { CommitType, GitCommitOptions } from '../../types/index.js';
import {
  isGitRepository,
  getGitStatus,
  formatCommitMessage,
  createCommit,
  stageFiles,
  COMMIT_TYPES,
  validateCommitMessage,
} from '../../utils/index.js';
import { logger } from '../../utils/index.js';

/**
 * Interactive conventional commit
 */
export async function interactiveCommit(options: {
  dryRun?: boolean;
  debug?: boolean;
}): Promise<void> {
  try {
    const cwd = process.cwd();

    // Check if we're in a git repository
    const isRepo = await isGitRepository(cwd);
    if (!isRepo) {
      logger.error('Not a git repository. Initialize git with: git init');
      process.exit(1);
    }

    // Get git status
    const status = await getGitStatus(cwd);

    // Check if there are any changes
    if (!status.hasChanges) {
      logger.warn('No changes to commit');
      return;
    }

    // Display current status
    console.log(picocolors.cyan('\n📊 Git Status:\n'));
    console.log(picocolors.bold(`Branch: ${picocolors.green(status.branch)}`));

    if (status.staged.length > 0) {
      console.log(picocolors.green(`\n✓ Staged files (${status.staged.length}):`));
      status.staged.slice(0, 5).forEach((file) => {
        console.log(`  ${picocolors.gray('•')} ${file}`);
      });
      if (status.staged.length > 5) {
        console.log(picocolors.gray(`  ... and ${status.staged.length - 5} more`));
      }
    }

    if (status.unstaged.length > 0) {
      console.log(picocolors.yellow(`\n⚠ Unstaged files (${status.unstaged.length}):`));
      status.unstaged.slice(0, 5).forEach((file) => {
        console.log(`  ${picocolors.gray('•')} ${file}`);
      });
      if (status.unstaged.length > 5) {
        console.log(picocolors.gray(`  ... and ${status.unstaged.length - 5} more`));
      }
    }

    if (status.untracked.length > 0) {
      console.log(picocolors.gray(`\n? Untracked files (${status.untracked.length}):`));
      status.untracked.slice(0, 3).forEach((file) => {
        console.log(`  ${picocolors.gray('•')} ${file}`);
      });
      if (status.untracked.length > 3) {
        console.log(picocolors.gray(`  ... and ${status.untracked.length - 3} more`));
      }
    }

    // If no staged files, ask to stage
    if (status.staged.length === 0) {
      const { shouldStage } = await prompts({
        type: 'confirm',
        name: 'shouldStage',
        message: 'No staged files. Stage all changes?',
        initial: false,
      });

      if (shouldStage) {
        await stageFiles(['.'], cwd);
        logger.success('Staged all changes');
      } else {
        logger.info('No files staged. Exiting.');
        return;
      }
    }

    console.log(picocolors.cyan('\n📝 Create Conventional Commit:\n'));

    // Select commit type
    const { type } = await prompts({
      type: 'select',
      name: 'type',
      message: 'Select commit type:',
      choices: COMMIT_TYPES.map((t) => ({
        title: `${t.emoji ? t.emoji + ' ' : ''}${t.type.padEnd(10)} - ${t.description}`,
        value: t.type,
      })),
    });

    if (!type) {
      logger.info('Commit cancelled');
      return;
    }

    // Optional scope
    const { scope } = await prompts({
      type: 'text',
      name: 'scope',
      message: 'Scope (optional, e.g., api, ui, auth):',
      validate: (value: string) => {
        if (value && !/^[a-z0-9-]+$/.test(value)) {
          return 'Scope must be lowercase alphanumeric with hyphens';
        }
        return true;
      },
    });

    // Subject (required)
    const { subject } = await prompts({
      type: 'text',
      name: 'subject',
      message: 'Short description (imperative mood):',
      validate: (value: string) => {
        if (!value) return 'Subject is required';
        if (value.length > 50) return 'Subject should be less than 50 characters';
        if (value.endsWith('.')) return 'Subject should not end with a period';
        if (value[0] === value[0]?.toUpperCase()) {
          return 'Subject should start with lowercase';
        }
        return true;
      },
    });

    if (!subject) {
      logger.info('Commit cancelled');
      return;
    }

    // Optional body
    const { addBody } = await prompts({
      type: 'confirm',
      name: 'addBody',
      message: 'Add detailed description?',
      initial: false,
    });

    let body: string | undefined;
    if (addBody) {
      const response = await prompts({
        type: 'text',
        name: 'body',
        message: 'Detailed description:',
      });
      body = response.body;
    }

    // Breaking changes
    const { hasBreaking } = await prompts({
      type: 'confirm',
      name: 'hasBreaking',
      message: 'Is this a BREAKING CHANGE?',
      initial: false,
    });

    let breaking: string | undefined;
    if (hasBreaking) {
      const response = await prompts({
        type: 'text',
        name: 'breaking',
        message: 'Describe the breaking change:',
        validate: (value: string) => (value ? true : 'Breaking change description is required'),
      });
      breaking = response.breaking;
    }

    // Related issues
    const { hasIssues } = await prompts({
      type: 'confirm',
      name: 'hasIssues',
      message: 'Reference any issues? (e.g., #123)',
      initial: false,
    });

    let issues: string[] | undefined;
    if (hasIssues) {
      const response = await prompts({
        type: 'text',
        name: 'issues',
        message: 'Issue numbers (comma-separated, e.g., #123, #456):',
      });
      if (response.issues) {
        issues = response.issues.split(',').map((i: string) => i.trim());
      }
    }

    // Format the commit message
    const commitMessage = formatCommitMessage({
      type: type as CommitType,
      scope,
      subject,
      body,
      breaking,
      issues,
    });

    // Validate the message
    const validation = validateCommitMessage(commitMessage);
    if (!validation.valid) {
      logger.error(`Invalid commit message: ${validation.error}`);
      process.exit(1);
    }

    // Display preview
    console.log(picocolors.cyan('\n📋 Commit Message Preview:\n'));
    console.log(picocolors.gray('─'.repeat(50)));
    console.log(commitMessage);
    console.log(picocolors.gray('─'.repeat(50)));

    // Confirm
    const { confirm } = await prompts({
      type: 'confirm',
      name: 'confirm',
      message: 'Create this commit?',
      initial: true,
    });

    if (!confirm) {
      logger.info('Commit cancelled');
      return;
    }

    // Dry run mode
    if (options.dryRun) {
      logger.info('Dry run mode - commit not created');
      return;
    }

    // Create the commit
    await createCommit(commitMessage, cwd);

    logger.success('✨ Commit created successfully!');

    // Show the commit
    if (options.debug) {
      const { execa } = await import('execa');
      const { stdout } = await execa('git', ['log', '--oneline', '-1'], { cwd });
      console.log(picocolors.gray(`\n${stdout}`));
    }
  } catch (error) {
    logger.error(`Failed to create commit: ${(error as Error).message}`);
    if (options.debug) {
      console.error(error);
    }
    process.exit(1);
  }
}

/**
 * Register the commit command
 */
export function registerCommitCommand(program: Command): void {
  program
    .command('commit')
    .description('Create a conventional commit interactively')
    .option('--dry-run', 'Preview commit without creating it')
    .option('--debug', 'Enable debug mode')
    .action(interactiveCommit);
}
