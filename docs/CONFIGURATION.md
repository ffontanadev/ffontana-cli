# Configuration Guide

> Complete guide to configuring ffontana-cli for your workflow

## Table of Contents

- [Overview](#overview)
- [Configuration Files](#configuration-files)
- [Precedence Rules](#precedence-rules)
- [Configuration Schema](#configuration-schema)
- [Generator Configuration](#generator-configuration)
- [Task Configuration](#task-configuration)
- [Template Overrides](#template-overrides)
- [Hooks Configuration](#hooks-configuration)
- [Framework-Specific Defaults](#framework-specific-defaults)
- [Configuration Recipes](#configuration-recipes)
- [Migration Guide](#migration-guide)

---

## Overview

ffontana-cli supports **cascading configuration** from multiple sources, allowing you to set defaults at different levels of your workflow.

### Why Configuration?

- **Consistency**: Enforce team standards across projects
- **Productivity**: Avoid repetitive CLI flags
- **Flexibility**: Override defaults per project or globally
- **Monorepo Support**: Workspace-level configuration

### Configuration Hierarchy

```
CLI Flags (Highest Priority)
    ↓
Project Config (ff.config.ts in project root)
    ↓
Workspace Config (.ff/config.json in monorepo root)
    ↓
Global Config (~/.config/ff-cli/config.json)
    ↓
Default Config (Built-in defaults)
```

---

## Configuration Files

### Supported Formats

ffontana-cli supports multiple configuration formats:

#### 1. TypeScript Config (Recommended)

**File**: `ff.config.ts`

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
    hook: {
      typescript: true,
      test: true,
    },
  },
  tasks: {
    lint: 'eslint src --ext .ts,.tsx',
    test: 'vitest',
    format: 'prettier --write "src/**/*.{ts,tsx}"',
  },
});
```

**Benefits**:
- Type safety and autocomplete
- Dynamic configuration with JS logic
- Import external modules

---

#### 2. JavaScript Config

**File**: `ff.config.js`

```javascript
export default {
  framework: 'react',
  generators: {
    component: {
      style: 'tailwind',
      typescript: true,
      test: true,
    },
  },
  tasks: {
    lint: 'eslint src',
    test: 'vitest',
  },
};
```

---

#### 3. JSON Config

**File**: `ff.config.json` or `.ffrc`

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
  },
  "tasks": {
    "lint": "eslint src",
    "test": "vitest"
  }
}
```

**Note**: JSON doesn't support comments or dynamic logic.

---

### File Locations

#### Project Config

Located in project root:
- `ff.config.ts` (TypeScript)
- `ff.config.js` (JavaScript)
- `ff.config.json` (JSON)
- `.ffrc` (JSON)

**Priority**: First file found in this order.

---

#### Workspace Config (Monorepo)

**File**: `.ff/config.json` in monorepo root

```
my-monorepo/
├── .ff/
│   └── config.json          # Workspace config
├── packages/
│   ├── app1/
│   │   └── ff.config.ts     # Overrides workspace config
│   └── app2/
│       └── ff.config.ts     # Overrides workspace config
└── package.json
```

**Example** (`.ff/config.json`):
```json
{
  "framework": "auto",
  "generators": {
    "component": {
      "style": "css-modules",
      "test": true
    }
  }
}
```

---

#### Global Config

**File**: `~/.config/ff-cli/config.json`

**Location**:
- macOS/Linux: `~/.config/ff-cli/config.json`
- Windows: `%USERPROFILE%\.config\ff-cli\config.json`

**Example**:
```json
{
  "generators": {
    "component": {
      "style": "tailwind",
      "test": true,
      "story": true
    }
  }
}
```

**Create global config**:
```bash
mkdir -p ~/.config/ff-cli
cat > ~/.config/ff-cli/config.json << 'EOF'
{
  "generators": {
    "component": {
      "style": "tailwind",
      "test": true
    }
  }
}
EOF
```

---

## Precedence Rules

### How Configuration is Merged

Configuration sources are **deep-merged** from lowest to highest priority:

```typescript
// Example merge
Default:    { generators: { component: { test: true, story: false } } }
Global:     { generators: { component: { style: 'css-modules' } } }
Project:    { generators: { component: { story: true } } }
CLI Flag:   --style=tailwind

// Result:
{
  generators: {
    component: {
      test: true,          // from default
      story: true,         // from project (overrides default)
      style: 'tailwind'    // from CLI flag (overrides global)
    }
  }
}
```

### Interactive Example

```bash
# Global config sets style to 'css-modules'
~/.config/ff-cli/config.json:
  { "generators": { "component": { "style": "css-modules" } } }

# Project config sets test to false
ff.config.ts:
  { generators: { component: { test: false } } }

# CLI flag sets style to 'tailwind'
ff g c Button --style=tailwind

# Result:
# - style: 'tailwind' (from CLI flag)
# - test: false (from project config)
# - story: false (from default config)
```

---

## Configuration Schema

### Root Configuration

```typescript
interface FFConfig {
  framework: 'react' | 'next' | 'lit' | 'auto';
  plugins: string[];
  generators?: GeneratorsConfig;
  tasks?: TasksConfig;
  templates?: TemplatesConfig;
  hooks?: HooksConfig;
}
```

### Complete Schema

```typescript
import { defineConfig } from 'ffontana-cli';

export default defineConfig({
  // Framework selection
  framework: 'auto', // 'react' | 'next' | 'lit' | 'auto'

  // Plugins (Phase 2+)
  plugins: [],

  // Generator configurations
  generators: {
    component: {
      style: 'css-modules',     // 'css' | 'scss' | 'styled' | 'tailwind' | 'css-modules'
      typescript: true,          // boolean
      test: true,               // boolean
      story: false,             // boolean
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

  // Task commands
  tasks: {
    lint: 'eslint src',
    test: 'vitest',
    format: 'prettier --write "src/**/*.ts"',
  },

  // Template overrides
  templates: {
    component: './custom-templates/component',
    hook: './custom-templates/hook',
  },

  // Lifecycle hooks (Phase 2+)
  hooks: {},
});
```

---

## Generator Configuration

### Component Generator

```typescript
{
  generators: {
    component: {
      style: 'css-modules',    // Default style format
      typescript: true,        // Use TypeScript by default
      test: true,             // Generate test files
      story: false,           // Generate Storybook stories
    }
  }
}
```

**All Options**:

| Option | Type | Default | Values |
|--------|------|---------|--------|
| `style` | string | `'css-modules'` | `'css'`, `'scss'`, `'styled'`, `'tailwind'`, `'css-modules'` |
| `typescript` | boolean | `true` | `true`, `false` |
| `test` | boolean | `true` | `true`, `false` |
| `story` | boolean | `false` | `true`, `false` |

**Example Usage**:

```typescript
// ff.config.ts
export default defineConfig({
  generators: {
    component: {
      style: 'tailwind',
      test: true,
      story: true,  // Always generate Storybook stories
    },
  },
});
```

```bash
# Component inherits config defaults
ff g c Button
# Generates: Button.tsx, Button.test.tsx, Button.stories.tsx

# Override style for specific component
ff g c Card --style=css-modules
# Generates: Card.tsx, Card.module.css, Card.test.tsx, Card.stories.tsx
```

---

### Hook Generator

```typescript
{
  generators: {
    hook: {
      typescript: true,
      test: true,
    }
  }
}
```

**All Options**:

| Option | Type | Default |
|--------|------|---------|
| `typescript` | boolean | `true` |
| `test` | boolean | `true` |

---

### Page Generator (Next.js)

```typescript
{
  generators: {
    page: {
      style: 'css-modules',
      typescript: true,
      test: true,
    }
  }
}
```

**All Options**:

| Option | Type | Default | Values |
|--------|------|---------|--------|
| `style` | string | `'css-modules'` | `'css'`, `'scss'`, `'tailwind'`, `'css-modules'` |
| `typescript` | boolean | `true` | `true`, `false` |
| `test` | boolean | `true` | `true`, `false` |

**Note**: `styled` is not supported for pages.

---

### Element Generator (Lit)

```typescript
{
  generators: {
    element: {
      typescript: true,
      test: true,
    }
  }
}
```

**All Options**:

| Option | Type | Default |
|--------|------|---------|
| `typescript` | boolean | `true` |
| `test` | boolean | `true` |

---

## Task Configuration

Define custom commands for common development tasks.

### Schema

```typescript
{
  tasks: {
    lint?: string;
    test?: string;
    format?: string;
  }
}
```

### Examples

**Basic Configuration**:
```typescript
export default defineConfig({
  tasks: {
    lint: 'eslint src',
    test: 'vitest',
    format: 'prettier --write "src/**/*.ts"',
  },
});
```

**Advanced Configuration**:
```typescript
export default defineConfig({
  tasks: {
    lint: 'eslint src --ext .ts,.tsx --max-warnings 0',
    test: 'vitest run --coverage',
    format: 'prettier --write "src/**/*.{ts,tsx,css,md}"',
  },
});
```

**Framework-Specific Tasks**:
```typescript
// Next.js project
export default defineConfig({
  framework: 'next',
  tasks: {
    lint: 'next lint',
    test: 'jest',
    format: 'prettier --write "**/*.{js,jsx,ts,tsx}"',
  },
});
```

### Running Tasks

```bash
# Run configured lint command
ff lint

# Run configured test command
ff test

# Run configured format command
ff format
```

---

## Template Overrides

Override default templates with custom ones.

### Schema

```typescript
{
  templates: {
    component?: string;  // Path to custom component template directory
    hook?: string;
    page?: string;
    element?: string;
  }
}
```

### Example

```typescript
export default defineConfig({
  templates: {
    component: './templates/my-component',
    hook: './templates/my-hook',
  },
});
```

**Directory Structure**:
```
project/
├── templates/
│   ├── my-component/
│   │   ├── component.tsx.hbs
│   │   ├── component.module.css.hbs
│   │   └── component.test.tsx.hbs
│   └── my-hook/
│       └── hook.ts.hbs
└── ff.config.ts
```

**Usage**:
```bash
ff g c Button
# Uses ./templates/my-component/ instead of default templates
```

---

## Hooks Configuration

**Status**: Planned for Phase 2+

Lifecycle hooks for custom logic before/after operations.

### Planned Schema

```typescript
{
  hooks: {
    beforeGenerate?: string;   // Script to run before generation
    afterGenerate?: string;    // Script to run after generation
    beforeInit?: string;
    afterInit?: string;
  }
}
```

### Planned Example

```typescript
export default defineConfig({
  hooks: {
    afterGenerate: 'npm run lint:fix',  // Auto-format generated files
  },
});
```

---

## Framework-Specific Defaults

ffontana-cli provides sensible defaults based on detected framework.

### React Defaults

```typescript
{
  framework: 'react',
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
  },
}
```

**Typical React Project Config**:
```typescript
export default defineConfig({
  framework: 'react',
  generators: {
    component: {
      style: 'css-modules',  // or 'tailwind' for Tailwind projects
      test: true,
      story: true,           // Enable if using Storybook
    },
  },
  tasks: {
    lint: 'eslint src --ext .ts,.tsx',
    test: 'vitest',
    format: 'prettier --write "src/**/*.{ts,tsx}"',
  },
});
```

---

### Next.js Defaults

```typescript
{
  framework: 'next',
  generators: {
    component: {
      style: 'css-modules',
      typescript: true,
      test: true,
      story: false,
    },
    page: {
      style: 'css-modules',
      typescript: true,
      test: true,
    },
  },
}
```

**Typical Next.js Project Config**:
```typescript
export default defineConfig({
  framework: 'next',
  generators: {
    component: {
      style: 'tailwind',     // Next.js often uses Tailwind
      test: true,
    },
    page: {
      style: 'tailwind',
      test: true,
    },
  },
  tasks: {
    lint: 'next lint',
    test: 'jest',
    format: 'prettier --write "**/*.{ts,tsx}"',
  },
});
```

---

### Lit Defaults

```typescript
{
  framework: 'lit',
  generators: {
    element: {
      typescript: true,
      test: true,
    },
  },
}
```

**Typical Lit Project Config**:
```typescript
export default defineConfig({
  framework: 'lit',
  generators: {
    element: {
      typescript: true,
      test: true,
    },
  },
  tasks: {
    lint: 'eslint src --ext .ts',
    test: 'web-test-runner',
    format: 'prettier --write "src/**/*.ts"',
  },
});
```

---

## Configuration Recipes

### Recipe 1: Tailwind + Storybook Team Standard

**Use Case**: Enforce Tailwind CSS and Storybook stories across team

```typescript
// ff.config.ts
import { defineConfig } from 'ffontana-cli';

export default defineConfig({
  framework: 'react',
  generators: {
    component: {
      style: 'tailwind',
      typescript: true,
      test: true,
      story: true,  // Always generate stories
    },
  },
  tasks: {
    lint: 'eslint src --ext .ts,.tsx --max-warnings 0',
    test: 'vitest run',
    format: 'prettier --write "src/**/*.{ts,tsx}"',
  },
});
```

**Usage**:
```bash
ff g c Button
# Always generates: Button.tsx, Button.test.tsx, Button.stories.tsx
# Always uses Tailwind (no separate style file)
```

---

### Recipe 2: JavaScript-First Project

**Use Case**: Team prefers JavaScript over TypeScript

```typescript
// ff.config.ts
export default {
  framework: 'react',
  generators: {
    component: {
      typescript: false,
      style: 'css-modules',
      test: true,
    },
    hook: {
      typescript: false,
      test: true,
    },
  },
};
```

**Usage**:
```bash
ff g c Button
# Generates: Button.jsx, Button.module.css, Button.test.jsx
```

---

### Recipe 3: Monorepo with Workspace Config

**Use Case**: Multiple packages with shared defaults

**Workspace config** (`.ff/config.json`):
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
      story: true,  // Enable stories for design system
    },
  },
});
```

**Result**:
- `packages/app/`: Uses workspace config (no stories)
- `packages/design-system/`: Overrides with stories enabled

---

### Recipe 4: Global Personal Preferences

**Use Case**: Set personal defaults across all projects

**Global config** (`~/.config/ff-cli/config.json`):
```json
{
  "generators": {
    "component": {
      "style": "css-modules",
      "test": true,
      "story": true
    },
    "hook": {
      "test": true
    }
  }
}
```

**Result**: All projects inherit these defaults unless overridden.

---

### Recipe 5: Next.js App with Custom Directories

**Use Case**: Custom directory structure

```typescript
// ff.config.ts
export default defineConfig({
  framework: 'next',
  generators: {
    component: {
      style: 'tailwind',
      test: true,
    },
    page: {
      style: 'tailwind',
      test: true,
    },
  },
});
```

**Usage with custom directories**:
```bash
# Components in custom directory
ff g c Button --out-dir src/ui/components

# Pages in App Router
ff g p dashboard --out-dir app/dashboard
```

---

### Recipe 6: CSS-in-JS with Styled Components

**Use Case**: Use Styled Components instead of CSS files

```typescript
// ff.config.ts
export default defineConfig({
  framework: 'react',
  generators: {
    component: {
      style: 'styled',
      typescript: true,
      test: true,
    },
  },
});
```

**Result**:
```bash
ff g c Button
# Generates only: Button.tsx, Button.test.tsx
# No separate CSS file
```

---

## Migration Guide

### Migrating from Default Config

**Before** (using CLI flags):
```bash
ff g c Button --style=tailwind --test --story
ff g c Card --style=tailwind --test --story
ff g c Modal --style=tailwind --test --story
```

**After** (using config):
```typescript
// ff.config.ts
export default defineConfig({
  generators: {
    component: {
      style: 'tailwind',
      test: true,
      story: true,
    },
  },
});
```

```bash
# Much simpler!
ff g c Button
ff g c Card
ff g c Modal
```

---

### Migrating from JSON to TypeScript Config

**Before** (`ff.config.json`):
```json
{
  "framework": "react",
  "generators": {
    "component": {
      "style": "css-modules",
      "test": true
    }
  }
}
```

**After** (`ff.config.ts`):
```typescript
import { defineConfig } from 'ffontana-cli';

export default defineConfig({
  framework: 'react',
  generators: {
    component: {
      style: 'css-modules',
      test: true,
    },
  },
});
```

**Benefits**:
- Type safety
- Autocomplete in IDE
- Dynamic logic support

---

## Viewing Current Configuration

### List All Configuration

```bash
ff config list
```

**Output**:
```
Configuration from: project
Source: /path/to/project/ff.config.ts

{
  framework: 'react',
  generators: {
    component: {
      style: 'css-modules',
      typescript: true,
      test: true,
      story: false
    }
  },
  tasks: {
    lint: 'eslint src',
    test: 'vitest'
  }
}
```

---

### Get Specific Value

```bash
ff config get generators.component.style
# Output: css-modules

ff config get framework
# Output: react
```

---

## Best Practices

### 1. Use Project Config for Project Standards

```typescript
// ff.config.ts in project root
export default defineConfig({
  generators: {
    component: {
      style: 'tailwind',  // Project uses Tailwind
      test: true,         // Always generate tests
    },
  },
});
```

### 2. Use Global Config for Personal Preferences

```json
// ~/.config/ff-cli/config.json
{
  "generators": {
    "component": {
      "story": true  // You personally always want stories
    }
  }
}
```

### 3. Use Workspace Config for Monorepo Shared Defaults

```json
// .ff/config.json
{
  "generators": {
    "component": {
      "test": true,
      "typescript": true
    }
  }
}
```

### 4. Document Project Config

```typescript
// ff.config.ts
import { defineConfig } from 'ffontana-cli';

/**
 * ffontana-cli configuration
 *
 * This project uses:
 * - Tailwind CSS for styling
 * - Vitest for testing
 * - Storybook for component documentation
 */
export default defineConfig({
  framework: 'react',
  generators: {
    component: {
      style: 'tailwind',
      test: true,
      story: true,
    },
  },
  tasks: {
    lint: 'eslint src --ext .ts,.tsx',
    test: 'vitest',
    format: 'prettier --write "src/**/*.{ts,tsx}"',
  },
});
```

---

For more information:
- [Command Reference](./COMMANDS.md)
- [Template System](./TEMPLATES.md)
- [API Reference](./API_REFERENCE.md)
- [Architecture Documentation](./ARCHITECTURE.md)
