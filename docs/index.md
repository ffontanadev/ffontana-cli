---
layout: default
title: Home
nav_order: 1
---

# ffontana-cli Documentation

{: .fs-9 }

A Swiss Army Knife CLI for modern frontend development. Streamline your workflow across React, Next.js, and Lit projects with powerful code generation, git workflows, and CI/CD integration.
{: .fs-6 .fw-300 }

[Get Started Now →](GETTING_STARTED.md){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[View on GitHub](https://github.com/ffontanadev/ffontana-cli){: .btn .fs-5 .mb-4 .mb-md-0 }

---

## What is ffontana-cli?

**ffontana-cli** (command: `ff`) is a comprehensive CLI tool that unifies common development workflows into a single, intuitive interface. Built with TypeScript, it provides framework-aware code generation, git automation, and team collaboration tools.

### Why Use ffontana-cli?

- ⚡ **Fast Setup** - Create production-ready projects in seconds
- 🎨 **Smart Generators** - Generate components, hooks, and pages with framework-specific best practices
- 🔧 **Unified Workflow** - One CLI for scaffolding, code generation, git workflows, and CI/CD integration
- 📦 **Package Manager Agnostic** - Works seamlessly with npm, pnpm, yarn, and Bun
- ⚙️ **Highly Configurable** - Cascading configuration system (global → workspace → project)
- 🤝 **Team-Friendly** - Enforce code standards and conventions across your organization

---

## Quick Start

Get up and running in 30 seconds:

```bash
# Install globally
npm install -g ffontana-cli

# Create a new React project
ff init my-app

# Navigate to project
cd my-app

# Generate your first component
ff generate component Button

# Start coding! 🎉
```

---

## Documentation by Experience Level

### 🌱 New to ffontana-cli?

Perfect! Start here to learn the fundamentals:

<div class="code-example" markdown="1">

#### [📖 Getting Started Guide](GETTING_STARTED.md)
**Complete beginner tutorial** - Build your first app step-by-step
- Installation and setup
- Create your first project
- Generate components with tests
- Setup git hooks
- Make your first commit

**⏱️ Time:** 10 minutes | **Level:** Beginner

[Start Tutorial →](GETTING_STARTED.md){: .btn .btn-primary }

</div>

---

### 📚 Core Documentation

Master the essentials of ffontana-cli:

<div class="d-flex flex-wrap" markdown="1">

<div class="col-md-6 mb-4" markdown="1">

#### [Commands Reference](COMMANDS.md)
Complete guide to all CLI commands with examples and options.

**What you'll learn:**
- Project initialization
- Code generation (components, hooks, pages, elements)
- Git workflow commands
- Development tasks (lint, format, test)
- Jenkins and Spring Boot integration

[Explore Commands →](COMMANDS.md)

</div>

<div class="col-md-6 mb-4" markdown="1">

#### [Configuration Guide](CONFIGURATION.md)
Master the cascading configuration system.

**What you'll learn:**
- Configuration hierarchy
- Project-level configuration
- Team standardization
- Monorepo setup
- Configuration recipes

[Learn Configuration →](CONFIGURATION.md)

</div>

<div class="col-md-6 mb-4" markdown="1">

#### [Templates System](TEMPLATES.md)
Learn about templates and create custom ones.

**What you'll learn:**
- Built-in templates
- Adding custom templates
- Template structure
- Handlebars syntax
- Template best practices

[Explore Templates →](TEMPLATES.md)

</div>

<div class="col-md-6 mb-4" markdown="1">

#### [Quick Reference](QUICK_REFERENCE.md)
Cheat sheet of all commands and flags.

**Quick access to:**
- Command syntax
- Common flags
- Aliases
- Usage examples

[View Cheat Sheet →](QUICK_REFERENCE.md)

</div>

</div>

---

### 🚀 Advanced Topics

For experienced users looking to go deeper:

<div class="d-flex flex-wrap" markdown="1">

<div class="col-md-6 mb-4" markdown="1">

#### [Architecture Overview](ARCHITECTURE.md)
Understand the internal design and patterns.

**Topics covered:**
- System architecture
- Core modules (detector, config-loader, template-engine)
- Design patterns
- Data flow
- Extension points
- Performance considerations

[Read Architecture Docs →](ARCHITECTURE.md)

</div>

<div class="col-md-6 mb-4" markdown="1">

#### [Development Guide](DEVELOPMENT.md)
Contribute to ffontana-cli development.

**Topics covered:**
- Local development setup
- Build and test
- Development workflow
- Debugging techniques
- Testing strategies

[Start Contributing →](DEVELOPMENT.md)

</div>

<div class="col-md-6 mb-4" markdown="1">

#### [API Reference](API_REFERENCE.md)
Programmatic API documentation.

**Topics covered:**
- Core APIs
- Plugin system (planned)
- Extending functionality
- Integration patterns

[View API Docs →](API_REFERENCE.md)

</div>

<div class="col-md-6 mb-4" markdown="1">

#### [Contributing Guidelines](CONTRIBUTING.md)
Join the community and contribute.

**How to contribute:**
- Code of conduct
- Reporting issues
- Pull request process
- Coding standards
- Commit conventions

[Contribute →](CONTRIBUTING.md)

</div>

</div>

---

## Popular Guides & Workflows

### Common Use Cases

<div class="code-example" markdown="1">

**🏗️ Starting a New Project**
```bash
ff init my-app --template react-ts --package-manager pnpm
cd my-app
ff git setup-hooks
```
[View Full Workflow →](GETTING_STARTED.md#step-1-initialize-your-project)

**🎨 Generating Components**
```bash
ff g c Button --style=tailwind --test --story
ff g c Card --style=css-modules
ff g h useAuth
```
[View Component Guide →](COMMANDS.md#component-generation)

**🌿 Git Workflow Automation**
```bash
ff git branch add-feature
ff git commit
ff git pr
```
[View Git Commands →](COMMANDS.md#git-workflow)

**👥 Team Standardization**
Create `ff.config.ts` with team defaults:
```typescript
export default defineConfig({
  generators: {
    component: { style: 'tailwind', test: true, story: true }
  }
});
```
[View Configuration Examples →](CONFIGURATION.md#configuration-recipes)

</div>

---

## Feature Highlights

### 📦 Project Templates

Available templates for rapid project setup:

| Template | Description | Status |
|----------|-------------|--------|
| `react-ts` | React 18+ with TypeScript, Vite, ESLint | ✅ Available |
| `nextjs-app` | Next.js 14+ with App Router, TypeScript | ✅ Available |
| `lit-component` | Lit web components with TypeScript | ✅ Available |

### 🎨 Code Generators

Generate framework-specific code with best practices:

- **Components** - React, Next.js, or Lit components with tests and stories
- **Hooks** - React custom hooks with tests (React/Next.js)
- **Pages** - Next.js App Router pages with dynamic routes (Next.js)
- **Elements** - Lit web components with tests (Lit)

### 🌿 Git Integration

Streamline your git workflow:

- **Conventional Commits** - Interactive commit creation with validation
- **Branch Naming** - Standardized branch conventions
- **Git Hooks** - Automated quality checks with Husky and Commitlint
- **PR Templates** - Generate pull request templates

### 🚀 CI/CD Integration

Connect with your development tools:

- **Jenkins** - Webhook listener for build notifications
- **Spring Boot** - JUnit 5 test generation for Java projects
- **Task Runners** - Unified lint, format, and test commands

---

## Installation

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm, pnpm, yarn, or bun**

### Install

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

**Verify:**
```bash
ff --version
# Output: 0.3.5
```

[Full Installation Guide →](GETTING_STARTED.md#step-1-install-ffontana-cli)

---

## Command Overview

Quick reference of available commands:

```bash
ff init [name]                     # Initialize new project
ff generate component [name]       # Generate component (alias: ff g c)
ff generate hook [name]            # Generate hook (alias: ff g h)
ff generate page [name]            # Generate page (alias: ff g p)
ff generate element [name]         # Generate element (alias: ff g e)
ff add template [source]           # Add custom template (alias: ff a t)
ff config                          # View configuration
ff lint                            # Run linting
ff format                          # Run formatting
ff test                            # Run tests
ff git commit                      # Conventional commits
ff git branch [name]               # Create branch
ff git setup-hooks                 # Setup git hooks
ff git pr                          # Generate PR template
ff jenkins listen                  # Jenkins webhook listener
ff springboot generate-test [name] # Generate Spring Boot test (alias: ff sb gt)
```

[Complete Commands Reference →](COMMANDS.md)

---

## Community & Support

### Get Help

- 📖 **Documentation:** You're reading it! Start with [Getting Started](GETTING_STARTED.md)
- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/ffontanadev/ffontana-cli/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/ffontanadev/ffontana-cli/discussions)
- 📧 **Email:** [ffontana.dev@gmail.com](mailto:ffontana.dev@gmail.com)

### Contribute

We welcome contributions from the community!

- 🐛 Report bugs
- 💡 Suggest features
- 📖 Improve documentation
- 🔧 Submit pull requests

[Contributing Guide →](CONTRIBUTING.md)

---

## Quick Links

| Resource | Description |
|----------|-------------|
| [GitHub Repository](https://github.com/ffontanadev/ffontana-cli) | Source code and issue tracker |
| [Release Notes](https://github.com/ffontanadev/ffontana-cli/releases) | Latest releases and changelogs |
| [npm Package](https://www.npmjs.com/package/ffontana-cli) | Published package |
| [Main README](../README.md) | Project overview and quick start |

---

## Next Steps

Choose your path:

<div class="code-example" markdown="1">

**🌱 Just Getting Started?**
- [ ] [Complete the Getting Started Tutorial](GETTING_STARTED.md)
- [ ] [Read the Commands Reference](COMMANDS.md)
- [ ] [Setup Your First Project Configuration](CONFIGURATION.md)

**📚 Ready to Level Up?**
- [ ] [Explore Advanced Configuration](CONFIGURATION.md#configuration-recipes)
- [ ] [Learn Git Workflow Integration](COMMANDS.md#git-workflow)
- [ ] [Add Custom Templates](TEMPLATES.md)

**🚀 Want to Contribute?**
- [ ] [Read the Architecture Docs](ARCHITECTURE.md)
- [ ] [Setup Development Environment](DEVELOPMENT.md)
- [ ] [Check Contributing Guidelines](CONTRIBUTING.md)

</div>

---

<div align="center">

**Made with TypeScript and ❤️ by the ffontana-cli team**

[⬆ Back to Top](#ffontana-cli-documentation)

</div>
