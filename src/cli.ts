import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { registerInitCommand } from './commands/init.js';
import { registerGenerateCommand } from './commands/generate/index.js';
import { registerConfigCommand } from './commands/config.js';
import { registerLintCommand } from './commands/tasks/lint.js';
import { registerFormatCommand } from './commands/tasks/format.js';
import { registerTestCommand } from './commands/tasks/test.js';
import { registerGitCommand } from './commands/git/index.js';
import { registerJenkinsCommand } from './commands/jenkins/index.js';
import { registerSpringBootCommand } from './commands/springboot/index.js';

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
registerConfigCommand(program);
registerGitCommand(program);
registerJenkinsCommand(program);
registerSpringBootCommand(program);

// Register task commands
registerLintCommand(program);
registerFormatCommand(program);
registerTestCommand(program);

// Parse arguments
program.parse();
