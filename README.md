# ffontana-cli

> A Swiss Army Knife CLI for modern frontend development

<div align="center">

![Version](https://img.shields.io/badge/version-0.3.5-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

</div>

**ffontana-cli** (command: `ff`) is a flexible, extensible command-line tool that streamlines repetitive development tasks across React, Next.js, and Lit projects. Stop context-switching between frameworks and tools—let `ff` handle the boilerplate while you focus on building features.

---

## Why ffontana-cli?

- **⚡ Fast Setup** - Create production-ready projects in seconds
- **🎨 Smart Generators** - Generate components, hooks, pages with framework-specific best practices
- **🔧 Unified Workflow** - One CLI for scaffolding, code generation, git workflows, and CI/CD integration
- **📦 Package Manager Agnostic** - Works with npm, pnpm, yarn, and Bun
- **⚙️ Highly Configurable** - Cascading configuration system (global → workspace → project)
- **🤝 Team-Friendly** - Enforce code standards and conventions across your team

---

## Quick Start

Get up and running in 30 seconds:

```bash
# Install globally
npm install -g ffontana-cli

# Create a new React project
ff init my-app

# Navigate to your project
cd my-app

# Generate your first component
ff generate component Button

# Start coding! 🎉
```

**Result:** A production-ready React app with TypeScript, Vite, ESLint, and your first component with tests.

---

## Installation

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm**, **pnpm**, **yarn**, or **bun**

### Global Installation (Recommended)

**npm:**
```bash
npm install -g ffontana-cli
```

**pnpm:**
```bash
pnpm add -g ffontana-cli
```

**yarn:**
```bash
yarn global add ffontana-cli
```

**bun:**
```bash
bun add -g ffontana-cli
```

### Use Without Installing (npx)

```bash
npx ffontana-cli init my-app
```

### Project-Local Installation

```bash
npm install --save-dev ffontana-cli

# Use with npx
npx ff generate component Button
```

### Verify Installation

```bash
ff --version
# Output: 0.3.5

ff --help
# Shows all available commands
```

---

## Your First Project

Let's create a complete React application from scratch:

### Step 1: Initialize Your Project

```bash
ff init my-react-app
```

You'll be prompted to select:
- **Template**: `react-ts` (React + TypeScript + Vite)
- **Package manager**: npm, pnpm, yarn, or bun
- **Git initialization**: Yes (creates repo with initial commit)
- **Install dependencies**: Yes (runs package manager install)

**What happens:**
1. Creates project directory
2. Copies template files
3. Initializes git repository
4. Installs dependencies
5. Shows next steps

### Step 2: Generate Components

```bash
cd my-react-app

# Generate a Button component with CSS Modules and tests
ff generate component Button

# Or use the shorthand
ff g c Card --style=tailwind --story
```

**Generated files:**
```
src/components/Button/
├── Button.tsx           # Component with TypeScript
├── Button.module.css    # Scoped styles
└── Button.test.tsx      # Vitest unit tests
```

### Step 3: Customize Your Workflow

```bash
# Setup git hooks for code quality
ff git setup-hooks

# Create a feature branch
ff git branch add-login-form

# Make changes and commit with conventional commits
ff git commit
```

### Step 4: Development Tasks

```bash
# Run linting
ff lint

# Format code
ff format

# Run tests
ff test
```

---

## Available Templates

| Template | Description | Framework | Status |
|----------|-------------|-----------|--------|
| `react-ts` | React 18+ with TypeScript, Vite, ESLint, Prettier | React | ✅ Available |
| `nextjs-app` | Next.js 14+ with App Router, TypeScript, Tailwind | Next.js | ✅ Available |
| `lit-component` | Lit web components with TypeScript | Lit | ✅ Available |

### Using Templates

```bash
# React (default)
ff init my-app

# Next.js
ff init my-next-app --template nextjs-app

# Lit
ff init my-web-components --template lit-component

# Specify package manager
ff init my-app --template react-ts --package-manager pnpm
```

---

## Core Commands

### 📦 Project Initialization

#### `ff init [name]`

Create a new project from a template.

**Examples:**

```bash
# Interactive mode (prompts for options)
ff init

# Quick start with defaults
ff init my-app

# Full customization
ff init my-app \
  --template react-ts \
  --package-manager pnpm \
  --skip-git
```

**Options:**

| Flag | Description | Values |
|------|-------------|--------|
| `-t, --template` | Template to use | `react-ts`, `nextjs-app`, `lit-component` |
| `--package-manager` | Package manager | `npm`, `pnpm`, `yarn`, `bun` |
| `--skip-git` | Skip git initialization | boolean |
| `--skip-install` | Skip dependency installation | boolean |
| `--typescript` | Use TypeScript | boolean (default: true) |

---

### 🎨 Code Generation

Generate components, hooks, pages, and more with framework-specific conventions.

#### `ff generate component [name]` (alias: `ff g c`)

Generate UI components with optional tests and Storybook stories.

**Examples:**

```bash
# Interactive mode
ff g c

# Quick component with defaults
ff g c Button

# With all options
ff g c Card \
  --style=tailwind \
  --test \
  --story \
  --out-dir src/ui/components

# JavaScript instead of TypeScript
ff g c Header --no-typescript --style=scss
```

**Options:**

| Flag | Description | Default |
|------|-------------|---------|
| `-s, --style` | Style format: `css`, `scss`, `styled`, `tailwind`, `css-modules` | `css-modules` |
| `--test / --no-test` | Generate test file | `true` |
| `--story / --no-story` | Generate Storybook story | `false` |
| `--typescript / --no-typescript` | Use TypeScript | `true` |
| `-o, --out-dir` | Output directory | `src/components` |
| `-f, --force` | Overwrite existing files | `false` |

**Generated Structure (CSS Modules):**
```
src/components/Button/
├── Button.tsx
├── Button.module.css
├── Button.test.tsx
└── Button.stories.tsx  (if --story)
```

---

#### `ff generate hook [name]` (alias: `ff g h`)

Generate React/Next.js custom hooks.

**Examples:**

```bash
# Interactive mode
ff g h

# Generate useCounter hook
ff g h useCounter

# Auto-prefixes with "use"
ff g h Counter  # Creates useCounter

# Without tests
ff g h useLocalStorage --no-test
```

**React/Next.js projects only.**

---

#### `ff generate page [name]` (alias: `ff g p`)

Generate Next.js App Router pages.

**Examples:**

```bash
# Static page
ff g p about

# Dynamic route
ff g p product --dynamic
# Creates: app/[product]/page.tsx

# Nested route
ff g p blog/[slug] --style=tailwind
```

**Next.js projects only.**

---

#### `ff generate element [name]` (alias: `ff g e`)

Generate Lit web components.

**Examples:**

```bash
# Generate my-button element
ff g e MyButton
# Creates: my-button.ts (kebab-case)

# With tests
ff g e UserCard --test
```

**Lit projects only.**

---

### 📥 Custom Templates

#### `ff add template [source]` (alias: `ff a t`)

Add custom templates from GitHub repositories or local directories.

**Examples:**

```bash
# Add from GitHub
ff add template https://github.com/company/react-template

# Add from local directory
ff add template ./my-custom-template --name company-standard

# Add with custom name
ff add template https://github.com/user/template --name my-template

# Force overwrite existing template
ff add template ./updated-template --name my-template --force
```

**Use custom templates:**

```bash
# List available templates with "user:" prefix
ff init my-project --template user:company-standard
```

**Templates stored at:** `~/.config/ff-cli/user-templates/`

---

### 🔧 Configuration

#### `ff config`

View and manage CLI configuration.

**Examples:**

```bash
# View current configuration
ff config

# Show configuration source
ff config --source

# View with verbose output
ff config --verbose
```

**Configuration Files:**

Create `ff.config.ts` in your project root:

```typescript
import { defineConfig } from 'ffontana-cli';

export default defineConfig({
  framework: 'react',
  generators: {
    component: {
      style: 'tailwind',
      typescript: true,
      test: true,
      story: true,  // Always generate Storybook stories
    },
  },
  tasks: {
    lint: 'eslint src --ext .ts,.tsx',
    test: 'vitest',
    format: 'prettier --write "src/**/*.{ts,tsx}"',
  },
});
```

Now all generated components will use these defaults:
```bash
ff g c Button  # Uses Tailwind, generates story automatically
```

**See the full [Configuration Guide](./docs/CONFIGURATION.md) for more details.**

---

### ⚙️ Development Tasks

Run common development tasks across different project types.

#### `ff lint`

Run ESLint on your project.

```bash
ff lint
```

#### `ff format`

Run Prettier on your project.

```bash
ff format
```

#### `ff test`

Run your test suite.

```bash
ff test
```

**Note:** These commands use the `npm run [task]` script from your `package.json` or the configured command in `ff.config.ts`.

---

### 🌿 Git Workflow

Streamline your git workflows with conventional commits, branch naming, and hooks.

#### `ff git commit`

Create conventional commits interactively with validation.

**Example:**

```bash
ff git commit
```

**Interactive prompts:**
1. **Type**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
2. **Scope** (optional): `api`, `ui`, `auth`, etc.
3. **Subject**: Short description (imperative mood)
4. **Body** (optional): Detailed explanation
5. **Breaking changes**: Yes/No
6. **Issue references**: `#123, #456`

**Generated commit message:**
```
feat(api): add user authentication endpoint

Implement JWT-based authentication with refresh tokens.
Includes rate limiting and security headers.

BREAKING CHANGE: Authentication now requires API key

Closes #123, #456
```

**Dry run mode:**
```bash
ff git commit --dry-run  # Preview without committing
```

---

#### `ff git branch [name]`

Create branches with naming conventions.

**Examples:**

```bash
# Interactive mode
ff git branch

# Create feature branch
ff git branch user-authentication
# Creates: feat/user-authentication

# Link to issue
ff git branch add-search --issue 123
# Creates: feat/123-add-search

# Create without checking out
ff git branch new-feature --no-checkout
```

**Branch types:** `feat`, `fix`, `chore`, `refactor`, `docs`

---

#### `ff git setup-hooks`

Install and configure git hooks with Husky and Commitlint.

```bash
ff git setup-hooks
```

**Installs:**
- ✅ Husky - Git hooks manager
- ✅ Commitlint - Enforce conventional commits
- ✅ lint-staged - Run linters on staged files

**Configured hooks:**
- `commit-msg` - Validates commit messages
- `pre-commit` - Runs linters and formatters on staged files

**Force reconfiguration:**
```bash
ff git setup-hooks --force
```

---

#### `ff git pr`

Generate pull request templates for GitHub.

```bash
ff git pr
```

**Template types:**
1. **Feature** - New features/enhancements
2. **Bug Fix** - Bug fixes with reproduction steps
3. **Hotfix** - Urgent production fixes
4. **Docs** - Documentation updates

Creates: `.github/PULL_REQUEST_TEMPLATE.md`

---

### 🚀 Jenkins Integration

#### `ff jenkins listen`

Start a webhook server to listen for Jenkins build events.

**Example:**

```bash
# Interactive configuration
ff jenkins listen --config

# Quick start
ff jenkins listen --port 3000 --secret my-secret

# Auto-trigger tests on successful builds
ff jenkins listen --auto-test --test-command "npm test"
```

**What it does:**
- Listens for Jenkins webhook events (success, failure, unstable)
- Color-coded build status notifications
- Optionally triggers test commands after successful builds
- Saves configuration to `~/.config/ff-cli/jenkins.json`

**Options:**

| Flag | Description |
|------|-------------|
| `-p, --port` | Webhook server port (default: 3000) |
| `-s, --secret` | Secret token for authentication |
| `--auto-test` | Auto-trigger tests on successful builds |
| `--test-command` | Command to run for tests |
| `-c, --config` | Interactive configuration |

---

### ☕ Spring Boot Utilities

#### `ff springboot generate-test [className]` (alias: `ff sb gt`)

Generate JUnit 5 test files for Spring Boot projects.

**Examples:**

```bash
# Generate controller test
ff springboot generate-test UserController \
  --api-name users-api \
  --package com.company.users \
  --type controller \
  --module rest

# Generate service test
ff sb gt UserService \
  --api-name users-api \
  --package com.company.users \
  --type service

# Generate DAO test
ff sb gt UserRepository \
  --api-name users-api \
  --package com.company.users \
  --type dao
```

**Test Types:**

| Type | Description | Test Framework |
|------|-------------|----------------|
| `controller` | REST endpoint tests | MockMVC + JUnit 5 |
| `service` | Business logic tests | Mockito + JUnit 5 |
| `dao` | Data access tests | Mockito + JUnit 5 |

**Generated Structure:**
```
users-api/
  rest-sb-users-api/
    src/test/java/com/company/users/
      UserControllerTest.java
```

---

## Common Workflows

### Workflow 1: Starting a New React Project

```bash
# 1. Create project
ff init my-saas-app --package-manager pnpm

# 2. Navigate to project
cd my-saas-app

# 3. Setup git hooks for quality checks
ff git setup-hooks

# 4. Generate core components
ff g c Button --style=tailwind --story
ff g c Card --style=tailwind --story
ff g c Modal --style=tailwind

# 5. Generate custom hooks
ff g h useAuth
ff g h useFetch

# 6. Create feature branch
ff git branch user-dashboard

# 7. Run quality checks
ff lint
ff test

# 8. Make conventional commit
ff git commit

# 9. Generate PR template
ff git pr
```

---

### Workflow 2: Adding Features to Existing Project

```bash
# 1. Navigate to project
cd existing-project

# 2. Create feature branch
ff git branch add-payment-flow

# 3. Generate components
ff g c PaymentForm --style=css-modules
ff g c CreditCardInput --style=css-modules

# 4. Generate hooks
ff g h usePayment

# 5. Run tests
ff test

# 6. Commit changes
ff git commit

# 7. Push and create PR
git push origin feat/add-payment-flow
ff git pr
```

---

### Workflow 3: Team Standardization

Create a shared configuration for your team:

**1. Create `ff.config.ts` in project root:**

```typescript
import { defineConfig } from 'ffontana-cli';

export default defineConfig({
  framework: 'react',
  generators: {
    component: {
      style: 'tailwind',       // Team uses Tailwind
      typescript: true,         // Always TypeScript
      test: true,              // Always generate tests
      story: true,             // Always generate stories
    },
  },
  tasks: {
    lint: 'eslint src --ext .ts,.tsx --max-warnings 0',
    test: 'vitest run --coverage',
    format: 'prettier --write "src/**/*.{ts,tsx}"',
  },
});
```

**2. Commit to repository:**

```bash
git add ff.config.ts
ff git commit  # Type: chore, Scope: config, Subject: add ffontana-cli config
```

**3. Team members generate components:**

```bash
ff g c Button  # Automatically uses team standards
# ✅ Tailwind CSS
# ✅ TypeScript
# ✅ Tests included
# ✅ Storybook story included
```

---

### Workflow 4: Monorepo Development

**Workspace config** (`.ff/config.json` in repo root):

```json
{
  "generators": {
    "component": {
      "style": "css-modules",
      "test": true,
      "story": false
    }
  }
}
```

**Package-specific override** (`packages/design-system/ff.config.ts`):

```typescript
export default defineConfig({
  generators: {
    component: {
      story: true,  // Design system needs stories
    },
  },
});
```

**Result:**
- `packages/app/`: Uses workspace config (no stories)
- `packages/design-system/`: Overrides with stories enabled

---

### Workflow 5: CI/CD Integration

**GitHub Actions example:**

```yaml
name: Code Quality

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Install ffontana-cli
        run: npm install -g ffontana-cli

      - name: Run linting
        run: ff lint

      - name: Run tests
        run: ff test

      - name: Check formatting
        run: ff format --check
```

---

## Configuration

### Configuration Hierarchy

ffontana-cli uses **cascading configuration** (highest to lowest priority):

```
1. CLI Flags          (--style=tailwind)
2. Project Config     (ff.config.ts in project root)
3. Workspace Config   (.ff/config.json in monorepo root)
4. Global Config      (~/.config/ff-cli/config.json)
5. Default Config     (built-in defaults)
```

### Quick Configuration Examples

**Minimal config (`ff.config.ts`):**

```typescript
import { defineConfig } from 'ffontana-cli';

export default defineConfig({
  framework: 'react',
  generators: {
    component: {
      style: 'tailwind',
    },
  },
});
```

**Full config with all options:**

```typescript
import { defineConfig } from 'ffontana-cli';

export default defineConfig({
  framework: 'react',
  plugins: [],

  generators: {
    component: {
      style: 'css-modules',
      typescript: true,
      test: true,
      story: false,
    },
    hook: {
      typescript: true,
      test: true,
    },
    page: {
      style: 'css-modules',
      typescript: true,
      test: true,
    },
    element: {
      typescript: true,
      test: true,
    },
  },

  tasks: {
    lint: 'eslint src --ext .ts,.tsx',
    test: 'vitest',
    format: 'prettier --write "src/**/*.{ts,tsx}"',
  },

  templates: {
    component: './custom-templates/component',
  },

  hooks: {},
});
```

**📖 Full guide:** [Configuration Documentation](./docs/CONFIGURATION.md)

---

## Troubleshooting

### "Command not found: ff"

**Solution:**

```bash
# Re-install globally
npm install -g ffontana-cli

# Or use with npx
npx ffontana-cli generate component Button

# For local development, link the CLI
npm run link:local
```

---

### "Not in a project directory"

**Problem:** Commands require a `package.json` file.

**Solution:**

```bash
# Check if package.json exists
ls package.json

# If not, initialize a project
ff init my-project
cd my-project
```

---

### "Framework not detected"

**Problem:** CLI can't detect React/Next.js/Lit.

**Solution:**

```bash
# Check dependencies
cat package.json | grep -E "(react|next|lit)"

# Set framework explicitly in config
echo '{ "framework": "react" }' > ff.config.json
```

---

### "Template not found"

**Solution:**

```bash
# Check CLI version
ff --version

# Reinstall if outdated
npm uninstall -g ffontana-cli
npm install -g ffontana-cli

# Use debug mode
ff g c Button --debug
```

---

### Enable Debug Mode

For any issue, enable debug mode for detailed logs:

```bash
ff generate component Button --debug
```

This shows:
- Configuration resolution
- Template paths
- File operations
- Stack traces for errors

---

## Project Structure

### CLI Project Structure

```
ffontana-cli/
├── src/
│   ├── cli.ts                    # Main entry point
│   ├── commands/                 # Command implementations
│   │   ├── init.ts
│   │   ├── config.ts
│   │   ├── add-template.ts
│   │   ├── generate/             # Code generators
│   │   │   ├── component.ts
│   │   │   ├── hook.ts
│   │   │   ├── page.ts
│   │   │   └── element.ts
│   │   ├── tasks/                # Task runners
│   │   │   ├── lint.ts
│   │   │   ├── format.ts
│   │   │   └── test.ts
│   │   ├── git/                  # Git workflow
│   │   │   ├── commit.ts
│   │   │   ├── branch.ts
│   │   │   ├── pr.ts
│   │   │   └── setup-hooks.ts
│   │   ├── jenkins/              # Jenkins integration
│   │   │   └── listen.ts
│   │   └── springboot/           # Spring Boot utilities
│   │       └── generate-test.ts
│   ├── core/                     # Core functionality
│   │   ├── config-loader.ts      # Configuration system
│   │   ├── project-detector.ts   # Framework detection
│   │   └── template-engine.ts    # Template rendering
│   ├── types/                    # TypeScript types
│   ├── utils/                    # Utilities
│   └── __tests__/                # Tests
├── templates/                    # Code generation templates
│   ├── react-ts/                 # React project template
│   ├── nextjs-app/               # Next.js project template
│   ├── lit-component/            # Lit project template
│   ├── components/               # Component templates
│   ├── hooks/                    # Hook templates
│   ├── pages/                    # Page templates
│   └── springboot/               # Spring Boot templates
├── docs/                         # Documentation
├── package.json
└── tsconfig.json
```

### Generated Project Structure

**React project:**
```
my-app/
├── src/
│   ├── components/               # Generated components
│   │   └── Button/
│   │       ├── Button.tsx
│   │       ├── Button.module.css
│   │       └── Button.test.tsx
│   ├── hooks/                    # Generated hooks
│   │   ├── useAuth.ts
│   │   └── useAuth.test.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
├── ff.config.ts                  # CLI configuration
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Documentation

### Core Documentation

- 📖 **[Getting Started Guide](./docs/GETTING_STARTED.md)** - Complete beginner tutorial
- 📚 **[Commands Reference](./docs/COMMANDS.md)** - All commands with examples
- ⚙️ **[Configuration Guide](./docs/CONFIGURATION.md)** - Configuration system deep-dive
- 🏗️ **[Architecture](./docs/ARCHITECTURE.md)** - System design and internals
- 🎨 **[Templates](./docs/TEMPLATES.md)** - Template system documentation
- 🤝 **[Contributing](./docs/CONTRIBUTING.md)** - How to contribute
- 🔧 **[Development](./docs/DEVELOPMENT.md)** - Development setup

### Quick Links

| Resource | Description |
|----------|-------------|
| [GitHub Repository](https://github.com/ffontanadev/ffontana-cli) | Source code and issue tracker |
| [Release Notes](https://github.com/ffontanadev/ffontana-cli/releases) | Latest releases and changelogs |
| [npm Package](https://www.npmjs.com/package/ffontana-cli) | Published package |

---

## Roadmap

### ✅ Phase 1: MVP (Complete)

- [x] Project scaffolding (React, Next.js, Lit)
- [x] Component, hook, page, element generation
- [x] Framework auto-detection
- [x] Configuration system
- [x] Package manager detection

### ✅ Phase 2: Core Modules (Complete)

- [x] All framework templates
- [x] Task runners (lint, format, test)
- [x] Custom template system
- [x] Git workflow helpers
- [x] Jenkins integration
- [x] Spring Boot utilities

### 🚧 Phase 3: Advanced Features (Current)

- [x] Git workflow commands
- [ ] Enhanced custom template features
- [ ] Monorepo support improvements
- [ ] n8n automation integration
- [ ] Template marketplace

### 💎 Phase 4: DX Polish

- [ ] Enhanced error messages
- [ ] Performance optimizations
- [ ] Interactive tutorials
- [ ] Video documentation
- [ ] VS Code extension

### 🌐 Phase 5: Plugin Ecosystem

- [ ] Plugin development kit (PDK)
- [ ] Plugin marketplace
- [ ] Community plugin support
- [ ] Plugin discovery

---

## Contributing

We welcome contributions! Whether it's:

- 🐛 **Bug reports** - Help us identify issues
- 💡 **Feature requests** - Share your ideas
- 📖 **Documentation** - Improve our guides
- 🔧 **Code contributions** - Submit pull requests

### Quick Start for Contributors

```bash
# 1. Clone the repository
git clone https://github.com/ffontanadev/ffontana-cli.git
cd ffontana-cli

# 2. Install dependencies
npm install

# 3. Build the CLI
npm run build

# 4. Link locally for testing
npm run link:local

# 5. Test your changes
ff --version  # Should show your local version

# 6. Run tests
npm test

# 7. Lint and format
npm run lint
npm run format
```

**Read the full [Contributing Guide](./docs/CONTRIBUTING.md) for more details.**

---

## Technology Stack

Built with modern, battle-tested tools:

- **[TypeScript](https://www.typescriptlang.org/)** - Full type safety
- **[Commander.js](https://github.com/tj/commander.js)** - CLI framework
- **[Handlebars](https://handlebarsjs.com/)** - Template engine
- **[Zod](https://zod.dev/)** - Schema validation
- **[tsup](https://tsup.egoist.dev/)** - Fast bundling
- **[Vitest](https://vitest.dev/)** - Lightning-fast testing

---

## License

MIT © ffontana-cli

See [LICENSE](./LICENSE) for more details.

---

## Acknowledgments

Built with ❤️ by the ffontana-cli team and powered by the amazing open-source community.

Special thanks to all [contributors](https://github.com/ffontanadev/ffontana-cli/graphs/contributors) who have helped make this project better!

---

## Support

Need help? Here's where to get support:

- 📖 **Documentation**: Start with our [Getting Started Guide](./docs/GETTING_STARTED.md)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/ffontanadev/ffontana-cli/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/ffontanadev/ffontana-cli/discussions)
- 📧 **Email**: [ffontana.dev@gmail.com](mailto:ffontana.dev@gmail.com)

---

<div align="center">

**[⬆ Back to Top](#ffontana-cli)**

Made with TypeScript and ❤️

</div>
