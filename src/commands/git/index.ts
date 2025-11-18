import type { Command } from 'commander';
import { registerCommitCommand } from './commit.js';
import { registerSetupHooksCommand } from './setup-hooks.js';
import { registerBranchCommand } from './branch.js';
import { registerPRCommand } from './pr.js';

/**
 * Register the git command and all its subcommands
 */
export function registerGitCommand(program: Command): void {
  const git = program
    .command('git')
    .description('Git workflow helpers (conventional commits, hooks, branches)');

  // Register subcommands
  registerCommitCommand(git);
  registerSetupHooksCommand(git);
  registerBranchCommand(git);
  registerPRCommand(git);
}
