# Getting Started with ffontana-cli

> A complete beginner's guide to creating your first project with ffontana-cli

Welcome! This guide will walk you through installing ffontana-cli and creating your first React application, step by step. No prior CLI experience required.

---

## What You'll Build

By the end of this guide, you'll have:

- ✅ A modern React app with TypeScript and Vite
- ✅ Your first reusable Button component with tests
- ✅ Git hooks configured for code quality
- ✅ Understanding of the CLI's core features

**Time required:** ~10 minutes

---

## Prerequisites

Before we begin, make sure you have:

### 1. Node.js Installed

ffontana-cli requires **Node.js 18.0.0 or higher**.

**Check your Node.js version:**

```bash
node --version
```

**Expected output:** `v18.0.0` or higher

**Don't have Node.js?** Download it from [nodejs.org](https://nodejs.org/)

### 2. A Package Manager

You'll need one of these (npm comes with Node.js):

- **npm** (included with Node.js)
- **pnpm** - Install with: `npm install -g pnpm`
- **yarn** - Install with: `npm install -g yarn`
- **bun** - Install from: [bun.sh](https://bun.sh)

**Check npm version:**

```bash
npm --version
```

**Expected output:** `9.0.0` or higher

### 3. Git (Optional but Recommended)

Check if git is installed:

```bash
git --version
```

**Don't have Git?** Download from [git-scm.com](https://git-scm.com/)

---

## Step 1: Install ffontana-cli

Let's install the CLI globally so you can use it anywhere.

**Open your terminal and run:**

```bash
npm install -g ffontana-cli
```

<details>
<summary><b>Using a different package manager?</b></summary>

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

</details>

**Verify the installation:**

```bash
ff --version
```

**Expected output:**
```
0.3.5
```

**See all available commands:**

```bash
ff --help
```

✅ **Checkpoint:** If you see the version number, you're ready to continue!

---

## Step 2: Create Your First Project

Now let's create a React project called `my-first-app`.

**Run this command:**

```bash
ff init my-first-app
```

**What happens next:**

The CLI will ask you a few questions. Here's what to choose:

### Question 1: Select a template

```
? Select a template: (Use arrow keys)
❯ react-ts - React 18 with TypeScript, Vite, and ESLint
  nextjs-app - Next.js 14+ with App Router
  lit-component - Lit web components
```

**Choose:** `react-ts` (press Enter)

**What is it?** A modern React setup with:
- **React 18** - Latest React version
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast dev server
- **ESLint** - Code quality checks

### Question 2: Package manager

```
? Select package manager: (Use arrow keys)
❯ npm
  pnpm
  yarn
  bun
```

**Choose:** `npm` (or your preferred package manager)

### Question 3: Initialize git repository?

```
? Initialize git repository? (Y/n)
```

**Choose:** `Y` (Yes - recommended)

**What it does:** Creates a git repository for version control

### Question 4: Install dependencies?

```
? Install dependencies? (Y/n)
```

**Choose:** `Y` (Yes)

**What it does:** Downloads and installs all required packages

**⏱️ This may take 1-2 minutes...**

---

## Step 3: Understanding What Was Created

Let's explore what the CLI just created:

**Navigate into your project:**

```bash
cd my-first-app
```

**View the project structure:**

```bash
ls -la
```

**You'll see:**

```
my-first-app/
├── .git/                    # Git repository
├── node_modules/            # Downloaded dependencies
├── public/                  # Static assets (images, fonts)
├── src/                     # Your application code
│   ├── App.tsx             # Main App component
│   ├── App.css             # App styles
│   ├── main.tsx            # Application entry point
│   └── components/         # Your components go here
├── .gitignore              # Files to ignore in git
├── eslint.config.js        # Linting configuration
├── index.html              # HTML template
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite bundler configuration
└── README.md               # Project documentation
```

**Key files to know:**

- **`src/App.tsx`** - Your main React component
- **`src/main.tsx`** - Where React mounts to the DOM
- **`package.json`** - Lists all dependencies and npm scripts

---

## Step 4: Run Your Application

Let's see your app in action!

**Start the development server:**

```bash
npm run dev
```

**You'll see:**

```
  VITE v5.x.x  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

**Open your browser to:** [http://localhost:5173/](http://localhost:5173/)

🎉 **You should see the React app running!**

**To stop the server:** Press `Ctrl + C` in the terminal

---

## Step 5: Generate Your First Component

Now let's create a reusable Button component using the CLI.

**Make sure you're in your project directory:**

```bash
pwd
# Should show: /path/to/my-first-app
```

**Generate a Button component:**

```bash
ff generate component Button
```

**Or use the shorthand:**

```bash
ff g c Button
```

### What the CLI Will Ask

**Question 1: Style format**

```
? Select style format: (Use arrow keys)
  css - Plain CSS
  scss - Sass/SCSS
❯ css-modules - Scoped CSS (recommended)
  styled - Styled Components
  tailwind - Tailwind CSS
```

**Choose:** `css-modules` (press Enter)

**Why CSS Modules?** Styles are automatically scoped to your component, preventing naming conflicts.

**Question 2: Generate test file?**

```
? Generate test file? (Y/n)
```

**Choose:** `Y` (Yes)

**Question 3: Generate Storybook story?**

```
? Generate Storybook story? (Y/n)
```

**Choose:** `N` (No - we'll keep it simple for now)

**✨ Component generated!**

---

## Step 6: Understanding the Generated Files

The CLI created a folder with three files:

```bash
ls src/components/Button/
```

**Output:**
```
Button.tsx
Button.module.css
Button.test.tsx
```

### 1. Button.tsx - The Component

**Open `src/components/Button/Button.tsx`:**

```typescript
import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
};
```

**What's happening here:**

- **Line 1:** Import React
- **Line 2:** Import scoped styles from CSS module
- **Lines 4-7:** TypeScript interface defining props (children and onClick)
- **Line 9:** Component function that returns JSX
- **Line 11:** Button element with scoped CSS class and click handler

### 2. Button.module.css - The Styles

**Open `src/components/Button/Button.module.css`:**

```css
.button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 0.375rem;
  background-color: #3b82f6;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button:hover {
  background-color: #2563eb;
}
```

**What's special:** The `.button` class is automatically scoped to only this component!

### 3. Button.test.tsx - The Tests

**Open `src/components/Button/Button.test.tsx`:**

```typescript
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

