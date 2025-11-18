# ffontana-cli

> A Swiss Army Knife CLI for modern frontend development

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

</div>

A flexible, extensible command-line tool that unifies repetitive development tasks across multiple frontend frameworks. Built with TypeScript for maximum type safety and an exceptional developer experience.

## ✨ Features

- 🚀 **Project Scaffolding** - Initialize new React, Next.js, or Lit projects with industry best practices
- 🎨 **Code Generation** - Generate components, hooks, and pages with framework-specific conventions
- 🔧 **Multi-Framework Support** - Works seamlessly with React, Next.js, and Lit projects
- ⚙️ **Highly Configurable** - Cascading configuration system (global → workspace → project)
- 🔌 **Plugin Architecture** - Extensible plugin system for custom workflows _(coming in Phase 2)_
- 📦 **Package Manager Agnostic** - Supports npm, pnpm, yarn, and Bun out of the box
- 💅 **Style Flexibility** - CSS Modules, Styled Components, Tailwind, and SCSS support

## 📦 Installation

### Global Installation

```bash
npm install -g ffontana-cli
```

### Use with npx (no installation needed)

```bash
npx ffontana-cli init my-app
```

### Project-local installation

```bash
npm install --save-dev ffontana-cli
```

## 🚀 Quick Start

### Initialize a New Project

```bash
# Interactive mode (prompts for template selection)
ff init my-app

# Direct template selection
ff init my-app --template react-ts

# Skip git initialization
ff init my-app --skip-git

# Skip dependency installation
ff init my-app --skip-install

# Specify package manager
ff init my-app --package-manager pnpm
```

### Generate Components

```bash
# Interactive mode
ff generate component

# Or use the shorthand
ff g c

# With all options specified
ff g component Button --style=css-modules --test --story

# Without tests
ff g c Header --no-test

# Use styled-components
ff g c Card --style=styled

# Specify output directory
ff g c Modal --out-dir src/ui/modals
```

## 📖 Commands

### `ff init [name]`

Initialize a new project from a template.

**Options:**

| Option              | Description                  | Values                                        |
| ------------------- | ---------------------------- | --------------------------------------------- |
| `-t, --template`    | Template to use              | `react-ts` \| `nextjs-app` \| `lit-component` |
| `--skip-git`        | Skip git initialization      | boolean                                       |
| `--skip-install`    | Skip dependency installation | boolean                                       |
| `--package-manager` | Package manager to use       | `npm` \| `pnpm` \| `yarn` \| `bun`            |
| `--debug`           | Enable debug mode            | boolean                                       |

**Examples:**

```bash
ff init my-react-app
ff init my-next-app --template nextjs-app --package-manager pnpm
ff init my-project --skip-git --skip-install
```

### `ff generate component [name]`

Alias: `ff g c`

Generate a new component with optional test and story files.

**Options:**

| Option                           | Description                                                              | Default             |
| -------------------------------- | ------------------------------------------------------------------------ | ------------------- |
| `-s, --style`                    | Style format: `css` \| `scss` \| `styled` \| `tailwind` \| `css-modules` | Framework dependent |
| `--test / --no-test`             | Generate/skip test file                                                  | `true`              |
| `--story / --no-story`           | Generate/skip Storybook story                                            | `false`             |
| `--typescript / --no-typescript` | Use TypeScript/JavaScript                                                | `true`              |
| `-o, --out-dir`                  | Output directory                                                         | `src/components`    |
| `-f, --force`                    | Overwrite existing files                                                 | `false`             |
| `--debug`                        | Enable debug mode                                                        | `false`             |

**Examples:**

```bash
ff g c Button
ff g c Card --style=tailwind --story
ff g c Modal --no-test --out-dir src/ui
ff g c Header --style=css-modules --test --story
```

## ⚙️ Configuration

ffontana-cli supports cascading configuration from multiple sources, allowing you to define defaults at different levels.

### Configuration Precedence

Configuration is resolved in the following order (highest to lowest priority):

1. **CLI flags** - Command-line arguments override everything
2. **Project config** - `ff.config.ts` or `ff.config.js` in project root
3. **Workspace config** - `.ff/config.json` in monorepo root
4. **Global config** - `~/.config/ff-cli/config.json`
5. **Default config** - Built-in defaults

### Configuration File Examples

**TypeScript config (`ff.config.ts`):**

```typescript
import { defineConfig } from 'ff-cli';

export default defineConfig({
  framework: 'react',
  generators: {
    component: {
      style: 'css-modules',
      typescript: true,
      test: true,
      story: false,
    },
  },
  tasks: {
    lint: 'eslint src --ext .ts,.tsx',
    test: 'vitest',
    format: 'prettier --write "src/**/*.{ts,tsx}"',
  },
});
```

