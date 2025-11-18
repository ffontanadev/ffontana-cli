# API Reference

> Complete programmatic API documentation for using ffontana-cli as a library

## Table of Contents

- [Installation](#installation)
- [Core Modules](#core-modules)
  - [Project Detector](#project-detector)
  - [Config Loader](#config-loader)
  - [Template Engine](#template-engine)
- [Utilities](#utilities)
  - [File System](#file-system)
  - [Logger](#logger)
  - [Package Manager](#package-manager)
  - [Prompts](#prompts)
- [Type Definitions](#type-definitions)
- [Configuration Schema](#configuration-schema)
- [Error Handling](#error-handling)
- [Usage Examples](#usage-examples)

---

## Installation

### As a CLI Tool

```bash
npm install -g ffontana-cli
```

### As a Library

```bash
npm install ffontana-cli
```

### TypeScript Support

Full TypeScript definitions are included. No need for `@types/*` packages.

```typescript
import { detectProject, loadConfig, renderTemplate } from 'ffontana-cli';
```

---

## Core Modules

### Project Detector

**Module**: `ffontana-cli/core`

Automatically detect project framework, TypeScript usage, and package manager.

#### `detectProject(cwd?)`

Detect all project information from a directory.

**Signature**:
```typescript
async function detectProject(cwd?: string): Promise<ProjectInfo>
```

**Parameters**:
- `cwd` (optional): Working directory. Defaults to `process.cwd()`

**Returns**: `Promise<ProjectInfo>`
```typescript
interface ProjectInfo {
  framework: 'react' | 'next' | 'lit' | 'unknown';
  version?: string;           // Framework version from package.json
  packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun';
  typescript: boolean;
  packageJsonPath: string;
  rootDir: string;
}
```

**Example**:
```typescript
import { detectProject } from 'ffontana-cli/core';

const project = await detectProject('/path/to/project');

console.log(project);
// {
//   framework: 'react',
//   version: '^18.2.0',
//   packageManager: 'pnpm',
//   typescript: true,
//   packageJsonPath: '/path/to/project/package.json',
//   rootDir: '/path/to/project'
// }
```

**Error Handling**:
```typescript
try {
  const project = await detectProject();
} catch (error) {
  // Thrown when no package.json found
  console.error('Not in a project directory');
}
```

---

#### `isFramework(framework, cwd?)`

Check if current directory uses a specific framework.

**Signature**:
```typescript
async function isFramework(
  framework: 'react' | 'next' | 'lit',
  cwd?: string
): Promise<boolean>
```

**Parameters**:
- `framework`: Framework to check for
- `cwd` (optional): Working directory

**Returns**: `Promise<boolean>`

**Example**:
```typescript
import { isFramework } from 'ffontana-cli/core';

if (await isFramework('next')) {
  console.log('This is a Next.js project');
}

// Check multiple frameworks
const isNext = await isFramework('next', './my-project');
const isReact = await isFramework('react', './my-project');
```

---

#### `ensureProject(cwd?)`

Validate that we're in a project directory, with user-friendly errors.

**Signature**:
```typescript
async function ensureProject(cwd?: string): Promise<ProjectInfo>
```

**Parameters**:
- `cwd` (optional): Working directory

**Returns**: `Promise<ProjectInfo>`

**Throws**: User-friendly error if not in a project

**Example**:
```typescript
import { ensureProject } from 'ffontana-cli/core';

try {
  const project = await ensureProject();
  // Guaranteed to be in a valid project
} catch (error) {
  console.error(error.message);
  // "Not in a project directory. Please run this command from a project root..."
}
```

---

### Config Loader

**Module**: `ffontana-cli/core`

Load and merge configurations from multiple sources.

#### `loadConfig(cwd?)`

Load complete configuration with cascading from all sources.

**Signature**:
```typescript
async function loadConfig(cwd?: string): Promise<ResolvedConfig>
```

**Parameters**:
- `cwd` (optional): Working directory

**Returns**: `Promise<ResolvedConfig>`
```typescript
interface ResolvedConfig extends FFConfig {
  configPath?: string;
  source: 'global' | 'workspace' | 'project' | 'default';
}

interface FFConfig {
  framework: 'react' | 'next' | 'lit' | 'auto';
  plugins: string[];
  generators?: GeneratorsConfig;
  tasks?: TasksConfig;
  templates?: TemplatesConfig;
  hooks?: HooksConfig;
}
```

**Example**:
```typescript
import { loadConfig } from 'ffontana-cli/core';

const config = await loadConfig();

console.log(config);
// {
//   framework: 'react',
//   plugins: [],
//   generators: {
//     component: {
//       style: 'css-modules',
//       typescript: true,
//       test: true,
//       story: false
//     }
//   },
//   tasks: {
//     lint: 'eslint src',
//     test: 'vitest'
//   },
//   source: 'project',
//   configPath: '/path/to/ff.config.ts'
// }
```

**Configuration Resolution**:
```typescript
// Order of precedence (highest to lowest):
// 1. Project config (ff.config.ts, ff.config.js, ff.config.json, .ffrc)
// 2. Workspace config (.ff/config.json)
// 3. Global config (~/.config/ff-cli/config.json)
// 4. Default config

const config = await loadConfig();
config.source // 'project' | 'workspace' | 'global' | 'default'
```

---

#### `getConfigValue(key, cwd?)`

Get a specific configuration value.

**Signature**:
```typescript
async function getConfigValue<K extends keyof FFConfig>(
  key: K,
  cwd?: string
): Promise<FFConfig[K]>
```

**Parameters**:
- `key`: Configuration key to retrieve
- `cwd` (optional): Working directory

**Returns**: Configuration value for the specified key

**Example**:
```typescript
import { getConfigValue } from 'ffontana-cli/core';

// Get generator config
const componentConfig = await getConfigValue('generators');
console.log(componentConfig.component.style); // 'css-modules'

// Get tasks
const tasks = await getConfigValue('tasks');
console.log(tasks.lint); // 'eslint src'

// Get framework
const framework = await getConfigValue('framework');
console.log(framework); // 'react'
```

---

### Template Engine

**Module**: `ffontana-cli/core`

Handlebars-based template rendering with custom helpers.

#### `renderTemplate(templatePath, data)`

Render a template file with data.

**Signature**:
```typescript
async function renderTemplate(
  templatePath: string,
  data: TemplateData
): Promise<string>
```

**Parameters**:
- `templatePath`: Absolute path to `.hbs` template file
- `data`: Template variables

**Returns**: `Promise<string>` - Rendered template content

**Example**:
```typescript
import { renderTemplate } from 'ffontana-cli/core';
import path from 'path';

const templatePath = path.join(__dirname, 'templates', 'component.tsx.hbs');
const data = {
  name: 'UserCard',
  typescript: true,
  style: 'css-modules'
};

const rendered = await renderTemplate(templatePath, data);
console.log(rendered);
// import React from 'react';
// import styles from './UserCard.module.css';
// ...
```

---

#### `renderTemplateString(templateString, data)`

Render a template from a string (no file I/O).

**Signature**:
```typescript
function renderTemplateString(
  templateString: string,
  data: TemplateData
): string
```

**Parameters**:
- `templateString`: Handlebars template as a string
- `data`: Template variables

**Returns**: `string` - Rendered output

**Example**:
```typescript
import { renderTemplateString } from 'ffontana-cli/core';

const template = 'export const {{pascalCase name}} = {};';
const rendered = renderTemplateString(template, { name: 'userService' });

console.log(rendered);
// export const UserService = {};
```

**Interactive Example - Custom Code Generator**:
```typescript
import { renderTemplateString } from 'ffontana-cli/core';

// Define your template
const serviceTemplate = `
/**
 * {{pascalCase name}} Service
 */
export class {{pascalCase name}}Service {
  private endpoint = '/api/{{kebabCase name}}';

  async get{{pascalCase name}}(id: string) {
    return fetch(\`\${this.endpoint}/\${id}\`);
  }

  async create{{pascalCase name}}(data: {{pascalCase name}}Input) {
    return fetch(this.endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}
`;

// Generate for different entities
['user', 'product', 'order'].forEach(entity => {
  const code = renderTemplateString(serviceTemplate, { name: entity });
  console.log(code);
});

// Output:
// UserService with /api/user endpoint
// ProductService with /api/product endpoint
// OrderService with /api/order endpoint
```

---

#### `renderTemplateToFile(templatePath, outputPath, data)`

Render a template and write to file (creates directories if needed).

**Signature**:
```typescript
async function renderTemplateToFile(
  templatePath: string,
  outputPath: string,
  data: TemplateData
): Promise<void>
```

**Parameters**:
- `templatePath`: Path to template file
- `outputPath`: Destination file path
- `data`: Template variables

**Returns**: `Promise<void>`

**Example**:
```typescript
import { renderTemplateToFile } from 'ffontana-cli/core';
import path from 'path';

await renderTemplateToFile(
  './templates/component.tsx.hbs',
  './src/components/Button/Button.tsx',
  { name: 'Button', style: 'css-modules' }
);
// File created at ./src/components/Button/Button.tsx
```

---

#### `renderTemplates(templates)`

Batch render multiple templates in parallel.

**Signature**:
```typescript
async function renderTemplates(
  templates: Array<{
    templatePath: string;
    outputPath: string;
    data: TemplateData;
  }>
): Promise<void>
```

**Parameters**:
- `templates`: Array of template configurations

**Returns**: `Promise<void>`

**Example**:
```typescript
import { renderTemplates } from 'ffontana-cli/core';

await renderTemplates([
  {
    templatePath: './templates/component.tsx.hbs',
    outputPath: './src/components/Button/Button.tsx',
    data: { name: 'Button' }
  },
  {
    templatePath: './templates/component.test.tsx.hbs',
    outputPath: './src/components/Button/Button.test.tsx',
    data: { name: 'Button' }
  },
  {
    templatePath: './templates/component.module.css.hbs',
    outputPath: './src/components/Button/Button.module.css',
    data: { name: 'Button' }
  }
]);
// All files rendered in parallel
```

---

## Utilities

### File System

**Module**: `ffontana-cli/utils`

Enhanced file system operations with better error handling.

#### Available Functions

```typescript
// Read operations
async function fileExists(path: string): Promise<boolean>
async function readFile(path: string): Promise<string>
async function readJSON<T>(path: string): Promise<T>

// Write operations
async function writeFile(path: string, content: string): Promise<void>
async function writeJSON(path: string, data: unknown): Promise<void>

// Directory operations
async function ensureDir(path: string): Promise<void>
async function isEmptyDir(path: string): Promise<boolean>
async function copy(src: string, dest: string): Promise<void>

// Path utilities
async function getProjectRoot(cwd: string): Promise<string | null>
async function findUp(filename: string, cwd: string): Promise<string | null>
function getDirname(importMetaUrl: string): string
```

**Example**:
```typescript
import {
  fileExists,
  readJSON,
  writeJSON,
  ensureDir,
  copy
} from 'ffontana-cli/utils';

// Check if file exists
if (await fileExists('./config.json')) {
  const config = await readJSON('./config.json');
}

// Create directory and write file
await ensureDir('./output');
await writeJSON('./output/data.json', { foo: 'bar' });

// Copy directory
await copy('./template', './new-project');
```

---

### Logger

**Module**: `ffontana-cli/utils`

Colored console output with consistent formatting.

#### Logger API

```typescript
interface Logger {
  info(message: string): void;
  success(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  debug(message: string): void;  // Only shown with --debug
}
```

**Example**:
```typescript
import { logger } from 'ffontana-cli/utils';

logger.info('Starting process...');
logger.success('✨ Process completed!');
logger.warn('⚠️  Deprecated API used');
logger.error('❌ Operation failed');
logger.debug('Debug info (only with --debug flag)');
```

**Output Colors**:
- `info`: Cyan
- `success`: Green
- `warn`: Yellow
- `error`: Red
- `debug`: Gray (only shown with debug flag)

---

### Package Manager

**Module**: `ffontana-cli/utils`

Package manager detection and operations.

#### `detectPackageManager(cwd?)`

Detect package manager from lockfiles.

**Signature**:
```typescript
async function detectPackageManager(
  cwd?: string
): Promise<'npm' | 'pnpm' | 'yarn' | 'bun'>
```

**Detection Logic**:
```typescript
// Priority order:
if (pnpm-lock.yaml exists) → 'pnpm'
else if (yarn.lock exists) → 'yarn'
else if (bun.lockb exists) → 'bun'
else if (package-lock.json exists) → 'npm'
else → 'npm' (default)
```

**Example**:
```typescript
import { detectPackageManager } from 'ffontana-cli/utils';

const pm = await detectPackageManager();
console.log(`Using: ${pm}`);

// Install dependencies with detected PM
import { installDependencies } from 'ffontana-cli/utils';
await installDependencies(process.cwd(), pm);
```

---

#### `installDependencies(cwd, packageManager)`

Install dependencies using specified package manager.

**Signature**:
```typescript
async function installDependencies(
  cwd: string,
  packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun'
): Promise<void>
```

**Example**:
```typescript
import { installDependencies } from 'ffontana-cli/utils';

await installDependencies('./my-project', 'pnpm');
// Runs: pnpm install in ./my-project
```

---

### Prompts

**Module**: `ffontana-cli/utils`

Interactive CLI prompts for user input.

#### Available Prompts

```typescript
// Component prompts
async function promptComponentName(): Promise<string>
async function promptComponentOptions(): Promise<{
  style: StyleFormat;
  test: boolean;
  story: boolean;
}>

// Project prompts
async function promptProjectName(): Promise<string>
async function promptTemplate(): Promise<string>
async function promptPackageManager(): Promise<PackageManager>

// Generic prompts
async function promptConfirm(message: string, initial?: boolean): Promise<boolean>
async function promptOverwrite(path: string): Promise<boolean>
```

**Example**:
```typescript
import { promptComponentName, promptConfirm } from 'ffontana-cli/utils';

// Get component name from user
const name = await promptComponentName();
// User enters: "UserCard"

// Confirmation prompt
const shouldContinue = await promptConfirm('Overwrite existing files?', false);
if (shouldContinue) {
  // Proceed with operation
}
```

**Interactive Example - Custom Generator**:
```typescript
import { promptComponentName, renderTemplateToFile } from 'ffontana-cli';
import prompts from 'prompts';

async function generateCustomComponent() {
  // Get component name
  const name = await promptComponentName();

  // Custom options
  const { styling, features } = await prompts([
    {
      type: 'select',
      name: 'styling',
      message: 'Choose styling solution',
      choices: [
        { title: 'Tailwind', value: 'tailwind' },
        { title: 'CSS Modules', value: 'css-modules' },
        { title: 'Styled Components', value: 'styled' }
      ]
    },
    {
      type: 'multiselect',
      name: 'features',
      message: 'Select features',
      choices: [
        { title: 'State Management', value: 'state' },
        { title: 'API Integration', value: 'api' },
        { title: 'Form Handling', value: 'form' }
      ]
    }
  ]);

  // Render with custom data
  await renderTemplateToFile(
    './my-template.hbs',
    `./src/components/${name}.tsx`,
    { name, styling, features }
  );
}
```

---

## Type Definitions

### Core Types

```typescript
// Project Information
interface ProjectInfo {
  framework: 'react' | 'next' | 'lit' | 'unknown';
  version?: string;
  packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun';
  typescript: boolean;
  packageJsonPath: string;
  rootDir: string;
}

// Framework
type Framework = 'react' | 'next' | 'lit' | 'auto';

// Style Formats
type StyleFormat = 'css' | 'scss' | 'styled' | 'tailwind' | 'css-modules';

// Package Manager
type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';
```

### Configuration Types

```typescript
interface FFConfig {
  framework: Framework;
  plugins: string[];
  generators?: GeneratorsConfig;
  tasks?: TasksConfig;
  templates?: TemplatesConfig;
  hooks?: HooksConfig;
}

interface GeneratorsConfig {
  component?: ComponentGeneratorConfig;
  hook?: HookGeneratorConfig;
  page?: PageGeneratorConfig;
  element?: ElementGeneratorConfig;
}

interface ComponentGeneratorConfig {
  style: StyleFormat;
  typescript: boolean;
  test: boolean;
  story: boolean;
}

interface TasksConfig {
  lint?: string;
  test?: string;
  format?: string;
}
```

### Command Option Types

```typescript
interface ComponentGenerateOptions {
  style?: StyleFormat;
  test?: boolean;
  story?: boolean;
  typescript?: boolean;
  outDir?: string;
  force?: boolean;
  debug?: boolean;
  cwd?: string;
}

interface InitCommandOptions {
  template?: string;
  skipGit?: boolean;
  skipInstall?: boolean;
  packageManager?: PackageManager;
  debug?: boolean;
  cwd?: string;
}
```

---

## Configuration Schema

### Zod Schema Exports

All configuration is validated with Zod. Schemas are exported for reuse:

```typescript
import {
  FFConfigSchema,
  ComponentGeneratorConfigSchema,
  HookGeneratorConfigSchema,
  PageGeneratorConfigSchema,
  TasksConfigSchema
} from 'ffontana-cli/types';

// Validate user config
const userConfig = {
  framework: 'react',
  generators: {
    component: {
      style: 'tailwind',
      test: true
    }
  }
};

try {
  const validated = FFConfigSchema.parse(userConfig);
  // Config is valid
} catch (error) {
  // Zod validation error
  console.error(error.issues);
}
```

### Schema Definitions

```typescript
// Component Generator Schema
const ComponentGeneratorConfigSchema = z.object({
  style: z.enum(['css', 'scss', 'styled', 'tailwind', 'css-modules']).default('css-modules'),
  typescript: z.boolean().default(true),
  test: z.boolean().default(true),
  story: z.boolean().default(false),
});

// Main Config Schema
const FFConfigSchema = z.object({
  framework: z.enum(['react', 'next', 'lit', 'auto']).default('auto'),
  plugins: z.array(z.string()).default([]),
  generators: GeneratorsConfigSchema.optional(),
  tasks: TasksConfigSchema.optional(),
  templates: TemplatesConfigSchema.optional(),
  hooks: HooksConfigSchema.optional(),
});
```

---

## Error Handling

### Common Errors

```typescript
// Project not found
try {
  await detectProject();
} catch (error) {
  // Error: No package.json found
}

// Invalid configuration
try {
  const config = FFConfigSchema.parse(invalidConfig);
} catch (error) {
  // ZodError with detailed issues
  error.issues.forEach(issue => {
    console.log(issue.path, issue.message);
  });
}

// Template not found
try {
  await renderTemplate('./missing.hbs', {});
} catch (error) {
  // Error: ENOENT: no such file or directory
}
```

### Error Types

```typescript
// File system errors
class FileNotFoundError extends Error {
  code: 'ENOENT';
}

// Validation errors
class ZodError extends Error {
  issues: ZodIssue[];
}

// Project errors
class ProjectNotFoundError extends Error {
  message: 'No package.json found. Are you in a project directory?';
}
```

---

## Usage Examples

### Example 1: Custom Code Generator

```typescript
import {
  detectProject,
  loadConfig,
  renderTemplateToFile
} from 'ffontana-cli/core';
import { logger } from 'ffontana-cli/utils';
import path from 'path';

async function generateService(name: string) {
  try {
    // Detect project context
    const project = await detectProject();
    logger.info(`Detected ${project.framework} project`);

    // Load configuration
    const config = await loadConfig();

    // Determine file extension
    const ext = project.typescript ? 'ts' : 'js';

    // Render template
    const templatePath = path.join(__dirname, `templates/service.${ext}.hbs`);
    const outputPath = path.join(
      process.cwd(),
      'src/services',
      `${name}.${ext}`
    );

    await renderTemplateToFile(templatePath, outputPath, {
      name,
      typescript: project.typescript
    });

    logger.success(`✨ Service "${name}" generated!`);
  } catch (error) {
    logger.error(`Failed to generate service: ${error.message}`);
  }
}

// Usage
await generateService('AuthService');
```

---

### Example 2: Programmatic Project Initialization

```typescript
import { renderTemplates, copy, ensureDir } from 'ffontana-cli';
import { installDependencies } from 'ffontana-cli/utils';
import path from 'path';

async function initCustomProject(name: string) {
  const projectDir = path.join(process.cwd(), name);

  // Create project directory
  await ensureDir(projectDir);

  // Copy base template
  await copy('./templates/react-base', projectDir);

  // Customize package.json
  const packageJson = {
    name,
    version: '1.0.0',
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0'
    }
  };

  await writeJSON(
    path.join(projectDir, 'package.json'),
    packageJson
  );

  // Generate additional files
  await renderTemplates([
    {
      templatePath: './templates/README.md.hbs',
      outputPath: path.join(projectDir, 'README.md'),
      data: { name }
    },
    {
      templatePath: './templates/App.tsx.hbs',
      outputPath: path.join(projectDir, 'src/App.tsx'),
      data: { name }
    }
  ]);

  // Install dependencies
  await installDependencies(projectDir, 'pnpm');

  console.log(`✨ Project "${name}" created!`);
}

await initCustomProject('my-app');
```

---

### Example 3: Config-based Workflow

```typescript
import { loadConfig, getConfigValue } from 'ffontana-cli/core';
import { execa } from 'execa';

async function runProjectTasks() {
  const config = await loadConfig();

  // Run tasks from config
  if (config.tasks?.lint) {
    console.log('Running lint...');
    await execa(config.tasks.lint, { shell: true, stdio: 'inherit' });
  }

  if (config.tasks?.test) {
    console.log('Running tests...');
    await execa(config.tasks.test, { shell: true, stdio: 'inherit' });
  }

  if (config.tasks?.format) {
    console.log('Formatting code...');
    await execa(config.tasks.format, { shell: true, stdio: 'inherit' });
  }
}

await runProjectTasks();
```

---

### Example 4: Framework-specific Logic

```typescript
import { detectProject, isFramework } from 'ffontana-cli/core';

async function generateComponent(name: string) {
  const project = await detectProject();

  let templatePath: string;
  let outputDir: string;

  // Framework-specific paths
  if (project.framework === 'next') {
    templatePath = './templates/nextjs-component.tsx.hbs';
    outputDir = 'src/components';
  } else if (project.framework === 'lit') {
    templatePath = './templates/lit-element.ts.hbs';
    outputDir = 'src/elements';
  } else {
    templatePath = './templates/react-component.tsx.hbs';
    outputDir = 'src/components';
  }

  await renderTemplateToFile(
    templatePath,
    path.join(outputDir, `${name}.tsx`),
    { name }
  );
}

// Or use isFramework helper
if (await isFramework('next')) {
  console.log('Using Next.js-specific logic');
}
```

---

For more information:
- [Architecture Documentation](./ARCHITECTURE.md)
- [Development Guide](./DEVELOPMENT.md)
- [Command Reference](./COMMANDS.md)
- [Configuration Guide](./CONFIGURATION.md)
