import { execa } from 'execa';
import type { GitStatus, CommitType, CommitTypeInfo } from '../types/index.js';
import { fileExists } from './file-system.js';
import path from 'path';

/**
 * Commit type definitions with descriptions
 */
export const COMMIT_TYPES: CommitTypeInfo[] = [
  { type: 'feat', description: 'A new feature', emoji: '✨' },
  { type: 'fix', description: 'A bug fix', emoji: '🐛' },
  { type: 'docs', description: 'Documentation only changes', emoji: '📚' },
  { type: 'style', description: 'Code style changes (formatting, semicolons, etc.)', emoji: '💄' },
  {
    type: 'refactor',
    description: 'Code change that neither fixes a bug nor adds a feature',
    emoji: '♻️',
  },
  { type: 'perf', description: 'Performance improvement', emoji: '⚡' },
  { type: 'test', description: 'Adding or updating tests', emoji: '✅' },
  { type: 'build', description: 'Build system or external dependencies', emoji: '🔧' },
  { type: 'ci', description: 'CI configuration changes', emoji: '👷' },
  { type: 'chore', description: 'Other changes that don\'t modify src or test files', emoji: '🔨' },
  { type: 'revert', description: 'Revert a previous commit', emoji: '⏪' },
];

/**
 * Check if current directory is a git repository
 */
export async function isGitRepository(cwd: string = process.cwd()): Promise<boolean> {
  try {
    await execa('git', ['rev-parse', '--git-dir'], { cwd });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get git status information
 */
export async function getGitStatus(cwd: string = process.cwd()): Promise<GitStatus> {
  const isRepo = await isGitRepository(cwd);

  if (!isRepo) {
    return {
      isRepo: false,
      branch: '',
      hasChanges: false,
      staged: [],
      unstaged: [],
      untracked: [],
    };
  }

  try {
    // Get current branch
    const { stdout: branch } = await execa('git', ['branch', '--show-current'], { cwd });

    // Get status
    const { stdout: status } = await execa('git', ['status', '--porcelain'], { cwd });

    const staged: string[] = [];
    const unstaged: string[] = [];
    const untracked: string[] = [];

    status.split('\n').forEach((line) => {
      if (!line) return;

      const statusCode = line.substring(0, 2);
      const filePath = line.substring(3);

      if (statusCode[0] !== ' ' && statusCode[0] !== '?') {
        staged.push(filePath);
      }
      if (statusCode[1] !== ' ' && statusCode[1] !== '?') {
        unstaged.push(filePath);
      }
      if (statusCode === '??') {
        untracked.push(filePath);
      }
    });

    return {
      isRepo: true,
      branch,
      hasChanges: staged.length > 0 || unstaged.length > 0 || untracked.length > 0,
      staged,
      unstaged,
      untracked,
    };
  } catch (error) {
    throw new Error(`Failed to get git status: ${(error as Error).message}`);
  }
}

/**
 * Format a conventional commit message
 */
export function formatCommitMessage(options: {
  type: CommitType;
  scope?: string;
  subject: string;
  body?: string;
  breaking?: string;
  issues?: string[];
}): string {
  const { type, scope, subject, body, breaking, issues } = options;

  // Header: type(scope): subject
  let message = type;
  if (scope) {
    message += `(${scope})`;
  }
  message += `: ${subject}`;

  // Body
  if (body) {
    message += `\n\n${body}`;
  }

  // Breaking changes
  if (breaking) {
    message += `\n\nBREAKING CHANGE: ${breaking}`;
  }

  // Related issues
  if (issues && issues.length > 0) {
    message += `\n\nCloses: ${issues.join(', ')}`;
  }

  return message;
}

/**
 * Create a git commit
 */
export async function createCommit(
  message: string,
  cwd: string = process.cwd()
): Promise<void> {
  try {
    await execa('git', ['commit', '-m', message], { cwd });
  } catch (error) {
    throw new Error(`Failed to create commit: ${(error as Error).message}`);
  }
}

/**
 * Stage files for commit
 */
export async function stageFiles(files: string[], cwd: string = process.cwd()): Promise<void> {
  try {
    await execa('git', ['add', ...files], { cwd });
  } catch (error) {
    throw new Error(`Failed to stage files: ${(error as Error).message}`);
  }
}

/**
 * Check if husky is installed
 */
export async function isHuskyInstalled(cwd: string = process.cwd()): Promise<boolean> {
  const huskyDir = path.join(cwd, '.husky');
  return await fileExists(huskyDir);
}

/**
 * Check if commitlint is configured
 */
export async function isCommitlintConfigured(cwd: string = process.cwd()): Promise<boolean> {
  const configFiles = [
    '.commitlintrc',
    '.commitlintrc.json',
    '.commitlintrc.js',
    '.commitlintrc.cjs',
    'commitlint.config.js',
    'commitlint.config.cjs',
  ];

  for (const configFile of configFiles) {
    const configPath = path.join(cwd, configFile);
    if (await fileExists(configPath)) {
      return true;
    }
  }

  return false;
}

/**
 * Get current git branch name
 */
export async function getCurrentBranch(cwd: string = process.cwd()): Promise<string> {
  try {
    const { stdout } = await execa('git', ['branch', '--show-current'], { cwd });
    return stdout;
  } catch (error) {
    throw new Error(`Failed to get current branch: ${(error as Error).message}`);
  }
}

/**
 * Create a new git branch
 */
export async function createBranch(
  branchName: string,
  checkout: boolean = true,
  cwd: string = process.cwd()
): Promise<void> {
  try {
    if (checkout) {
      await execa('git', ['checkout', '-b', branchName], { cwd });
    } else {
      await execa('git', ['branch', branchName], { cwd });
    }
  } catch (error) {
    throw new Error(`Failed to create branch: ${(error as Error).message}`);
  }
}

/**
 * Get recent commit messages
 */
export async function getRecentCommits(
  count: number = 10,
  cwd: string = process.cwd()
): Promise<string[]> {
  try {
    const { stdout } = await execa('git', ['log', `--max-count=${count}`, '--pretty=format:%s'], {
      cwd,
    });
    return stdout.split('\n').filter(Boolean);
  } catch (error) {
    return [];
  }
}

/**
 * Validate commit message against conventional commits format
 */
export function validateCommitMessage(message: string): {
  valid: boolean;
  error?: string;
} {
  // Basic conventional commit pattern: type(scope?): subject
  const pattern = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9-]+\))?:\s.+/;

  if (!pattern.test(message)) {
    return {
      valid: false,
      error:
        'Commit message must follow conventional commits format: type(scope): subject',
    };
  }

  // Check subject length (recommended max 50 chars for first line)
  const firstLine = message.split('\n')[0];
  if (firstLine && firstLine.length > 100) {
    return {
      valid: false,
      error: 'Commit message first line should be less than 100 characters',
    };
  }

  return { valid: true };
}
