# Development Guide

> Complete guide for contributing to and extending ffontana-cli

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Build System](#build-system)
- [Testing](#testing)
- [Adding New Features](#adding-new-features)
- [Template Creation](#template-creation)
- [Debugging](#debugging)
- [Code Style](#code-style)
- [Common Tasks](#common-tasks)

---

## Getting Started

### Prerequisites

- **Node.js**: >= 18.0.0
- **Package Manager**: npm, pnpm, yarn, or bun
- **Git**: For version control

### Initial Setup

```bash
# 1. Clone the repository
git clone https://github.com/ffontanadev/ffontana-cli.git
cd ffontana-cli

# 2. Install dependencies
npm install

# 3. Build the project
npm run build

# 4. Link locally for testing
npm run link:local

# 5. Verify installation
ff --version
```

### Development Mode

```bash
# Watch mode - auto-rebuild on file changes
npm run dev

# In another terminal, test your changes
ff generate component TestComponent
```

---

## Project Structure

```
ffontana-cli/
├── src/                      # Source code
│   ├── cli.ts               # CLI entry point
│   ├── commands/            # Command implementations
│   │   ├── init.ts          # Project initialization
│   │   ├── config.ts        # Configuration management
│   │   ├── generate/        # Code generators
│   │   │   ├── index.ts     # Generate command router
│   │   │   ├── component.ts # Component generator
│   │   │   ├── hook.ts      # Hook generator
│   │   │   ├── page.ts      # Page generator (Next.js)
│   │   │   └── element.ts   # Element generator (Lit)
│   │   └── tasks/           # Task runners
│   │       ├── lint.ts      # Lint command
│   │       ├── format.ts    # Format command
│   │       └── test.ts      # Test command
│   ├── core/                # Core modules
│   │   ├── index.ts         # Core exports
│   │   ├── project-detector.ts  # Framework detection
│   │   ├── config-loader.ts     # Configuration management
│   │   └── template-engine.ts   # Template rendering
│   ├── types/               # TypeScript types
│   │   ├── index.ts         # Main type exports
│   │   ├── commands.ts      # Command option types
│   │   ├── config.ts        # Configuration schemas
│   │   └── plugin.ts        # Plugin interfaces (Phase 2)
│   └── utils/               # Utility functions
│       ├── index.ts         # Utility exports
│       ├── file-system.ts   # File operations
│       ├── logger.ts        # Logging utilities
│       ├── package-manager.ts   # Package manager detection
│       └── prompts.ts       # Interactive prompts
│
├── templates/               # Code templates
│   ├── react-ts/           # React TypeScript project template
│   ├── components/         # Component templates
│   │   ├── react/
│   │   ├── nextjs/
│   │   └── lit/
│   ├── hooks/              # Hook templates
│   │   └── react/
│   └── pages/              # Page templates
│       └── nextjs/
│
├── dist/                    # Build output (generated)
├── __tests__/              # Test files (mirrors src/)
├── docs/                   # Documentation
├── tsconfig.json           # TypeScript configuration
├── tsup.config.ts          # Build configuration
├── package.json            # Dependencies & scripts
├── vitest.config.ts        # Test configuration
└── eslint.config.js        # ESLint configuration
```

### File Naming Conventions

- **TypeScript files**: `kebab-case.ts`
- **Test files**: `*.test.ts`
- **Template files**: `*.hbs` (Handlebars)
- **Type definitions**: PascalCase for interfaces/types

---

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/add-vue-support
```

### 2. Make Changes

```bash
# Edit source files
vim src/commands/generate/component.ts

# Run in watch mode
npm run dev
```

### 3. Test Your Changes

```bash
# Type check
npm run type-check

# Run tests
npm test

# Test the CLI locally
ff generate component TestButton --debug
```

### 4. Format and Lint

```bash
# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format
```

### 5. Commit

```bash
git add .
git commit -m "feat: add Vue component generator"
```

---

## Build System

### Configuration (`tsup.config.ts`)

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli.ts'],           // Entry point
  format: ['esm'],                  // ES modules
  target: 'node18',                 // Node 18+ compatibility
  sourcemap: true,                  // Generate source maps
  clean: true,                      // Clean dist/ before build
  dts: true,                        // Generate .d.ts files
  shims: true,                      // Add __dirname/__filename shims
  splitting: false,                 // No code splitting
  banner: {
    js: '#!/usr/bin/env node',      // Shebang for CLI
  },
});
```

### Build Process

```bash
# Full build
npm run build

# Output:
# dist/
#   ├── cli.js          # Entry point (executable)
#   ├── cli.js.map      # Source map
#   ├── cli.d.ts        # Type definitions
#   ├── commands/       # Command modules
#   ├── core/           # Core modules
#   └── utils/          # Utilities
```

### Template Handling

Templates are **copied manually** during `npm run build`:

```json
{
  "files": [
    "dist",
    "templates"  // Templates included in published package
  ]
}
```

---

## Testing

### Test Framework: Vitest

#### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# UI mode (browser-based)
npm run test:ui

# Coverage report
npm run test:coverage
```

### Writing Tests

**Example: Testing `project-detector.ts`**

```typescript
// src/__tests__/core/project-detector.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { detectProject } from '../../core/project-detector.js';
import path from 'path';
import fs from 'fs-extra';

describe('detectProject', () => {
  const testDir = path.join(__dirname, 'test-project');

  beforeEach(async () => {
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    await fs.remove(testDir);
  });

  it('should detect React projects', async () => {
    // Setup: Create package.json with React
    await fs.writeJson(path.join(testDir, 'package.json'), {
      dependencies: { react: '^18.0.0' }
    });

    // Execute
    const project = await detectProject(testDir);

    // Assert
    expect(project.framework).toBe('react');
    expect(project.version).toBe('^18.0.0');
  });

  it('should prioritize Next.js over React', async () => {
    await fs.writeJson(path.join(testDir, 'package.json'), {
      dependencies: {
        next: '^14.0.0',
        react: '^18.0.0'
      }
    });

    const project = await detectProject(testDir);

    expect(project.framework).toBe('next');
  });
});
```

### Interactive Testing

Use the debug flag to test real CLI behavior:

```bash
# Create a test project
mkdir test-project && cd test-project
npm init -y
npm install react

# Test component generation
ff generate component Button --debug

# Inspect generated files
ls -la src/components/Button/
```

---

## Adding New Features

### Adding a New Command

**Example: Adding a `ff clean` command**

#### 1. Create Command File

```typescript
// src/commands/clean.ts
import type { Command } from 'commander';
import { logger } from '../utils/index.js';
import fs from 'fs-extra';
import path from 'path';

interface CleanOptions {
  force?: boolean;
  debug?: boolean;
}

export async function cleanProject(options: CleanOptions): Promise<void> {
  try {
    const cwd = process.cwd();
    const dirsToClean = [
      'node_modules',
      'dist',
      '.next',
      'build'
    ];

    for (const dir of dirsToClean) {
      const dirPath = path.join(cwd, dir);
      if (await fs.pathExists(dirPath)) {
        await fs.remove(dirPath);
        logger.success(`Removed ${dir}`);
      }
    }

    logger.success('Project cleaned successfully!');
  } catch (error) {
    logger.error(`Failed to clean project: ${(error as Error).message}`);
    process.exit(1);
  }
}

export function registerCleanCommand(program: Command): void {
  program
    .command('clean')
    .description('Remove generated files and dependencies')
    .option('-f, --force', 'Skip confirmation prompts')
    .option('--debug', 'Enable debug mode')
    .action(cleanProject);
}
```

#### 2. Register in CLI

```typescript
// src/cli.ts
import { registerCleanCommand } from './commands/clean.js';

// Add with other registrations
registerCleanCommand(program);
```

#### 3. Add Types

```typescript
// src/types/commands.ts
export interface CleanOptions {
  force?: boolean;
  debug?: boolean;
}
```

#### 4. Write Tests

```typescript
// src/__tests__/commands/clean.test.ts
import { describe, it, expect } from 'vitest';
import { cleanProject } from '../../commands/clean.js';
// ... test implementation
```

#### 5. Update Documentation

Add to `docs/COMMANDS.md` and update README.md

---

### Adding a New Generator

**Example: Adding a `ff generate service` command**

#### 1. Create Generator File

```typescript
// src/commands/generate/service.ts
import type { Command } from 'commander';
import { detectProject, loadConfig, renderTemplateToFile } from '../../core/index.js';
import { logger, promptServiceName } from '../../utils/index.js';
import path from 'path';

interface ServiceGenerateOptions {
  outDir?: string;
  typescript?: boolean;
  test?: boolean;
  debug?: boolean;
}

export async function generateService(
  name: string | undefined,
  options: ServiceGenerateOptions
): Promise<void> {
  const project = await detectProject();
  const config = await loadConfig();

  const serviceName = name ?? await promptServiceName();

  // Determine output directory
  const outDir = options.outDir ?? path.join(process.cwd(), 'src', 'services');

  // Template data
  const templateData = {
    name: serviceName,
    typescript: options.typescript ?? true
  };

  // Render template
  const ext = templateData.typescript ? 'ts' : 'js';
  const templatePath = path.join(__dirname, 'templates', 'service', `service.${ext}.hbs`);
  const outputPath = path.join(outDir, `${serviceName}.${ext}`);

  await renderTemplateToFile(templatePath, outputPath, templateData);

  logger.success(`✨ Service "${serviceName}" generated!`);
}

export function registerServiceCommand(program: Command): void {
  program
    .command('service')
    .alias('s')
    .description('Generate a new service')
    .argument('[name]', 'Service name')
    .option('--typescript', 'Use TypeScript')
    .option('--no-typescript', 'Use JavaScript')
    .option('--test', 'Generate test file')
    .option('-o, --out-dir <dir>', 'Output directory')
    .option('--debug', 'Enable debug mode')
    .action(generateService);
}
```

#### 2. Register in Generate Index

```typescript
// src/commands/generate/index.ts
import { registerServiceCommand } from './service.js';

export function registerGenerateCommand(program: Command): void {
  const generate = program
    .command('generate')
    .alias('g')
    .description('Generate code artifacts');

  registerComponentCommand(generate);
  registerHookCommand(generate);
  registerServiceCommand(generate);  // Add here
}
```

#### 3. Create Template

```handlebars
{{!-- templates/services/service.ts.hbs --}}
/**
 * {{pascalCase name}} Service
 */
export class {{pascalCase name}}Service {
  constructor() {
    // Initialize service
  }

  async execute(): Promise<void> {
    // Service logic
  }
}
```

---

## Template Creation

### Template Structure

Templates use **Handlebars syntax** with custom helpers.

#### Basic Template

```handlebars
{{!-- templates/components/react/component.tsx.hbs --}}
import React from 'react';

interface {{pascalCase name}}Props {
  // Define props
}

export const {{pascalCase name}}: React.FC<{{pascalCase name}}Props> = (props) => {
  return (
    <div className="{{kebabCase name}}">
      <h1>{{pascalCase name}}</h1>
    </div>
  );
};
```

### Available Helpers

```handlebars
{{!-- String transformations --}}
{{pascalCase name}}   → UserCard
{{camelCase name}}    → userCard
{{kebabCase name}}    → user-card
{{snakeCase name}}    → user_card

{{!-- Conditionals --}}
{{#if typescript}}
  TypeScript code
{{else}}
  JavaScript code
{{/if}}

{{#if (eq style 'css-modules')}}
  import styles from './{{name}}.module.css';
{{/if}}

{{!-- Comparisons --}}
{{#if (gt count 0)}}
  Has items
{{/if}}

{{#if (ne framework 'lit')}}
  Not Lit
{{/if}}
```

### Template Data Structure

```typescript
interface TemplateData {
  name: string;           // Component/hook/page name
  typescript: boolean;    // Use TypeScript?
  style?: StyleFormat;    // Style format (components only)
  test?: boolean;         // Generate test?
  story?: boolean;        // Generate story? (components only)
  framework?: Framework;  // Detected framework
}
```

### Testing Templates Manually

```bash
# 1. Create test template
echo 'export const {{pascalCase name}} = {};' > test.hbs

# 2. Test with CLI
ff generate component TestComp

# 3. Inspect output
cat src/components/TestComp/TestComp.tsx
```

---

## Debugging

### Debug Mode

Enable debug output with `--debug` flag:

```bash
ff generate component Button --debug

# Output includes:
# - Full stack traces
# - Template paths
# - Configuration merging
# - File operations
```

### Logging in Code

```typescript
import { logger } from '../utils/logger.js';

logger.info('Informational message');
logger.success('Success message');
logger.warn('Warning message');
logger.error('Error message');
logger.debug('Debug message (only with --debug flag)');
```

### Debugging with VS Code

**`.vscode/launch.json`:**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug CLI",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/dist/cli.js",
      "args": ["generate", "component", "TestButton", "--debug"],
      "cwd": "/path/to/test-project",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "sourceMaps": true
    }
  ]
}
```

### Inspecting Templates

```bash
# Find templates directory
find . -name "*.hbs"

# View template content
cat templates/components/react/component.tsx.hbs

# Test template rendering manually
node -e "
  const Handlebars = require('handlebars');
  const fs = require('fs');
  const tpl = fs.readFileSync('./templates/components/react/component.tsx.hbs', 'utf8');
  const compiled = Handlebars.compile(tpl);
  console.log(compiled({ name: 'TestComp', typescript: true }));
"
```

---

## Code Style

### TypeScript Guidelines

```typescript
// ✅ DO: Use explicit return types for public APIs
export async function detectProject(cwd: string): Promise<ProjectInfo> {
  // ...
}

// ✅ DO: Use type imports
import type { Command } from 'commander';

// ✅ DO: Use interfaces for object types
interface ComponentOptions {
  style: StyleFormat;
  test: boolean;
}

// ❌ DON'T: Use any
// ❌ DON'T: Use non-null assertions (!) without comments
// ❌ DON'T: Ignore TypeScript errors with @ts-ignore
```

### ESLint Rules

```javascript
// Key rules from eslint.config.js
{
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/explicit-function-return-type': 'warn',
  '@typescript-eslint/no-unused-vars': 'error',
  'no-console': ['warn', { allow: ['warn', 'error'] }]
}
```

### Formatting

```bash
# Check formatting
npm run format:check

# Auto-format
npm run format

# Prettier config (automatic via package.json)
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100
}
```

---

## Common Tasks

### Add a New Dependency

```bash
# Install runtime dependency
npm install new-package

# Install dev dependency
npm install -D new-dev-package

# Update types
npm install -D @types/new-package
```

### Update Documentation

```bash
# Edit docs
vim docs/COMMANDS.md

# Preview markdown (if using VS Code)
# Cmd+Shift+V (Mac) or Ctrl+Shift+V (Windows/Linux)
```

### Release a New Version

```bash
# 1. Update version
npm version patch  # or minor, major

# 2. Build
npm run build

# 3. Test locally
npm run link:local
ff --version

# 4. Publish (when ready)
npm publish
```

### Run Specific Tests

```bash
# Run tests matching pattern
npm test -- project-detector

# Run single test file
npm test -- src/__tests__/core/project-detector.test.ts

# Run with coverage
npm run test:coverage
```

### Profile Performance

```bash
# Time command execution
time ff generate component Button

# Node.js profiling
node --prof dist/cli.js generate component Button
node --prof-process isolate-*.log > profile.txt
```

### Check Bundle Size

```bash
# Build and analyze
npm run build
du -sh dist/

# Per-file breakdown
ls -lh dist/**/*.js
```

---

## Development Best Practices

### 1. Write Tests First (TDD)

```typescript
// 1. Write test
it('should detect Lit projects', async () => {
  const project = await detectProject(litProjectPath);
  expect(project.framework).toBe('lit');
});

// 2. Implement feature
export async function detectProject(cwd: string) {
  // Implementation
}

// 3. Run test
npm test
```

### 2. Use Type Guards

```typescript
function isReactProject(project: ProjectInfo): project is ReactProject {
  return project.framework === 'react';
}

if (isReactProject(project)) {
  // TypeScript knows project is ReactProject
}
```

### 3. Error Handling

```typescript
try {
  await riskyOperation();
} catch (error) {
  logger.error(`Operation failed: ${(error as Error).message}`);

  if (options.debug) {
    console.error(error);  // Full stack trace
  }

  process.exit(1);
}
```

### 4. Keep Functions Small

```typescript
// ✅ Good: Single responsibility
async function detectFramework(deps: Dependencies): Promise<Framework> { }
async function detectPackageManager(cwd: string): Promise<PackageManager> { }
async function detectTypeScript(cwd: string): Promise<boolean> { }

// ❌ Bad: God function
async function detectEverything() { }
```

---

## Troubleshooting

### "Command not found: ff"

```bash
# Re-link after build
npm run link:local

# Or use npx
npx . generate component Button
```

### "Module not found" Errors

```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Template Not Rendering Correctly

```bash
# Check template syntax
cat templates/path/to/template.hbs

# Test with minimal data
node -e "console.log(require('handlebars').compile('{{name}}')({ name: 'test' }))"
```

### Tests Failing After Changes

```bash
# Clear Vitest cache
npm test -- --no-cache

# Update snapshots (if using)
npm test -- -u
```

---

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Commander.js Docs](https://github.com/tj/commander.js)
- [Handlebars Guide](https://handlebarsjs.com/guide/)
- [Vitest Docs](https://vitest.dev/)
- [Zod Documentation](https://zod.dev/)

---

For more information:
- [Architecture Overview](./ARCHITECTURE.md)
- [API Reference](./API_REFERENCE.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
