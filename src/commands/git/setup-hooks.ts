import type { Command } from 'commander';
import prompts from 'prompts';
import picocolors from 'picocolors';
import type { GitHookSetupOptions } from '../../types/index.js';
import { isGitRepository, isHuskyInstalled, isCommitlintConfigured } from '../../utils/index.js';
import { logger } from '../../utils/index.js';
import { detectPackageManager, addPackages } from '../../utils/index.js';
import { writeJSON, writeFile, ensureDir, fileExists } from '../../utils/index.js';
import { execa } from 'execa';
import path from 'path';

/**
 * Setup git hooks with husky and commitlint
 */
export async function setupGitHooks(
  options: GitHookSetupOptions & { debug?: boolean }
): Promise<void> {
  try {
    const cwd = process.cwd();

    // Check if we're in a git repository
    const isRepo = await isGitRepository(cwd);
    if (!isRepo) {
      logger.error('Not a git repository. Initialize git with: git init');
      process.exit(1);
    }

    console.log(picocolors.cyan('\n🎣 Git Hooks Setup\n'));

    // Check current status
    const huskyInstalled = await isHuskyInstalled(cwd);
    const commitlintConfigured = await isCommitlintConfigured(cwd);

    if (huskyInstalled) {
      console.log(picocolors.green('✓ Husky is already installed'));
    }

    if (commitlintConfigured) {
      console.log(picocolors.green('✓ Commitlint is already configured'));
    }

    if (huskyInstalled && commitlintConfigured && !options.force) {
      const { proceed } = await prompts({
        type: 'confirm',
        name: 'proceed',
        message: 'Git hooks are already set up. Reconfigure?',
        initial: false,
      });

      if (!proceed) {
        logger.info('Setup cancelled');
        return;
      }
    }

    // Ask what to install
    const { features } = await prompts({
      type: 'multiselect',
      name: 'features',
      message: 'Select features to install:',
      choices: [
        {
          title: 'Husky (Git hooks manager)',
          value: 'husky',
          selected: !huskyInstalled,
        },
        {
          title: 'Commitlint (Enforce conventional commits)',
          value: 'commitlint',
          selected: !commitlintConfigured,
        },
        {
          title: 'lint-staged (Run linters on staged files)',
          value: 'lintStaged',
          selected: true,
        },
        {
          title: 'Pre-commit hook (lint and format before commit)',
          value: 'preCommit',
          selected: true,
        },
      ],
      min: 1,
    });

    if (!features || features.length === 0) {
      logger.info('No features selected');
      return;
    }

    const packageManager = await detectPackageManager(cwd);

    // Install packages
    const packagesToInstall: string[] = [];

    if (features.includes('husky')) {
      packagesToInstall.push('husky');
    }

    if (features.includes('commitlint')) {
      packagesToInstall.push('@commitlint/cli', '@commitlint/config-conventional');
    }

    if (features.includes('lintStaged')) {
      packagesToInstall.push('lint-staged');
    }

    if (packagesToInstall.length > 0) {
      logger.info(`Installing packages with ${packageManager}...`);
      await addPackages(cwd, packageManager, packagesToInstall, true);
      logger.success('Packages installed');
    }

    // Initialize husky
    if (features.includes('husky')) {
      logger.info('Initializing husky...');

      try {
        // Run husky init
        await execa('npx', ['husky', 'init'], { cwd });
        logger.success('Husky initialized');
      } catch (error) {
        logger.warn('Failed to run husky init, creating .husky directory manually');
        await ensureDir(path.join(cwd, '.husky'));
      }
    }

    // Setup commitlint
    if (features.includes('commitlint')) {
      logger.info('Configuring commitlint...');

      const commitlintConfig = {
        extends: ['@commitlint/config-conventional'],
        rules: {
          'type-enum': [
            2,
            'always',
            [
              'feat',
              'fix',
              'docs',
              'style',
              'refactor',
              'perf',
              'test',
              'build',
              'ci',
              'chore',
              'revert',
            ],
          ],
          'subject-case': [2, 'always', 'lower-case'],
          'subject-empty': [2, 'never'],
          'subject-full-stop': [2, 'never', '.'],
          'header-max-length': [2, 'always', 100],
        },
      };

      await writeJSON(path.join(cwd, '.commitlintrc.json'), commitlintConfig);
      logger.success('Commitlint configured');

      // Create commit-msg hook
      const commitMsgHook = path.join(cwd, '.husky', 'commit-msg');
      const commitMsgContent = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit \${1}
`;

      await writeFile(commitMsgHook, commitMsgContent);

      // Make hook executable (Unix-like systems)
      try {
        await execa('chmod', ['+x', commitMsgHook], { cwd });
      } catch {
        // Ignore on Windows
      }

      logger.success('commit-msg hook created');
    }

    // Setup lint-staged
    if (features.includes('lintStaged')) {
      logger.info('Configuring lint-staged...');

      // Read package.json
      const packageJsonPath = path.join(cwd, 'package.json');
      const packageJson = await import('fs-extra').then((fs) => fs.readJSON(packageJsonPath));

      // Add lint-staged config
      packageJson['lint-staged'] = {
        '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
        '*.{json,md,yml,yaml}': ['prettier --write'],
      };

      await writeJSON(packageJsonPath, packageJson);
      logger.success('lint-staged configured in package.json');
    }

    // Setup pre-commit hook
    if (features.includes('preCommit') && features.includes('lintStaged')) {
      logger.info('Creating pre-commit hook...');

      const preCommitHook = path.join(cwd, '.husky', 'pre-commit');
      const preCommitContent = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
`;

      await writeFile(preCommitHook, preCommitContent);

      // Make hook executable (Unix-like systems)
      try {
        await execa('chmod', ['+x', preCommitHook], { cwd });
      } catch {
        // Ignore on Windows
      }

      logger.success('pre-commit hook created');
    }

    // Add husky install to package.json scripts
    if (features.includes('husky')) {
      const packageJsonPath = path.join(cwd, 'package.json');
      const packageJson = await import('fs-extra').then((fs) => fs.readJSON(packageJsonPath));

      if (!packageJson.scripts) {
        packageJson.scripts = {};
      }

      if (!packageJson.scripts.prepare) {
        packageJson.scripts.prepare = 'husky';
        await writeJSON(packageJsonPath, packageJson);
        logger.success('Added prepare script to package.json');
      }
    }

    console.log(picocolors.green('\n✨ Git hooks setup complete!\n'));
    console.log(picocolors.cyan('Next steps:'));
    console.log('  1. Try creating a commit: ff git commit');
    console.log('  2. Hooks will automatically validate your commits');
    console.log('  3. Run linters before each commit');
  } catch (error) {
    logger.error(`Failed to setup git hooks: ${(error as Error).message}`);
    if (options.debug) {
      console.error(error);
    }
    process.exit(1);
  }
}

/**
 * Register the setup hooks command
 */
export function registerSetupHooksCommand(program: Command): void {
  program
    .command('setup-hooks')
    .description('Setup git hooks with husky and commitlint')
    .option('-f, --force', 'Force reconfiguration')
    .option('--debug', 'Enable debug mode')
    .action(setupGitHooks);
}
