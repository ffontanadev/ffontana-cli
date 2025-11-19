import type { Command } from 'commander';
import prompts from 'prompts';
import picocolors from 'picocolors';
import type { PRTemplateOptions } from '../../types/index.js';
import { isGitRepository, getCurrentBranch, getRecentCommits } from '../../utils/index.js';
import { logger } from '../../utils/index.js';
import { ensureDir, writeFile, fileExists } from '../../utils/index.js';
import path from 'path';

/**
 * Generate a PR template
 */
export async function generatePRTemplate(options: { debug?: boolean } = {}): Promise<void> {
  try {
    const cwd = process.cwd();

    // Check if we're in a git repository
    const isRepo = await isGitRepository(cwd);
    if (!isRepo) {
      logger.error('Not a git repository. Initialize git with: git init');
      process.exit(1);
    }

    const currentBranch = await getCurrentBranch(cwd);
    console.log(picocolors.cyan(`\n📝 Generate PR Template (branch: ${currentBranch})\n`));

    // Check if .github directory exists
    const githubDir = path.join(cwd, '.github');
    const templatePath = path.join(githubDir, 'PULL_REQUEST_TEMPLATE.md');

    if (await fileExists(templatePath)) {
      const { overwrite } = await prompts({
        type: 'confirm',
        name: 'overwrite',
        message: 'PR template already exists. Overwrite?',
        initial: false,
      });

      if (!overwrite) {
        logger.info('Template generation cancelled');
        return;
      }
    }

    // Select template type
    const { type } = await prompts({
      type: 'select',
      name: 'type',
      message: 'Select PR template type:',
      choices: [
        { title: '✨ Feature - New feature or enhancement', value: 'feature' },
        { title: '🐛 Bug Fix - Fix a bug', value: 'bugfix' },
        { title: '🔥 Hotfix - Urgent production fix', value: 'hotfix' },
        { title: '📚 Documentation - Documentation updates', value: 'docs' },
      ],
    });

    if (!type) {
      logger.info('Template generation cancelled');
      return;
    }

    // Get recent commits to suggest for summary
    const recentCommits = await getRecentCommits(5, cwd);

    console.log(picocolors.gray('\nRecent commits (for reference):'));
    recentCommits.slice(0, 3).forEach((commit, i) => {
      console.log(picocolors.gray(`  ${i + 1}. ${commit}`));
    });

    // Generate template content
    let template = '';

    if (type === 'feature') {
      template = `## 🎯 What does this PR do?

<!-- Provide a clear and concise description of the feature -->

## ✨ Why is this change needed?

<!-- Explain the motivation behind this change -->

## 📸 Screenshots (if applicable)

<!-- Add screenshots to help explain your changes -->

## 🧪 How has this been tested?

<!-- Describe the tests you ran to verify your changes -->

- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

## 📋 Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## 🔗 Related Issues

<!-- Link any related issues here -->

Closes #
`;
    } else if (type === 'bugfix') {
      template = `## 🐛 Bug Description

<!-- Describe the bug you're fixing -->

## 🔧 Solution

<!-- Explain how you fixed the bug -->

## 📸 Screenshots (if applicable)

<!-- Add before/after screenshots if relevant -->

## 🧪 How to test

<!-- Steps to verify the fix -->

1.
2.
3.

## 📋 Checklist

- [ ] The bug is reproducible
- [ ] I have verified the fix works
- [ ] I have added tests to prevent regression
- [ ] No new bugs introduced

## 🔗 Related Issues

<!-- Link the issue this PR fixes -->

Fixes #
`;
    } else if (type === 'hotfix') {
      template = `## 🔥 Hotfix Description

<!-- Describe the critical issue being fixed -->

## ⚠️ Impact

<!-- Describe the impact of the bug -->

## 🔧 Solution

<!-- Explain the fix -->

## ✅ Verification

<!-- How was this verified? -->

## 📋 Checklist

- [ ] Fix is minimal and focused
- [ ] No side effects introduced
- [ ] Tested in production-like environment
- [ ] Stakeholders notified

## 🔗 Related Issues

Fixes #
`;
    } else {
      template = `## 📚 Documentation Changes

<!-- Describe what documentation you're updating -->

## 🎯 Purpose

<!-- Why are these docs changes needed? -->

## 📋 Checklist

- [ ] Documentation is clear and accurate
- [ ] Examples are provided where appropriate
- [ ] Links are valid
- [ ] Grammar and spelling checked

## 🔗 Related Issues

Closes #
`;
    }

    // Create .github directory if it doesn't exist
    await ensureDir(githubDir);

    // Write template
    await writeFile(templatePath, template);

    logger.success(
      `✨ PR template created: ${picocolors.green('.github/PULL_REQUEST_TEMPLATE.md')}`
    );
    console.log(picocolors.cyan('\nNext steps:'));
    console.log('  1. Commit and push the template to your repository');
    console.log('  2. GitHub will use this template for all new PRs');
    console.log(`  3. You can edit the template at: ${templatePath}`);
  } catch (error) {
    logger.error(`Failed to generate PR template: ${(error as Error).message}`);
    if (options.debug) {
      console.error(error);
    }
    process.exit(1);
  }
}

/**
 * Register the PR template command
 */
export function registerPRCommand(program: Command): void {
  program
    .command('pr')
    .description('Generate a pull request template')
    .option('--debug', 'Enable debug mode')
    .action(generatePRTemplate);
}
