import type { Command } from 'commander';
import { registerJenkinsListenCommand } from './listen.js';

/**
 * Register the jenkins command and all its subcommands
 */
export function registerJenkinsCommand(program: Command): void {
  const jenkins = program
    .command('jenkins')
    .description('Jenkins integration (webhooks, API polling, auto-testing)');

  // Register subcommands
  registerJenkinsListenCommand(jenkins);
}
