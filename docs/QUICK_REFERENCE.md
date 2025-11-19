# Quick Reference

> Cheat sheet for ffontana-cli commands and options

## Installation

```bash
# npm
npm install -g ffontana-cli

# pnpm
pnpm add -g ffontana-cli

# yarn
yarn global add ffontana-cli

# bun
bun add -g ffontana-cli

# Verify
ff --version
```

---

## Project Initialization

| Command | Description | Example |
|---------|-------------|---------|
| `ff init [name]` | Initialize new project | `ff init my-app` |

**Common Options:**
```bash
ff init my-app --template react-ts --package-manager pnpm
ff init my-app --skip-git --skip-install
```

**Available Templates:**
- `react-ts` - React + TypeScript + Vite
- `nextjs-app` - Next.js 14+ App Router
- `lit-component` - Lit web components

---

## Code Generation

### Component

| Command | Alias | Description |
|---------|-------|-------------|
| `ff generate component [name]` | `ff g c` | Generate component |

**Examples:**
```bash
ff g c Button
ff g c Card --style=tailwind --test --story
ff g c Modal --no-test --out-dir src/ui
```

**Style Options:** `css`, `scss`, `styled`, `tailwind`, `css-modules`

---

### Hook

| Command | Alias | Description |
|---------|-------|-------------|
| `ff generate hook [name]` | `ff g h` | Generate React hook |

**Examples:**
```bash
ff g h useCounter
ff g h useAuth --no-test
```

---

### Page

| Command | Alias | Description |
|---------|-------|-------------|
| `ff generate page [name]` | `ff g p` | Generate Next.js page |

**Examples:**
```bash
ff g p about
ff g p product --dynamic
ff g p blog/[slug] --style=tailwind
```

---

### Element

| Command | Alias | Description |
|---------|-------|-------------|
| `ff generate element [name]` | `ff g e` | Generate Lit element |

**Examples:**
```bash
ff g e MyButton
ff g e UserCard --test
```

---

## Custom Templates

| Command | Alias | Description |
|---------|-------|-------------|
| `ff add template [source]` | `ff a t` | Add custom template |

**Examples:**
```bash
ff add template https://github.com/company/template
ff add template ./local-template --name my-template
ff add template ../shared --force

# Use custom template
ff init my-app --template user:my-template
```

---

## Configuration

| Command | Description |
|---------|-------------|
| `ff config` | View configuration |
| `ff config --source` | Show config source |
| `ff config --verbose` | Verbose output |

**Config File (`ff.config.ts`):**
```typescript
import { defineConfig } from 'ffontana-cli';

export default defineConfig({
  framework: 'react',
  generators: {
    component: {
      style: 'tailwind',
      test: true,
      story: true,
    },
  },
});
```

---

## Task Runners

| Command | Description |
|---------|-------------|
| `ff lint` | Run linting |
| `ff format` | Run formatting |
| `ff test` | Run tests |

---

## Git Workflow

### Conventional Commits

```bash
ff git commit                  # Interactive commit
ff git commit --dry-run        # Preview without committing
```

**Commit Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style
- `refactor` - Code refactoring
- `perf` - Performance
- `test` - Tests
- `build` - Build system
- `ci` - CI configuration
- `chore` - Maintenance
- `revert` - Revert commit

**Format:**
```
<type>(<scope>): <subject>

<body>

BREAKING CHANGE: <description>

Closes #123
```

---

### Branch Management

```bash
ff git branch [name]                    # Interactive branch creation
ff git branch feature-name              # Creates: feat/feature-name
ff git branch fix-bug --issue 123       # Creates: fix/123-fix-bug
ff git branch docs-update --no-checkout # Create without checkout
```

**Branch Types:** `feat`, `fix`, `chore`, `refactor`, `docs`

---

### Git Hooks

```bash
ff git setup-hooks          # Setup Husky + Commitlint + lint-staged
ff git setup-hooks --force  # Force reconfigure
```

**What it installs:**
- Husky (git hooks manager)
- Commitlint (validate commits)
- lint-staged (run linters on staged files)

---

### Pull Request Templates

```bash
ff git pr  # Generate PR template
```

**Template types:**
- Feature
- Bug Fix
- Hotfix
- Docs

---

## Jenkins Integration

