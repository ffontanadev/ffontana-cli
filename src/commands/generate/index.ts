import type { Command } from 'commander';
import { registerComponentCommand } from './component.js';

/**
 * Register the generate command and all its subcommands
 */
export function registerGenerateCommand(program: Command): void {
  const generate = program
    .command('generate')
    .alias('g')
    .description('Generate code (component, hook, page, etc.)');

  // Register subcommands
  registerComponentCommand(generate);
}
