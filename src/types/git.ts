/**
 * Git-related type definitions
 */

/**
 * Conventional commit types
 */
export type CommitType =
  | 'feat'
  | 'fix'
  | 'docs'
  | 'style'
  | 'refactor'
  | 'perf'
  | 'test'
  | 'build'
  | 'ci'
  | 'chore'
  | 'revert';

/**
 * Commit type metadata
 */
export interface CommitTypeInfo {
  type: CommitType;
  description: string;
  emoji?: string;
}

/**
 * Git commit options
 */
export interface GitCommitOptions {
  type: CommitType;
  scope?: string;
  subject: string;
  body?: string;
  breaking?: string;
  issues?: string[];
  dryRun?: boolean;
}

/**
 * Git branch naming options
 */
export interface GitBranchOptions {
  type: 'feat' | 'fix' | 'chore' | 'refactor' | 'docs';
  name: string;
  issueNumber?: string;
  checkout?: boolean;
}

/**
 * Git hook setup options
 */
export interface GitHookSetupOptions {
  commitlint?: boolean;
  lintStaged?: boolean;
  preCommit?: boolean;
  prePush?: boolean;
  force?: boolean;
}

/**
 * PR template options
 */
export interface PRTemplateOptions {
  type: 'feature' | 'bugfix' | 'hotfix' | 'docs';
  includeChecklist?: boolean;
  includeRelatedIssues?: boolean;
  customTemplate?: string;
}

/**
 * Git status information
 */
export interface GitStatus {
  isRepo: boolean;
  branch: string;
  hasChanges: boolean;
  staged: string[];
  unstaged: string[];
  untracked: string[];
}

/**
 * Commit lint configuration
 */
export interface CommitlintConfig {
  extends: string[];
  rules?: Record<string, [number, string, unknown]>;
}

/**
 * Husky configuration
 */
export interface HuskyConfig {
  hooks: {
    'commit-msg'?: string;
    'pre-commit'?: string;
    'pre-push'?: string;
  };
}
