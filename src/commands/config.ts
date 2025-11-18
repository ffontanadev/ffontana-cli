import type { Command } from 'commander';
import type { ConfigCommandOptions } from '../types/index.js';
import { loadConfig } from '../core/index.js';
import { logger } from '../utils/index.js';
import picocolors from 'picocolors';

/**
 * Display configuration
 */
export async function displayConfig(options: ConfigCommandOptions): Promise<void> {
  try {
    const cwd = options.cwd ?? process.cwd();
    const config = await loadConfig(cwd);

    // Display config source
    if (options.source || options.verbose) {
      const sourceLabel = {
        default: 'Default',
        global: 'Global',
        workspace: 'Workspace',
        project: 'Project',
      }[config.source];

      console.log(picocolors.cyan(`\nConfiguration Source: ${sourceLabel}`));
      if (config.configPath) {
        console.log(picocolors.gray(`Path: ${config.configPath}`));
      }
      console.log();
    }

    // Display configuration
    console.log(picocolors.bold('\nCurrent Configuration:\n'));
    console.log(picocolors.cyan('Framework:'), config.framework);

    if (config.plugins && config.plugins.length > 0) {
      console.log(picocolors.cyan('\nPlugins:'));
      config.plugins.forEach((plugin) => {
        console.log(`  - ${plugin}`);
      });
    }

    if (config.generators) {
      console.log(picocolors.cyan('\nGenerators:'));

      if (config.generators.component) {
        console.log(picocolors.yellow('  Component:'));
        console.log(`    Style: ${config.generators.component.style}`);
        console.log(`    TypeScript: ${config.generators.component.typescript}`);
        console.log(`    Test: ${config.generators.component.test}`);
        console.log(`    Story: ${config.generators.component.story}`);
      }

      if (config.generators.hook) {
        console.log(picocolors.yellow('  Hook:'));
        console.log(`    TypeScript: ${config.generators.hook.typescript}`);
        console.log(`    Test: ${config.generators.hook.test}`);
      }

      if (config.generators.page) {
        console.log(picocolors.yellow('  Page:'));
        console.log(`    Style: ${config.generators.page.style}`);
        console.log(`    TypeScript: ${config.generators.page.typescript}`);
        console.log(`    Test: ${config.generators.page.test}`);
      }

      if (config.generators.element) {
        console.log(picocolors.yellow('  Element:'));
        console.log(`    TypeScript: ${config.generators.element.typescript}`);
        console.log(`    Test: ${config.generators.element.test}`);
      }
    }

    if (config.tasks) {
      console.log(picocolors.cyan('\nTasks:'));
      if (config.tasks.lint) {
        console.log(`  Lint: ${config.tasks.lint}`);
      }
      if (config.tasks.format) {
        console.log(`  Format: ${config.tasks.format}`);
      }
      if (config.tasks.test) {
        console.log(`  Test: ${config.tasks.test}`);
      }
    }

    if (config.templates) {
      const hasTemplates = Object.values(config.templates).some((t) => t !== undefined);
      if (hasTemplates) {
        console.log(picocolors.cyan('\nTemplate Overrides:'));
        if (config.templates.component) {
          console.log(`  Component: ${config.templates.component}`);
        }
        if (config.templates.hook) {
          console.log(`  Hook: ${config.templates.hook}`);
        }
        if (config.templates.page) {
          console.log(`  Page: ${config.templates.page}`);
        }
        if (config.templates.element) {
          console.log(`  Element: ${config.templates.element}`);
        }
      }
    }

    if (config.hooks) {
      const hookKeys = Object.keys(config.hooks);
      if (hookKeys.length > 0) {
        console.log(picocolors.cyan('\nHooks:'));
        hookKeys.forEach((key) => {
          console.log(`  ${key}: ${config.hooks![key]}`);
        });
      }
    }

    console.log(); // Empty line at the end
  } catch (error) {
    logger.error(`Failed to load configuration: ${(error as Error).message}`);
    if (options.debug) {
      console.error(error);
    }
    process.exit(1);
  }
}

/**
 * Register the config command
 */
export function registerConfigCommand(program: Command): void {
  program
    .command('config')
    .description('View and manage CLI configuration')
    .option('-s, --source', 'Show configuration source')
    .option('-g, --global', 'Show global configuration')
    .option('-v, --verbose', 'Verbose output')
    .option('--debug', 'Enable debug mode')
    .action(displayConfig);
}