**What's this:** Automated tests that verify your component works correctly.

---

## Step 7: Use Your Component

Let's add the Button to your app!

**Open `src/App.tsx` in your editor** and replace the content with:

```typescript
import { Button } from './components/Button/Button';
import './App.css';

function App() {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <div className="App">
      <h1>My First ffontana-cli App</h1>
      <p>Welcome to your new React application!</p>
      <Button onClick={handleClick}>
        Click Me!
      </Button>
    </div>
  );
}

export default App;
```

**Save the file** and check your browser (the dev server should still be running).

**You should see your button!** Click it to test the alert.

---

## Step 8: Run Tests

Let's run the automated tests for your Button component.

**In a new terminal window**, run:

```bash
npm test
```

**You'll see:**

```
 ✓ src/components/Button/Button.test.tsx (1)
   ✓ Button (1)
     ✓ should render correctly

Test Files  1 passed (1)
     Tests  1 passed (1)
  Start at  10:30:15
  Duration  1.23s
```

✅ **Your tests are passing!**

**To stop tests:** Press `q` or `Ctrl + C`

---

## Step 9: Generate More Components

Now that you understand the pattern, let's generate more components:

**Generate a Card component:**

```bash
ff g c Card --style=css-modules
```

**Generate an Input component:**

```bash
ff g c Input --style=css-modules
```

**Generate a Header component:**

```bash
ff g c Header --style=css-modules --no-test
```

**Notice:** We used `--no-test` to skip the test file for Header.

---

## Step 10: Setup Git Hooks (Optional but Recommended)

Let's add automated code quality checks before every commit.

**Run:**

```bash
ff git setup-hooks
```

**The CLI will ask what to install:**

```
? Install Husky? (Y/n)
```

**Choose:** `Y` for each prompt

**What gets installed:**

1. **Husky** - Git hooks manager
2. **Commitlint** - Validates commit messages
3. **lint-staged** - Runs linters on staged files

**What this does:**

From now on, every time you commit code:
- ✅ Linting runs automatically
- ✅ Tests run automatically
- ✅ Code is formatted automatically
- ✅ Commit messages are validated

