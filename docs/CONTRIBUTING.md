# Contributing to ffontana-cli

> Thank you for your interest in contributing to ffontana-cli! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Release Process](#release-process)
- [Community](#community)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive experience for everyone. We expect all contributors to:

- Be respectful and considerate
- Welcome newcomers and help them get started
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Trolling, insulting, or derogatory remarks
- Personal or political attacks
- Publishing others' private information
- Any conduct that could reasonably be considered inappropriate

### Enforcement

Violations may result in temporary or permanent ban from the project. Report issues to the maintainers.

---

## How Can I Contribute?

### 1. Reporting Bugs

Found a bug? Help us fix it!

**Before submitting**:
- Search existing issues to avoid duplicates
- Verify the bug exists in the latest version
- Collect information about your environment

**Create a bug report**:
1. Go to [Issues](https://github.com/ffontanadev/ffontana-cli/issues)
2. Click "New Issue"
3. Select "Bug Report" template
4. Fill in all required sections

**Include**:
- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, package manager)
- Error messages or screenshots
- Minimal reproducible example if possible

**Example**:
```markdown
## Bug Report

**Description**: Component generation fails with TypeScript projects using pnpm

**Steps to Reproduce**:
1. Create new project: `ff init my-app --package-manager pnpm`
2. Run: `ff g c Button`
3. Error occurs

**Expected**: Component should be generated successfully
**Actual**: Error: "Template not found"

**Environment**:
- OS: macOS 13.0
- Node: 18.17.0
- Package Manager: pnpm 8.6.0
- ffontana-cli: 0.2.1

**Error Output**:
```
Error: ENOENT: no such file or directory
  at renderTemplate (template-engine.ts:69)
```
```

---

### 2. Suggesting Features

Have an idea for improvement?

**Before suggesting**:
- Check if it's already proposed
- Ensure it aligns with project goals
- Consider if it could be a plugin instead

**Create a feature request**:
1. Open a new issue
2. Select "Feature Request" template
3. Describe the feature and its benefits

**Include**:
- Clear use case
- Proposed API or usage
- Alternatives you've considered
- Willingness to implement it yourself

**Example**:
```markdown
## Feature Request

**Feature**: Add Vue.js support

**Use Case**: Many developers use Vue and would benefit from scaffolding tools

**Proposed API**:
```bash
ff init my-vue-app --template vue-ts
ff g c MyComponent --framework vue
```

**Alternatives Considered**:
- Using Vite templates (lacks code generation)
- Manual setup (time-consuming)

**Implementation**: I'm willing to contribute this feature
```

---

### 3. Improving Documentation

Documentation improvements are always welcome!

**Areas to improve**:
- Fix typos or unclear explanations
- Add examples and use cases
- Improve error messages
- Translate to other languages (future)

**How to contribute docs**:
1. Fork the repository
2. Edit files in `docs/` directory
3. Submit a pull request

---

### 4. Writing Code

Ready to contribute code? Awesome!

**Good first issues**:
- Look for issues labeled `good first issue`
- Check `help wanted` label
- Start small to get familiar with the codebase

**What to work on**:
- Bug fixes
- New generators (Vue, Svelte, Angular)
- New templates
- Performance improvements
- Test coverage
- Error handling improvements

---

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/ffontana-cli.git
cd ffontana-cli
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Project

```bash
npm run build
```

### 4. Link Locally

```bash
npm run link:local
```

### 5. Verify Setup

```bash
ff --version
# Should show the version from package.json
```

### 6. Run Tests

```bash
npm test
```

---

## Development Workflow

### 1. Create a Branch

```bash
# Create feature branch
git checkout -b feature/add-vue-support

# Or bug fix branch
git checkout -b fix/template-path-issue
```

**Branch naming**:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test improvements
- `chore/` - Maintenance tasks

---

### 2. Make Changes

```bash
# Run in watch mode during development
npm run dev

# In another terminal, test changes
ff g c TestComponent
```

---

### 3. Write Tests

All new features and bug fixes should include tests.

```typescript
// src/__tests__/commands/generate/component.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { generateComponent } from '../../../commands/generate/component.js';

describe('generateComponent', () => {
  it('should generate component with CSS modules', async () => {
    // Test implementation
  });
});
```

**Run tests**:
```bash
npm test

# Watch mode
npm test -- --watch

# Coverage
npm run test:coverage
```

---

### 4. Lint and Format

```bash
# Check linting
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

---

### 5. Type Check

```bash
npm run type-check
```

---

### 6. Commit Changes

We use **conventional commits** for clear, semantic commit messages.

**Format**:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```bash
git commit -m "feat: add Vue component generator"

git commit -m "fix: resolve template path issue on Windows"

git commit -m "docs: improve configuration guide examples"

git commit -m "test: add tests for hook generator"
```

**Detailed commit**:
```bash
git commit -m "feat(generate): add Next.js page generator

- Support App Router pages
- Handle dynamic routes
- Add page-specific styles
- Include tests

Closes #42"
```

---

### 7. Push Changes

```bash
git push origin feature/add-vue-support
```

---

## Coding Standards

### TypeScript Guidelines

```typescript
// ✅ DO: Use explicit return types
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

// ✅ DO: Document public APIs
/**
 * Detect project framework and configuration
 * @param cwd - Working directory (defaults to process.cwd())
 * @returns Project information including framework, TypeScript status, etc.
 */
export async function detectProject(cwd?: string): Promise<ProjectInfo>

// ❌ DON'T: Use any
function processData(data: any) { }  // Bad

// ❌ DON'T: Use non-null assertions without comments
const value = obj!.property;  // Bad

// ✅ DO: Add comments when necessary
const value = obj!.property;  // Safe: obj is guaranteed to exist here

// ❌ DON'T: Ignore TypeScript errors
// @ts-ignore  // Bad
someFunction();
```

---

### Code Organization

```typescript
// File structure
import statements
↓
Type definitions
↓
Constants
↓
Helper functions (private)
↓
Main exported functions
↓
Command registration
```

**Example**:
```typescript
// Imports
import path from 'path';
import type { Command } from 'commander';

// Types
interface Options {
  style: string;
}

// Constants
const DEFAULT_STYLE = 'css-modules';

// Helper functions
function getTemplatePath() {
  // ...
}

// Main functions
export async function generateComponent(name: string, options: Options) {
  // ...
}

// Command registration
export function registerComponentCommand(program: Command) {
  // ...
}
```

---

### Error Handling

```typescript
// ✅ DO: Provide user-friendly error messages
try {
  const project = await detectProject();
} catch (error) {
  logger.error('No package.json found in current directory');
  logger.info('💡 Tip: Run "ff init" to create a new project');
  process.exit(1);
}

// ✅ DO: Use debug flag for detailed errors
if (options.debug) {
  console.error(error);  // Full stack trace
}

// ✅ DO: Validate inputs early
if (!name || name.trim().length === 0) {
  throw new Error('Component name is required');
}
```

---

### Naming Conventions

- **Files**: `kebab-case.ts`
- **Functions**: `camelCase`
- **Classes**: `PascalCase`
- **Interfaces**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Private functions**: `_camelCase` or prefix with `_`

```typescript
// File: project-detector.ts

const DEFAULT_CONFIG = { };  // Constant

interface ProjectInfo { }  // Interface

export function detectProject() { }  // Public function

function _parsePackageJson() { }  // Private function
```

---

## Testing Requirements

### Test Coverage

- **Minimum coverage**: 80%
- **New features**: Must include tests
- **Bug fixes**: Add regression tests

### Test Structure

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Feature Name', () => {
  // Setup
  beforeEach(() => {
    // Prepare test environment
  });

  // Teardown
  afterEach(() => {
    // Clean up
  });

  // Test cases
  it('should handle basic case', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = functionUnderTest(input);

    // Assert
    expect(result).toBe('expected');
  });

  it('should handle edge case', () => {
    // Test edge cases
  });

  it('should throw error for invalid input', () => {
    expect(() => {
      functionUnderTest(null);
    }).toThrow('Invalid input');
  });
});
```

### Running Tests

```bash
# All tests
npm test

# Specific file
npm test -- project-detector

# Watch mode
npm test -- --watch

# Coverage
npm run test:coverage

# UI mode
npm run test:ui
```

---

## Pull Request Process

### 1. Update Your Branch

```bash
# Sync with main branch
git checkout main
git pull upstream main
git checkout feature/add-vue-support
git rebase main
```

### 2. Create Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Fill in the PR template

**PR Title**:
```
feat: add Vue component generator
fix: resolve Windows path issues
docs: improve template documentation
```

**PR Description** should include:
- **What**: What does this PR do?
- **Why**: Why is this change needed?
- **How**: How does it work?
- **Testing**: How was it tested?
- **Screenshots**: If applicable
- **Breaking Changes**: If any
- **Related Issues**: Fixes #123

**Example PR**:
```markdown
## Description
Adds support for Vue.js component generation

## Why
Many users requested Vue support (#42)

## Changes
- Add Vue component template
- Implement Vue-specific generator
- Update documentation
- Add tests

## Testing
- ✅ Unit tests pass
- ✅ Manual testing with Vue 3 project
- ✅ Type checking passes
- ✅ Linting passes

## Breaking Changes
None

## Related Issues
Closes #42
```

---

### 3. Code Review

**Review process**:
1. Maintainer reviews code
2. Automated checks run (CI/CD)
3. Feedback addressed
4. Approval granted
5. Merged!

**What reviewers look for**:
- Code quality and style
- Test coverage
- Documentation updates
- Breaking changes
- Performance impact

**Addressing feedback**:
```bash
# Make requested changes
git add .
git commit -m "refactor: address review feedback"
git push origin feature/add-vue-support
```

---

### 4. Merge Requirements

**Before merging**:
- ✅ All tests pass
- ✅ Code reviewed and approved
- ✅ No merge conflicts
- ✅ Documentation updated
- ✅ CHANGELOG updated (for releases)

---

## Issue Guidelines

### Bug Reports

Use the bug report template and include:
- Clear title
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Error messages
- Minimal reproducible example

### Feature Requests

Use the feature request template and include:
- Problem statement
- Proposed solution
- Use cases
- API examples
- Alternatives considered

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `question` - Further information requested
- `wontfix` - Will not be worked on
- `duplicate` - Already exists
- `invalid` - Invalid issue

---

## Release Process

### Versioning

We follow **Semantic Versioning** (semver):

- **Major** (1.0.0): Breaking changes
- **Minor** (0.1.0): New features, backwards compatible
- **Patch** (0.0.1): Bug fixes, backwards compatible

### Release Steps

**For Maintainers**:

```bash
# 1. Update version
npm version patch  # or minor, major

# 2. Update CHANGELOG
vim CHANGELOG.md

# 3. Commit changes
git add .
git commit -m "chore: release v0.2.2"

# 4. Create tag
git tag v0.2.2

# 5. Push
git push origin main --tags

# 6. Build
npm run build

# 7. Publish
npm publish

# 8. Create GitHub release
# Go to GitHub > Releases > New Release
```

---

## Community

### Getting Help

- **Documentation**: Check [docs/](../docs/)
- **Issues**: Search existing issues
- **Discussions**: GitHub Discussions (coming soon)
- **Discord**: Community Discord (coming soon)

### Staying Updated

- **Watch** the repository for updates
- **Star** the project if you find it useful
- Follow release notes

### Recognition

Contributors are recognized in:
- CONTRIBUTORS.md file
- Release notes
- GitHub contributors page

---

## Development Resources

### Useful Commands

```bash
# Development
npm run dev              # Watch mode
npm run build            # Build project
npm run link:local       # Link for testing

# Testing
npm test                 # Run tests
npm run test:coverage    # Coverage report
npm run test:ui          # UI mode

# Code Quality
npm run lint             # Check linting
npm run lint:fix         # Fix linting
npm run format           # Format code
npm run type-check       # Type checking
```

### Project Structure

```
ffontana-cli/
├── src/              # Source code
├── templates/        # Code templates
├── docs/            # Documentation
├── __tests__/       # Test files
└── dist/            # Build output
```

### Key Files

- `src/cli.ts` - CLI entry point
- `src/commands/` - Command implementations
- `src/core/` - Core modules
- `tsconfig.json` - TypeScript config
- `vitest.config.ts` - Test config

---

## Questions?

If you have questions:
1. Check documentation
2. Search existing issues
3. Create a new issue with label `question`

---

## Thank You!

Your contributions make ffontana-cli better for everyone. Whether it's a bug report, feature request, or pull request, we appreciate your effort!

Happy coding! 🚀

---

For more information:
- [Development Guide](./DEVELOPMENT.md)
- [Architecture Documentation](./ARCHITECTURE.md)
- [API Reference](./API_REFERENCE.md)
- [Command Reference](./COMMANDS.md)
