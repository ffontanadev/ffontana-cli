import type { Command } from 'commander';
import { registerGenerateTestCommand } from './generate-test.js';

/**
 * Register the springboot command and all its subcommands
 */
export function registerSpringBootCommand(program: Command): void {
  const springboot = program
    .command('springboot')
    .alias('sb')
    .description('Spring Boot utilities (test generation, scaffolding)');

  // Register subcommands
  registerGenerateTestCommand(springboot);
}