**JSON config (`ff.config.json`):**

```json
{
  "framework": "react",
  "generators": {
    "component": {
      "style": "css-modules",
      "typescript": true,
      "test": true,
      "story": false
    }
  }
}
```

## 📁 Project Structure

```
your-project/
├── src/
│   ├── components/          # Generated components go here
│   │   └── Button/
│   │       ├── Button.tsx
│   │       ├── Button.module.css
│   │       ├── Button.test.tsx
│   │       └── Button.stories.tsx
│   ├── App.tsx
│   └── main.tsx
├── ff.config.ts            # Project configuration
└── package.json
```

## 🔍 Framework Detection

ffontana-cli automatically detects your framework by analyzing `package.json` dependencies:

- **Next.js** - Detected if `next` is in dependencies
- **Lit** - Detected if `lit` is in dependencies
- **React** - Detected if `react` is in dependencies

Framework-specific generators and conventions are automatically applied based on detection.

## 📋 Templates

### Available Templates

| Template        | Description                             | Status         |
| --------------- | --------------------------------------- | -------------- |
| `react-ts`      | React with TypeScript, Vite, and ESLint | ✅ Available   |
| `nextjs-app`    | Next.js 14+ with App Router             | 🚧 Coming soon |
| `lit-component` | Lit web components                      | 🚧 Coming soon |

## 🛠️ Development

### Build the CLI

```bash
npm run build
```

### Watch mode (during development)

```bash
npm run dev
```

### Run tests

```bash
npm test
```

### Lint and format

```bash
npm run lint
npm run format
```

### Link locally for testing

```bash
npm run link:local
ff --version
```

### `ff git`

Git workflow helpers for conventional commits and automation.

#### `ff git commit`

Create conventional commits interactively with validation.

```bash
# Interactive conventional commit
ff git commit

# Dry run (preview without committing)
ff git commit --dry-run
```

#### `ff git setup-hooks`

Setup git hooks with husky and commitlint.

```bash
# Interactive setup
ff git setup-hooks

# Force reconfiguration
ff git setup-hooks --force
```

**Installs and configures:**
- Husky - Git hooks manager
- Commitlint - Enforce conventional commits
- lint-staged - Run linters on staged files
- Pre-commit and commit-msg hooks

#### `ff git branch [name]`

Create branches with naming conventions.

```bash
# Interactive branch creation
ff git branch

# Create feature branch
ff git branch user-authentication

# Create with issue number
ff git branch user-auth --issue 123

# Create without checkout
ff git branch new-feature --no-checkout
```

#### `ff git pr`

Generate pull request templates.

```bash
# Interactive PR template generation
ff git pr
```

## 🗺️ Roadmap

### Phase 1: MVP ✅

- [x] Project scaffolding (React TypeScript)
- [x] Component generation
- [x] Framework auto-detection
- [x] Config system
- [x] Package manager detection

### Phase 2: Core Modules ✅

- [x] Next.js and Lit templates
- [x] Additional generators (hooks, pages, elements)
- [x] Task runners (lint, format, test)
- [x] Config management

### Phase 3: Advanced Automation 🚧 (Current)

- [x] Git workflow helpers
- [ ] Dependency management
- [ ] Code mod utilities
- [ ] Monorepo support

### Phase 4: DX Polish 💎

- [ ] Enhanced error handling
- [ ] Performance optimizations
- [ ] Comprehensive documentation
- [ ] Testing suite expansion

### Phase 5: Plugin Ecosystem 🌐

- [ ] Plugin development kit (PDK)
- [ ] First-party plugins
- [ ] Plugin marketplace
- [ ] Community contributions

## 🏗️ Architecture

Built with modern best practices and industry-standard tools:

- **TypeScript** - Full type safety and IntelliSense support
- **Commander.js** - Robust CLI framework
- **Handlebars** - Powerful template engine
- **Zod** - Runtime configuration validation
- **tsup** - Fast bundling with esbuild
- **Vitest** - Lightning-fast unit testing

## 🤝 Contributing

Contributions are welcome! Whether it's:

- 🐛 Bug reports
- 💡 Feature requests
- 📖 Documentation improvements
- 🔧 Code contributions

Please check the [issues page](https://github.com/ffontanadev/ffontana-cli/issues) for open tasks or create a new issue to discuss your ideas.

### Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Link locally: `npm run link:local`
5. Run tests: `npm test`

## 📄 License

MIT © ffontana-cli

## 🙏 Acknowledgments

Built with ❤️ by the ffontana-cli team and powered by the amazing open-source community.

---
