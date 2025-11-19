import type { Command } from 'commander';
import { registerComponentCommand } from './component.js';
import { registerHookCommand } from './hook.js';
import { registerPageCommand } from './page.js';
import { registerElementCommand } from './element.js';

/**
 * Register the generate command and all its subcommands
 */
export function registerGenerateCommand(program: Command): void {
  const generate = program
    .command('generate')
    .alias('g')
    .description('Generate code (component, hook, page, element, etc.)');

  // Register subcommands
  registerComponentCommand(generate);
  registerHookCommand(generate);
  registerPageCommand(generate);
  registerElementCommand(generate);
}
