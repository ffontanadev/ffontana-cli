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
  - [Add Custom Templates](#add-custom-templates)
- [Configuration Management](#configuration-management)
- [Task Runners](#task-runners)
- [Git Workflow](#git-workflow)
  - [ff git commit](#ff-git-commit)
  - [ff git branch](#ff-git-branch)
  - [ff git setup-hooks](#ff-git-setup-hooks)
  - [ff git pr](#ff-git-pr)
- [Jenkins Integration](#jenkins-integration)
- [Spring Boot Utilities](#spring-boot-utilities)
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

### Add Custom Templates

#### `ff add template [source]` (alias: `ff a t`)

Add custom project or generator templates from GitHub repositories or local directories.

#### Syntax

```bash
ff add template [source] [options]
ff a t [source] [options]
```

#### Arguments

- `source` (required): GitHub URL or local directory path

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `-n, --name` | string | Custom template name |
| `-f, --force` | boolean | Force overwrite if template exists |
| `--debug` | boolean | Enable debug mode |

#### Examples

**Add from GitHub:**
```bash
# Add template from GitHub repository
ff add template https://github.com/company/react-template

# Add with custom name
ff add template https://github.com/user/template --name company-standard
```

**Add from local directory:**
```bash
# Add from local directory
ff add template ./my-custom-template

# Add with custom name and force overwrite
ff add template ../shared-templates/react-custom --name my-template --force
```

#### Using Custom Templates

After adding a template, use it with the `user:` prefix:

```bash
# List available custom templates
ls ~/.config/ff-cli/user-templates/

# Use custom template
ff init my-project --template user:company-standard
```

#### Template Storage

Custom templates are stored at:
- **macOS/Linux:** `~/.config/ff-cli/user-templates/`
- **Windows:** `%USERPROFILE%\.config\ff-cli\user-templates\`

#### Template Naming Rules

- Alphanumeric characters only
- Hyphens (`-`) and underscores (`_`) allowed
- No spaces or special characters

#### What Happens

When you add a template:
1. Source is validated (GitHub URL or local path)
2. Template is cloned/copied to user templates directory
3. `.git` directory is removed (if present)
4. Template name is registered

#### Troubleshooting

**Template already exists:**
```bash
ff add template ./my-template --force
```

**Invalid template name:**
```bash
# Error: Invalid template name
ff add template ./my-template --name "My Template"

# Fix: Use hyphens instead of spaces
ff add template ./my-template --name my-template
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

## Git Workflow

Streamline your git workflows with conventional commits, branch naming conventions, and automated hooks.

### `ff git commit`

Create conventional commits interactively with validation.

#### Syntax

```bash
ff git commit [options]
```

#### Options

| Option | Description |
|--------|-------------|
| `--dry-run` | Preview commit without creating |
| `--debug` | Enable debug mode |

#### Interactive Process

When you run `ff git commit`, you'll be guided through:

**1. Commit Type**
```
? Select commit type:
  feat     - A new feature
  fix      - A bug fix
  docs     - Documentation only changes
  style    - Code style changes (formatting, semicolons)
  refactor - Code change that neither fixes a bug nor adds a feature
  perf     - Performance improvement
  test     - Adding missing tests
  build    - Changes to build system or dependencies
  ci       - CI configuration changes
  chore    - Other changes that don't modify src or test files
  revert   - Revert a previous commit
```

**2. Scope (Optional)**
```
? Commit scope (optional): api
```
Examples: `api`, `ui`, `auth`, `core`, `components`

**3. Subject**
```
? Short description (imperative mood): add user authentication endpoint
```
- Use imperative mood ("add" not "added")
- No period at the end
- Maximum 50 characters

**4. Body (Optional)**
```
? Detailed description (optional):
Implement JWT-based authentication with refresh tokens.
Includes rate limiting and security headers.
```

**5. Breaking Changes**
```
? Are there breaking changes? (y/N)
? Breaking change description: Authentication now requires API key in headers
```

**6. Issue References**
```
? Issue references (e.g., #123, #456): #123, #456
```

#### Generated Commit Message

```
feat(api): add user authentication endpoint

Implement JWT-based authentication with refresh tokens.
Includes rate limiting and security headers.

BREAKING CHANGE: Authentication now requires API key in headers

Closes #123, #456
```

#### Examples

**Basic commit:**
```bash
ff git commit
# Follow prompts to create commit
```

**Preview without committing:**
```bash
ff git commit --dry-run
# Shows preview of commit message
```

#### Commit Message Format

Follows the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

BREAKING CHANGE: <description>

<footer>
```

---

### `ff git branch [name]`

Create git branches with naming conventions.

#### Syntax

```bash
ff git branch [name] [options]
```

#### Arguments

- `name` (optional): Branch name (will be prefixed with type)

#### Options

| Option | Description |
|--------|-------------|
| `--no-checkout` | Create branch without checking it out |
| `-i, --issue` | Link to issue number |
| `--debug` | Enable debug mode |

#### Branch Types

```
feat      - New feature
fix       - Bug fix
chore     - Maintenance tasks
refactor  - Code refactoring
docs      - Documentation updates
```

#### Examples

**Interactive mode:**
```bash
ff git branch
# Prompts for branch type and name
```

**Create feature branch:**
```bash
ff git branch user-authentication
# Creates: feat/user-authentication
```

**Link to issue:**
```bash
ff git branch add-search --issue 123
# Creates: feat/123-add-search
```

**Create without checkout:**
```bash
ff git branch new-feature --no-checkout
# Creates branch but stays on current branch
```

**Create fix branch:**
```bash
# If prompted for type, select "fix"
ff git branch login-error --issue 456
# Creates: fix/456-login-error
```

#### Branch Naming Format

```
<type>/<name>                    # Simple format
<type>/<issue-number>-<name>     # With issue reference
```

**Examples:**
- `feat/user-dashboard`
- `feat/123-add-payment`
- `fix/login-redirect`
- `fix/456-session-timeout`
- `docs/update-readme`
- `refactor/api-layer`

---

### `ff git setup-hooks`

Install and configure git hooks with Husky, Commitlint, and lint-staged.

#### Syntax

```bash
ff git setup-hooks [options]
```

#### Options

| Option | Description |
|--------|-------------|
| `-f, --force` | Force reconfiguration |
| `--debug` | Enable debug mode |

#### What Gets Installed

**1. Husky** - Git hooks manager
```json
"husky": "^8.0.3"
```

**2. Commitlint** - Enforce conventional commits
```json
"@commitlint/cli": "^17.0.0",
"@commitlint/config-conventional": "^17.0.0"
```

**3. lint-staged** - Run linters on staged files
```json
"lint-staged": "^13.0.0"
```

#### Configured Hooks

**commit-msg hook** (`.husky/commit-msg`):
```bash
#!/usr/bin/env sh
npx --no -- commitlint --edit ${1}
```
Validates commit messages against conventional commit format.

**pre-commit hook** (`.husky/pre-commit`):
```bash
#!/usr/bin/env sh
npx lint-staged
```
Runs linters and formatters on staged files before commit.

#### Configuration Files Created

**`.commitlintrc.json`:**
```json
{
  "extends": ["@commitlint/config-conventional"]
}
```

**`package.json` additions:**
```json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

#### Interactive Setup

```bash
ff git setup-hooks
```

**Prompts:**
```
? Install Husky? (Y/n)
? Install Commitlint? (Y/n)
? Install lint-staged? (Y/n)
? Configure pre-commit hook? (Y/n)
```

#### Examples

**Full setup:**
```bash
ff git setup-hooks
# Answer Y to all prompts
```

**Force reconfigure:**
```bash
ff git setup-hooks --force
# Overwrites existing configuration
```

#### What Happens After Setup

**Before commit:**
```bash
git commit -m "update readme"
# ❌ Rejected: Must follow conventional commit format
```

**Correct commit:**
```bash
git commit -m "docs: update readme"
# ✅ Accepted: Valid conventional commit
```

**With staged files:**
```bash
git add src/components/Button.tsx
git commit -m "feat: add button component"
# ✅ Runs ESLint and Prettier on Button.tsx
# ✅ Auto-formats and fixes issues
# ✅ Creates commit
```

---

### `ff git pr`

Generate pull request templates for GitHub.

#### Syntax

```bash
ff git pr [options]
```

#### Options

| Option | Description |
|--------|-------------|
| `--debug` | Enable debug mode |

#### Template Types

**1. Feature Template**
For new features and enhancements:
```markdown
## Summary
Description of the feature

## Changes
- Bullet points of changes

## Test Plan
- [ ] Manual testing steps
- [ ] Unit tests added/updated

## Screenshots
(if applicable)
```

**2. Bug Fix Template**
For bug fixes:
```markdown
## Bug Description
What was the bug?

## Root Cause
What caused the bug?

## Solution
How was it fixed?

## Test Plan
- [ ] Steps to reproduce original bug
- [ ] Verification steps
```

**3. Hotfix Template**
For urgent production fixes:
```markdown
## Incident
Description of production issue

## Impact
User/business impact

## Fix
What was changed

## Verification
How it was tested
```

**4. Docs Template**
For documentation updates:
```markdown
## Documentation Changes
What was updated/added

## Reason
Why these changes were needed

## Checklist
- [ ] Links tested
- [ ] Examples verified
```

#### Example

```bash
ff git pr
```

**Prompts:**
```
? Select template type:
❯ Feature - New features/enhancements
  Bug Fix - Bug fixes with reproduction steps
  Hotfix - Urgent production fixes
  Docs - Documentation updates
```

#### Generated File

Creates `.github/PULL_REQUEST_TEMPLATE.md` in your repository.

#### Using the Template

**When creating a PR on GitHub:**
1. Push your branch: `git push origin feat/my-feature`
2. Go to GitHub and create Pull Request
3. Template automatically populates the PR description
4. Fill in the sections and submit

#### Overwriting Existing Template

```bash
ff git pr
```

**If template exists:**
```
! PR template already exists at .github/PULL_REQUEST_TEMPLATE.md
? Overwrite existing template? (Y/n)
```

---

## Jenkins Integration

### `ff jenkins listen`

Start a webhook server to listen for Jenkins build events.

#### Syntax

```bash
ff jenkins listen [options]
```

#### Options

| Option | Description | Default |
|--------|-------------|---------|
| `-p, --port` | Webhook server port | `3000` |
| `-s, --secret` | Secret token for authentication | (none) |
| `--auto-test` | Auto-trigger tests on successful builds | `false` |
| `--test-command` | Command to run for tests | `npm test` |
| `-c, --config` | Interactive configuration | `false` |
| `--debug` | Enable debug mode | `false` |

#### Quick Start

**1. Interactive configuration:**
```bash
ff jenkins listen --config
```

**Prompts:**
```
? Webhook server port: 3000
? Secret token (optional):
? Auto-trigger tests on success? (Y/n)
? Test command: npm test
```

**2. Start listening:**
```bash
ff jenkins listen
```

**Output:**
```
🎧 Jenkins webhook listener started
📡 Listening on http://localhost:3000
🔐 Secret token: (not configured)
🧪 Auto-test: enabled (npm test)

Waiting for Jenkins events...
```

#### Command Line Configuration

```bash
ff jenkins listen \
  --port 3000 \
  --secret my-secret-token \
  --auto-test \
  --test-command "npm run test:ci"
```

#### Webhook Events

The server listens for these Jenkins build events:

**Success:**
```
✅ Build SUCCESS: my-job #42
   Duration: 2m 15s
   🧪 Running tests: npm test
```

**Failure:**
```
❌ Build FAILED: my-job #43
   Duration: 1m 30s
   Error: Compilation failed
```

**Unstable:**
```
⚠️  Build UNSTABLE: my-job #44
   Duration: 3m 10s
   Warnings: 5 test failures
```

#### Jenkins Configuration

Configure Jenkins to send webhooks to your listener:

**1. Install Jenkins Plugin:**
- Install "Generic Webhook Trigger" plugin

**2. Configure Job:**
```
Build Triggers:
  ☑ Generic Webhook Trigger

Post Content Parameters:
  Variable: event
  JSONPath: $.status

Token: (optional, use --secret value)

URL: http://your-machine:3000/webhook
```

**3. Test webhook:**
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"status": "success", "job": "test-job", "number": 1}'
```

#### Configuration Storage

Configuration is saved to:
- **macOS/Linux:** `~/.config/ff-cli/jenkins.json`
- **Windows:** `%USERPROFILE%\.config\ff-cli\jenkins.json`

**Example:**
```json
{
  "port": 3000,
  "secret": "my-secret-token",
  "autoTest": true,
  "testCommand": "npm test"
}
```

#### Auto-Test Feature

When enabled, automatically runs tests after successful builds:

```bash
ff jenkins listen --auto-test --test-command "npm run test:ci"
```

**Behavior:**
```
✅ Build SUCCESS: my-job #42
   Duration: 2m 15s
   🧪 Running tests: npm run test:ci

   > test:ci
   > vitest run --coverage

   ✅ Tests passed (42 tests)
   📊 Coverage: 87%
```

#### Stopping the Server

Press `Ctrl+C` or `Cmd+C`:
```
^C
🛑 Jenkins webhook listener stopped
```

---

## Spring Boot Utilities

### `ff springboot generate-test [className]` (alias: `ff sb gt`)

Generate JUnit 5 test files for Spring Boot projects.

#### Syntax

```bash
ff springboot generate-test [className] [options]
ff sb gt [className] [options]
```

#### Arguments

- `className` (optional): Class name to test (e.g., `UserController`)

#### Options

| Option | Description | Required |
|--------|-------------|----------|
| `-a, --api-name` | API name (e.g., `users-api`) | Yes |
| `-p, --package` | Java base package (e.g., `com.company.users`) | Yes |
| `-t, --type` | Test type: `controller`, `service`, `dao` | Yes |
| `-m, --module` | Module type: `rest`, `service`, `dao` | Yes |
| `-o, --out-dir` | Output directory | No |
| `--debug` | Enable debug mode | No |

#### Test Types

**Controller Tests** (`--type controller`):
- Uses MockMVC for endpoint testing
- Tests REST API endpoints
- Validates request/response

**Service Tests** (`--type service`):
- Uses Mockito for mocking dependencies
- Tests business logic
- Unit tests for service layer

**DAO/Repository Tests** (`--type dao`):
- Uses Mockito for data access testing
- Tests database operations
- Validates queries

#### Module Types

Maps to Spring Boot project structure:

| Module Type | Directory Structure |
|-------------|---------------------|
| `rest` | `rest-sb-{apiName}/` |
| `service` | `services-{apiName}/` |
| `dao` | `services-{apiName}/` |

#### Examples

**Controller test:**
```bash
ff springboot generate-test UserController \
  --api-name users-api \
  --package com.company.users \
  --type controller \
  --module rest
```

**Service test:**
```bash
ff sb gt UserService \
  --api-name users-api \
  --package com.company.users \
  --type service \
  --module service
```

**DAO test:**
```bash
ff sb gt UserRepository \
  --api-name users-api \
  --package com.company.users \
  --type dao \
  --module dao
```

#### Generated Structure

**Controller test:**
```
users-api/
  rest-sb-users-api/
    src/test/java/com/company/users/
      UserControllerTest.java
```

**Service test:**
```
users-api/
  services-users-api/
    src/test/java/com/company/users/
      UserServiceTest.java
```

#### Generated Test Example

**UserControllerTest.java:**
```java
package com.company.users;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testGetUsers() throws Exception {
        mockMvc.perform(get("/api/users"))
            .andExpect(status().isOk());
    }
}
```

#### Package Path Conversion

Package name is converted to directory path:
- `com.company.users` → `com/company/users`
- `com.bbva.apx.users` → `com/bbva/apx/users`

#### Interactive Mode

```bash
ff springboot generate-test
```

**Prompts:**
```
? Class name to test: UserController
? API name: users-api
? Base package: com.company.users
? Test type:
❯ controller
  service
  dao
? Module type:
❯ rest
  service
  dao
```

#### Custom Output Directory

```bash
ff sb gt UserController \
  --api-name users-api \
  --package com.company.users \
  --type controller \
  --module rest \
  --out-dir /custom/path
```

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
