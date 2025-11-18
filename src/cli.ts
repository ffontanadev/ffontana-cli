import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { registerInitCommand } from './commands/init.js';
import { registerGenerateCommand } from './commands/generate/index.js';

// Get package.json for version
const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJsonPath = join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as {
  version: string;
  description: string;
};

/**
 * Main CLI program
 */
const program = new Command();

program
  .name('ff')
  .description(packageJson.description)
  .version(packageJson.version, '-v, --version', 'Display version number')
  .helpOption('-h, --help', 'Display help for command');

// Register commands
registerInitCommand(program);
registerGenerateCommand(program);

// Parse arguments
program.parse();