---

## Step 11: Make Your First Commit

Let's commit your changes with a proper conventional commit message.

**Stage all changes:**

```bash
git add .
```

**Create a commit using the CLI:**

```bash
ff git commit
```

**The CLI will guide you:**

### Question 1: Commit type

```
? Select commit type: (Use arrow keys)
❯ feat - A new feature
  fix - A bug fix
  docs - Documentation only changes
  style - Code style changes
  refactor - Code refactoring
  test - Adding tests
  chore - Maintenance tasks
```

**Choose:** `feat` (we're adding new features!)

### Question 2: Scope (optional)

```
? Commit scope (optional):
```

**Type:** `components` (press Enter)

### Question 3: Subject

```
? Short description (imperative mood):
```

**Type:** `add Button, Card, and Input components`

### Question 4: Body (optional)

```
? Detailed description (optional):
```

**Type:** `Generated using ffontana-cli with tests and CSS modules`

### Question 5: Breaking changes?

```
? Are there breaking changes? (y/N)
```

**Choose:** `N`

### Question 6: Issue references (optional)

```
? Issue references (e.g., #123, #456):
```

**Leave blank** (press Enter)

**✅ Commit created!**

Your commit message looks like:

```
feat(components): add Button, Card, and Input components

Generated using ffontana-cli with tests and CSS modules
```

---

## Step 12: View Your Configuration

ffontana-cli uses configuration files to store your preferences.

**View your current config:**

```bash
ff config
```

**Create a custom config:**

Create a file called `ff.config.ts` in your project root:

```typescript
import { defineConfig } from 'ffontana-cli';

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
});
```

**Save it** and now all future components will use these defaults!

**Test it:**

```bash
ff g c Modal
# No questions asked - uses config defaults!
```

---

## Next Steps

Congratulations! 🎉 You've learned the essentials of ffontana-cli.

### Continue Learning

1. **[Commands Reference](./COMMANDS.md)** - Explore all available commands
2. **[Configuration Guide](./CONFIGURATION.md)** - Master the configuration system
3. **[Generate Hooks](./COMMANDS.md#hook-generation)** - Create custom React hooks
4. **[Git Workflow](./COMMANDS.md#git-workflow)** - Streamline your git workflow

### Try These Next

**Generate a custom hook:**

```bash
ff generate hook useCounter
```

**Create a feature branch:**

```bash
ff git branch add-user-profile
```

**Generate a PR template:**

```bash
ff git pr
```

**Add a custom template:**

```bash
ff add template https://github.com/your-org/react-template
```

---

## Common Issues

### "Command not found: ff"

**Solution:** The CLI wasn't installed globally.

```bash
# Install globally
npm install -g ffontana-cli

# Verify
ff --version
```

### "Not in a project directory"

**Solution:** Navigate to your project folder.

```bash
cd my-first-app
```

### Port 5173 is already in use

**Solution:** Another app is using that port.

```bash
# Stop the other server or use a different port
npm run dev -- --port 3000
```

### Tests are failing

**Solution:** Make sure dependencies are installed.

```bash
npm install
```

---

## Quick Command Reference

Here are the commands you learned:

```bash
# Install CLI
npm install -g ffontana-cli

# Create project
ff init <project-name>

# Generate components
ff g c <ComponentName>

# Generate hooks
ff g h <hookName>

# Run dev server
npm run dev

# Run tests
npm test

# Setup git hooks
ff git setup-hooks

# Create commit
ff git commit

# View config
ff config

# Get help
ff --help
ff <command> --help
```

---

## Summary

In this guide, you:

- ✅ Installed ffontana-cli
- ✅ Created a React project with TypeScript and Vite
- ✅ Generated reusable components with tests
- ✅ Ran your application and tests
- ✅ Setup git hooks for code quality
- ✅ Made conventional commits
- ✅ Configured the CLI for your project

**You're now ready to build amazing React applications with ffontana-cli!**

---

## Get Help

Need assistance?

- 📖 **Documentation:** [Full Documentation](../README.md)
- 🐛 **Issues:** [GitHub Issues](https://github.com/ffontanadev/ffontana-cli/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/ffontanadev/ffontana-cli/discussions)

Happy coding! 🚀