```bash
# Interactive setup
ff jenkins listen --config

# Quick start
ff jenkins listen --port 3000 --secret token

# Auto-trigger tests
ff jenkins listen --auto-test --test-command "npm test"
```

**Options:**
| Flag | Description | Default |
|------|-------------|---------|
| `-p, --port` | Server port | `3000` |
| `-s, --secret` | Auth token | none |
| `--auto-test` | Auto-run tests | `false` |
| `--test-command` | Test command | `npm test` |

---

## Spring Boot

```bash
# Generate controller test
ff springboot generate-test UserController \
  --api-name users-api \
  --package com.company.users \
  --type controller \
  --module rest

# Shorthand
ff sb gt UserService \
  --api-name users-api \
  --package com.company.users \
  --type service \
  --module service
```

**Test Types:**
- `controller` - MockMVC tests
- `service` - Mockito tests
- `dao` - Repository tests

**Module Types:**
- `rest` - REST controllers
- `service` - Business logic
- `dao` - Data access

---

## Global Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--help` | `-h` | Show help |
| `--version` | `-v` | Show version |
| `--debug` | | Enable debug mode |

---

## Common Flags

### Code Generation Flags

| Flag | Description | Default |
|------|-------------|---------|
| `-s, --style` | Style format | `css-modules` |
| `--test` / `--no-test` | Generate/skip tests | `true` |
| `--story` / `--no-story` | Generate/skip stories | `false` |
| `--typescript` / `--no-typescript` | TypeScript/JavaScript | `true` |
| `-o, --out-dir` | Output directory | varies |
| `-f, --force` | Overwrite existing | `false` |

---

## Configuration Hierarchy

Priority (highest to lowest):
1. **CLI Flags** - `--style=tailwind`
2. **Project Config** - `ff.config.ts`
3. **Workspace Config** - `.ff/config.json`
4. **Global Config** - `~/.config/ff-cli/config.json`
5. **Defaults** - Built-in

---

## Workflow Examples

### Start New Project

```bash
ff init my-app --package-manager pnpm
cd my-app
ff git setup-hooks
ff g c Button --style=tailwind --story
ff g h useAuth
ff git branch feature-auth
ff git commit
```

---

### Add Feature to Existing Project

```bash
cd existing-project
ff git branch add-payment
ff g c PaymentForm --style=css-modules
ff g h usePayment
ff test
ff git commit
git push origin feat/add-payment
ff git pr
```

---

### Team Configuration

**Create `ff.config.ts`:**
```typescript
export default defineConfig({
  framework: 'react',
  generators: {
    component: {
      style: 'tailwind',
      test: true,
      story: true,
    },
  },
});
```

**Now all team members get same defaults:**
```bash
ff g c Button  # Uses team config automatically
```

---

## Directory Structure

### User Templates
- **macOS/Linux:** `~/.config/ff-cli/user-templates/`
- **Windows:** `%USERPROFILE%\.config\ff-cli\user-templates\`

### Global Config
- **macOS/Linux:** `~/.config/ff-cli/config.json`
- **Windows:** `%USERPROFILE%\.config\ff-cli\config.json`

### Jenkins Config
- **macOS/Linux:** `~/.config/ff-cli/jenkins.json`
- **Windows:** `%USERPROFILE%\.config\ff-cli\jenkins.json`

---

## Troubleshooting

### Command Not Found

```bash
npm install -g ffontana-cli
# or
npx ffontana-cli init my-app
```

### Not in Project Directory

```bash
# Ensure package.json exists
ls package.json
# Or initialize new project
ff init my-project
```

### Enable Debug Mode

```bash
ff g c Button --debug
```

Shows:
- Configuration resolution
- Template paths
- File operations
- Stack traces

---

## Help & Support

```bash
# General help
ff --help

# Command help
ff init --help
ff generate --help
ff generate component --help
ff git --help
ff git commit --help
```

---

## Quick Links

- **Documentation:** [Full Docs](./index.md)
- **Getting Started:** [Tutorial](./GETTING_STARTED.md)
- **Commands:** [Full Reference](./COMMANDS.md)
- **Configuration:** [Config Guide](./CONFIGURATION.md)
- **GitHub:** [Repository](https://github.com/ffontanadev/ffontana-cli)

---

## Version

```bash
ff --version
# Current: 0.3.5
```

---

**For detailed documentation, see [Complete Commands Reference](./COMMANDS.md)**
