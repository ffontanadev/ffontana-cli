# Command Reference

> Complete reference for all ffontana-cli commands, options, and usage patterns

## Table of Contents

- [Overview](#overview)
- [Global Options](#global-options)
- [Project Initialization](#project-initialization)
- [Code Generation](#code-generation)
  - [Component Generation](#component-generation)
  - [Hook Generation](#hook-generation)
  - [Page Generation](#page-generation)
  - [Element Generation](#element-generation)
- [Configuration Management](#configuration-management)
- [Task Runners](#task-runners)
- [Interactive vs Non-Interactive Modes](#interactive-vs-non-interactive-modes)
- [Common Workflows](#common-workflows)
- [Troubleshooting](#troubleshooting)

---

## Overview

The `ff` CLI provides a unified interface for frontend development tasks across React, Next.js, and Lit projects.

### Basic Syntax

```bash
ff <command> [subcommand] [arguments] [options]
```

### Getting Help

```bash
# General help
ff --help

# Command-specific help
ff init --help
ff generate --help
ff generate component --help
```

### Version Information

```bash
ff --version
# or
ff -v
```

---

## Global Options

Options available for all commands:

| Option | Alias | Description |
|--------|-------|-------------|
| `--help` | `-h` | Display help for command |
| `--version` | `-v` | Display version number |
| `--debug` | | Enable debug mode (verbose output, stack traces) |

**Example**:
```bash
ff generate component Button --debug
```

---

## Project Initialization

### `ff init [name]`

Initialize a new project from a template.

#### Syntax

```bash
ff init [name] [options]
```

#### Arguments

- `name` (optional): Project name/directory. If omitted, will prompt interactively.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `-t, --template <template>` | string | (prompt) | Template to use |
| `--skip-git` | boolean | `false` | Skip git repository initialization |
| `--skip-install` | boolean | `false` | Skip dependency installation |
| `--package-manager <pm>` | string | (auto-detect) | Package manager: `npm`, `pnpm`, `yarn`, `bun` |
| `--typescript` | boolean | `true` | Use TypeScript |
| `--debug` | boolean | `false` | Enable debug mode |

#### Available Templates

| Template | Description | Status |
|----------|-------------|--------|
| `react-ts` | React 18+ with TypeScript, Vite, ESLint, Tailwind | ✅ Available |
| `nextjs-app` | Next.js 14+ with App Router | 🚧 Coming soon |
| `lit-component` | Lit web components with TypeScript | 🚧 Coming soon |

#### Examples

**Interactive mode** (prompts for all options):
```bash
ff init
```

**Quick React project**:
```bash
ff init my-app
# Uses react-ts template by default
```

**Specify all options**:
```bash
ff init my-next-app \
  --template nextjs-app \
  --package-manager pnpm \
  --skip-git
```

**Skip installation for later**:
```bash
ff init my-app --skip-install
cd my-app
pnpm install
```

#### Output Structure

```
my-app/
├── .git/                    # Git repository (unless --skip-git)
├── node_modules/            # Dependencies (unless --skip-install)
├── src/
│   ├── components/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

#### Process Flow

```
1. Prompt for project name (if not provided)
2. Prompt for template (if not provided)
3. Check if directory exists/is empty
4. Create project directory
5. Copy template files
6. Update package.json with project name
7. Initialize git (unless --skip-git)
8. Install dependencies (unless --skip-install)
9. Display next steps
```

---

## Code Generation

### `ff generate` (alias: `ff g`)

Parent command for all code generators.

```bash
ff generate <generator> [name] [options]
# or
ff g <generator> [name] [options]
```

**Available generators**:
- `component` (alias: `c`) - UI components
- `hook` (alias: `h`) - React hooks
- `page` (alias: `p`) - Next.js pages
- `element` (alias: `e`) - Lit elements

---

### Component Generation

#### `ff generate component [name]` (alias: `ff g c`)

Generate a new component with optional tests and stories.

#### Syntax

```bash
ff generate component [name] [options]
ff g c [name] [options]
```

#### Arguments

- `name` (optional): Component name in any case (will be converted to PascalCase)

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `-s, --style <format>` | string | `css-modules` | Style format |
| `--test` | boolean | `true` | Generate test file |
| `--no-test` | boolean | | Skip test file |
| `--story` | boolean | `false` | Generate Storybook story |
| `--no-story` | boolean | | Skip story file |
| `--typescript` | boolean | `true` | Use TypeScript |
| `--no-typescript` | boolean | | Use JavaScript |
| `-o, --out-dir <dir>` | string | `src/components` | Output directory |
| `-f, --force` | boolean | `false` | Overwrite existing files |
| `--debug` | boolean | `false` | Enable debug mode |

#### Style Formats

| Format | File Extension | Use Case |
|--------|----------------|----------|
| `css` | `.css` | Plain CSS |
| `scss` | `.scss` | Sass/SCSS |
| `css-modules` | `.module.css` | CSS Modules (scoped styles) |
| `styled` | N/A | Styled Components (no separate file) |
| `tailwind` | N/A | Tailwind CSS (utility classes) |

#### Examples

**Interactive mode**:
```bash
ff g c
# Prompts for name, style, tests, and stories
```

**Quick component with defaults**:
```bash
ff g c Button
# Creates Button.tsx with CSS Modules and test
```

**Full configuration**:
```bash
ff g c Card --style=tailwind --story --no-test
# Card.tsx with Tailwind CSS and Storybook story, no test
```

**Custom output directory**:
```bash
ff g c Modal --out-dir src/ui/modals
# Creates src/ui/modals/Modal/
```

**JavaScript component**:
```bash
ff g c Header --no-typescript --style=scss
# Header.jsx with SCSS file
```

**Force overwrite existing**:
```bash
ff g c Button --force
# Overwrites existing Button component without prompting
```

#### Output Structure

**TypeScript + CSS Modules + Test + Story**:
```
src/components/Button/
├── Button.tsx
├── Button.module.css
├── Button.test.tsx
└── Button.stories.tsx
```

**JavaScript + Plain CSS**:
```
src/components/Header/
├── Header.jsx
├── Header.css
└── Header.test.jsx
```

**Styled Components** (no separate style file):
```
src/components/Card/
├── Card.tsx
└── Card.test.tsx
```

#### Generated File Examples

**Button.tsx** (React + CSS Modules):
```tsx
import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children }) => {
  return (
    <button className={styles.button}>
      {children}
    </button>
  );
};
```

**Button.test.tsx**:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should render correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

---

### Hook Generation

#### `ff generate hook [name]` (alias: `ff g h`)

Generate a new React hook (React and Next.js projects only).

#### Syntax

```bash
ff generate hook [name] [options]
ff g h [name] [options]
```

#### Arguments

- `name` (optional): Hook name. Automatically prefixed with `use` if not provided.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--test` | boolean | `true` | Generate test file |
| `--no-test` | boolean | | Skip test file |
| `--typescript` | boolean | `true` | Use TypeScript |
| `--no-typescript` | boolean | | Use JavaScript |
| `-o, --out-dir <dir>` | string | `src/hooks` | Output directory |
| `-f, --force` | boolean | `false` | Overwrite existing files |
| `--debug` | boolean | `false` | Enable debug mode |

#### Examples

**Interactive mode**:
```bash
ff g h
# Prompts for hook name and options
```

**Simple hook**:
```bash
ff g h useCounter
# Creates useCounter.ts with test
```

**Auto-prefix with 'use'**:
```bash
ff g h Counter
# Creates useCounter.ts (automatically prefixed)
```

**Without test**:
```bash
ff g h useLocalStorage --no-test
```

**Custom output directory**:
```bash
ff g h useAuth --out-dir src/hooks/auth
```

#### Output Structure

```
src/hooks/
├── useCounter.ts
└── useCounter.test.ts
```

#### Generated Hook Example

**useCounter.ts**:
```typescript
import { useState } from 'react';

interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export function useCounter(initialValue: number = 0): UseCounterReturn {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}
```

#### Framework Restrictions

Hooks are only generated in React and Next.js projects:

```bash
# In Lit project
ff g h useCounter
# Error: Hook generation is only supported in React and Next.js projects
```

---

### Page Generation

#### `ff generate page [name]` (alias: `ff g p`)

Generate a new Next.js App Router page (Next.js projects only).

#### Syntax

```bash
ff generate page [name] [options]
ff g p [name] [options]
```

#### Arguments

- `name` (optional): Page/route name

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `-s, --style <format>` | string | `css-modules` | Style format (css, scss, tailwind, css-modules) |
| `--test` | boolean | `true` | Generate test file |
| `--no-test` | boolean | | Skip test file |
| `--typescript` | boolean | `true` | Use TypeScript |
| `--no-typescript` | boolean | | Use JavaScript |
| `--dynamic` | boolean | `false` | Create dynamic route segment |
| `-o, --out-dir <dir>` | string | `app/[name]` | Output directory |
| `-f, --force` | boolean | `false` | Overwrite existing files |
| `--debug` | boolean | `false` | Enable debug mode |

#### Examples

**Interactive mode**:
```bash
ff g p
# Prompts for page name, style, and options
```

**Simple page**:
```bash
ff g p about
# Creates app/about/page.tsx
```

**Dynamic route**:
```bash
ff g p product --dynamic
# Creates app/[product]/page.tsx
```

**With Tailwind CSS**:
```bash
ff g p dashboard --style=tailwind
```

**Nested route**:
```bash
ff g p settings/profile --out-dir app/settings/profile
```

#### Output Structure

**Static route** (`app/about/`):
```
app/about/
├── page.tsx
└── page.module.css
```

**Dynamic route** (`app/[id]/`):
```
app/[id]/
├── page.tsx
└── page.module.css
```

#### Generated Page Example

**page.tsx** (Next.js App Router):
```tsx
import styles from './page.module.css';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <h1>About Page</h1>
    </div>
  );
}
```

**page.tsx** (Dynamic route):
```tsx
import styles from './page.module.css';

interface ProductPageProps {
  params: { product: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <div className={styles.container}>
      <h1>Product: {params.product}</h1>
    </div>
  );
}
```

#### Framework Restrictions

Pages are only generated in Next.js projects:

```bash
# In React project
ff g p about
# Error: Page generation is only supported in Next.js projects
```

---

### Element Generation

#### `ff generate element [name]` (alias: `ff g e`)

Generate a new Lit web component (Lit projects only).

#### Syntax

```bash
ff generate element [name] [options]
ff g e [name] [options]
```

#### Arguments

- `name` (optional): Element name (will be converted to kebab-case)

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--test` | boolean | `true` | Generate test file |
| `--no-test` | boolean | | Skip test file |
| `--typescript` | boolean | `true` | Use TypeScript |
| `--no-typescript` | boolean | | Use JavaScript |
| `-o, --out-dir <dir>` | string | `src/components` | Output directory |
| `-f, --force` | boolean | `false` | Overwrite existing files |
| `--debug` | boolean | `false` | Enable debug mode |

#### Examples

```bash
ff g e MyButton
# Creates my-button.ts

ff g e UserCard --no-test
# Creates user-card.ts without test
```

#### Output Structure

```
src/components/
├── my-button.ts
└── my-button.test.ts
```

---

## Configuration Management

### `ff config`

Manage ffontana-cli configuration.

#### Subcommands

```bash
ff config init      # Initialize config file
ff config list      # List current configuration
ff config get <key> # Get specific config value
ff config set <key> <value> # Set config value
```

#### Examples

**Initialize project config**:
```bash
ff config init
# Creates ff.config.ts in project root
```

**View current configuration**:
```bash
ff config list
# Displays merged configuration from all sources
```

**Get specific value**:
```bash
ff config get generators.component.style
# Output: css-modules
```

**Set value**:
```bash
ff config set generators.component.style tailwind
```

---

## Task Runners

Run common development tasks based on project configuration.

### `ff lint`

Run linting.

```bash
ff lint [options]
```

**Options**:
- `--fix`: Auto-fix linting issues

**Example**:
```bash
ff lint --fix
```

**Behavior**:
- Uses `tasks.lint` from config if defined
- Falls back to project's lint script from package.json
- Defaults to `eslint src` if no config found

---

### `ff format`

Run code formatting.

```bash
ff format [options]
```

**Example**:
```bash
ff format
```

**Behavior**:
- Uses `tasks.format` from config if defined
- Falls back to project's format script from package.json
- Defaults to Prettier if available

---

### `ff test`

Run tests.

```bash
ff test [options]
```

**Options**:
- `--watch`: Run in watch mode
- `--coverage`: Generate coverage report

**Examples**:
```bash
ff test
ff test --watch
ff test --coverage
```

**Behavior**:
- Uses `tasks.test` from config if defined
- Falls back to project's test script from package.json

---

## Interactive vs Non-Interactive Modes

### Interactive Mode

When required options are omitted, the CLI prompts for input:

```bash
ff g c
# Prompts:
# ? Component name: Button
# ? Style format: css-modules
# ? Generate test file? Yes
# ? Generate story? No
```

### Non-Interactive Mode

Provide all options via flags for automation:

```bash
ff g c Button --style=css-modules --test --no-story
# No prompts, runs directly
```

### CI/CD Usage

For automated environments, always provide all required options:

```bash
# .github/workflows/generate.yml
- name: Generate component
  run: |
    ff generate component NewFeature \
      --style=tailwind \
      --test \
      --no-story \
      --force
```

---

## Common Workflows

### Create a New React App

```bash
# 1. Initialize project
ff init my-app --package-manager pnpm

# 2. Navigate to project
cd my-app

# 3. Generate components
ff g c Button --style=css-modules --story
ff g c Card --style=css-modules
ff g c Modal --style=css-modules

# 4. Generate custom hooks
ff g h useLocalStorage
ff g h useDebounce

# 5. Run development server
pnpm dev
```

---

### Add Components to Existing Project

```bash
# Navigate to project
cd existing-project

# Generate components
ff g c Header --style=tailwind
ff g c Footer --style=tailwind
ff g c Sidebar --style=tailwind

# Generate hooks
ff g h useAuth
ff g h useFetch

# Run tests
ff test
```

---

### Next.js App with Multiple Pages

```bash
# Initialize Next.js app
ff init my-next-app --template nextjs-app

cd my-next-app

# Generate pages
ff g p home
ff g p about
ff g p blog --dynamic
ff g p blog/[slug] --dynamic

# Generate components for layouts
ff g c Navbar --style=tailwind
ff g c Footer --style=tailwind

# Run dev server
npm run dev
```

---

### Batch Component Generation

```bash
# Create multiple components at once
components=("Button" "Card" "Modal" "Input" "Select")

for component in "${components[@]}"; do
  ff g c "$component" --style=css-modules --test --force
done
```

---

## Troubleshooting

### Command Not Found

**Problem**: `ff: command not found`

**Solutions**:
```bash
# Re-install globally
npm install -g ffontana-cli

# Or use npx
npx ffontana-cli generate component Button

# For local development
npm run link:local
```

---

### "Not in a project directory"

**Problem**: Commands fail with project detection errors

**Solution**:
```bash
# Ensure you're in a directory with package.json
ls package.json

# Or use init to create a new project
ff init my-new-project
```

---

### Template Not Found

**Problem**: Template errors during generation

**Solution**:
```bash
# Check installed version
ff --version

# Reinstall CLI
npm uninstall -g ffontana-cli
npm install -g ffontana-cli

# Use debug mode to see template paths
ff g c Button --debug
```

---

### Framework Detection Issues

**Problem**: Wrong framework detected

**Solution**:
```bash
# Check package.json dependencies
cat package.json | grep -E "(react|next|lit)"

# Set framework explicitly in config
ff config set framework react
```

---

### Permission Errors

**Problem**: Cannot write files

**Solution**:
```bash
# Check directory permissions
ls -la src/components/

# Use force flag to overwrite
ff g c Button --force

# Run with sudo (not recommended)
sudo ff g c Button
```

---

## Advanced Usage

### Custom Templates Path

```bash
# Set custom templates directory in config
ff config set templates.component ./my-templates/component
```

### Environment-specific Configuration

```bash
# Development
ff g c Button --style=css-modules

# Production (Tailwind for smaller bundle)
NODE_ENV=production ff g c Button --style=tailwind
```

### Debugging Commands

```bash
# Enable debug output
ff g c Button --debug

# View template rendering
DEBUG=* ff g c Button

# Check configuration resolution
ff config list --debug
```

---

For more information:
- [Configuration Guide](./CONFIGURATION.md)
- [Template System](./TEMPLATES.md)
- [API Reference](./API_REFERENCE.md)
- [Development Guide](./DEVELOPMENT.md)
