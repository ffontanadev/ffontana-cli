# Template System Documentation

> Complete guide to understanding, using, and creating templates in ffontana-cli

## Table of Contents

- [Overview](#overview)
- [Template Structure](#template-structure)
- [Handlebars Syntax](#handlebars-syntax)
- [Custom Helpers](#custom-helpers)
- [Template Variables](#template-variables)
- [Built-in Templates](#built-in-templates)
- [Creating Custom Templates](#creating-custom-templates)
- [Template Overrides](#template-overrides)
- [Best Practices](#best-practices)
- [Advanced Examples](#advanced-examples)

---

## Overview

ffontana-cli uses **Handlebars** as its template engine to generate code files. Templates are simple text files with `.hbs` extension that contain placeholders and logic.

### Why Handlebars?

- **Simple syntax**: Easy to learn and read
- **Logic-less**: Templates stay clean and maintainable
- **Extensible**: Custom helpers for common transformations
- **Powerful**: Conditional logic, loops, and partials support

### Template Flow

```
Template File (.hbs)
       │
       ▼
  Load Content
       │
       ▼
  Compile (Handlebars.compile)
       │
       ▼
  Apply Data (name, style, etc.)
       │
       ▼
  Transform with Helpers (pascalCase, kebabCase, etc.)
       │
       ▼
  Render Output
       │
       ▼
  Write to File
```

---

## Template Structure

### Basic Template Anatomy

```handlebars
{{!-- Comment: This is a simple template --}}

{{!-- Variable substitution --}}
export const {{pascalCase name}} = {
  id: '{{kebabCase name}}',
  label: '{{name}}'
};

{{!-- Conditional logic --}}
{{#if typescript}}
interface {{pascalCase name}}Props {
  title: string;
}
{{/if}}

{{!-- Comparison helpers --}}
{{#if (eq style 'css-modules')}}
import styles from './{{name}}.module.css';
{{/if}}
```

### Template File Naming

Templates use the `.hbs` extension:

```
component.tsx.hbs       → Generates .tsx file
component.jsx.hbs       → Generates .jsx file
component.test.tsx.hbs  → Generates .test.tsx file
hook.ts.hbs            → Generates .ts file
page.tsx.hbs           → Generates .tsx file
```

---

## Handlebars Syntax

### 1. Variables

Simple variable substitution using double curly braces:

```handlebars
{{name}}
{{version}}
{{description}}
```

**Example**:
```handlebars
// Template
export const {{name}}Version = '{{version}}';

// Data
{ name: 'App', version: '1.0.0' }

// Output
export const AppVersion = '1.0.0';
```

---

### 2. Conditionals

#### If/Else

```handlebars
{{#if typescript}}
  TypeScript code here
{{else}}
  JavaScript code here
{{/if}}
```

**Example**:
```handlebars
{{#if typescript}}
interface Props {
  title: string;
}
{{else}}
// No type definitions needed
{{/if}}
```

---

#### If/Else If/Else

```handlebars
{{#if (eq style 'css-modules')}}
  import styles from './{{name}}.module.css';
{{else if (eq style 'styled')}}
  import styled from 'styled-components';
{{else if (eq style 'tailwind')}}
  // Tailwind uses utility classes
{{else}}
  import './{{name}}.css';
{{/if}}
```

---

### 3. Comments

```handlebars
{{!-- This is a comment, not rendered in output --}}

{{! Single-line comment }}
```

---

### 4. Escaping

```handlebars
{{name}}          {{!-- HTML-escaped (default) --}}
{{{rawName}}}     {{!-- Unescaped (use carefully) --}}
```

---

## Custom Helpers

ffontana-cli provides custom Handlebars helpers for common string transformations.

### String Case Helpers

#### `pascalCase`

Convert to PascalCase (first letter uppercase).

```handlebars
{{pascalCase name}}
```

**Examples**:
| Input | Output |
|-------|--------|
| `userCard` | `UserCard` |
| `my-component` | `My-component` |
| `button` | `Button` |

**Usage**:
```handlebars
export function {{pascalCase name}}() {
  // ...
}
```

---

#### `camelCase`

Convert to camelCase (first letter lowercase).

```handlebars
{{camelCase name}}
```

**Examples**:
| Input | Output |
|-------|--------|
| `UserCard` | `userCard` |
| `Button` | `button` |
| `MyComponent` | `myComponent` |

**Usage**:
```handlebars
export function {{camelCase name}}() {
  const [state, setState] = useState();
  // ...
}
```

---

#### `kebabCase`

Convert to kebab-case (lowercase with hyphens).

```handlebars
{{kebabCase name}}
```

**Examples**:
| Input | Output |
|-------|--------|
| `UserCard` | `user-card` |
| `MyComponent` | `my-component` |
| `Button Group` | `button-group` |

**Usage**:
```handlebars
<div className="{{kebabCase name}}-container">
  {{!-- ... --}}
</div>
```

---

#### `snakeCase`

Convert to snake_case (lowercase with underscores).

```handlebars
{{snakeCase name}}
```

**Examples**:
| Input | Output |
|-------|--------|
| `UserCard` | `user_card` |
| `MyComponent` | `my_component` |
| `Button Group` | `button_group` |

**Usage**:
```handlebars
describe('{{snakeCase name}}', () => {
  it('should render correctly', () => {
    // ...
  });
});
```

---

### Comparison Helpers

#### `eq` (equals)

Check if two values are equal.

```handlebars
{{#if (eq a b)}}
  They are equal
{{/if}}
```

**Example**:
```handlebars
{{#if (eq style 'css-modules')}}
import styles from './{{name}}.module.css';
{{/if}}

{{#if (eq framework 'next')}}
'use client';
{{/if}}
```

---

#### `ne` (not equals)

Check if two values are not equal.

```handlebars
{{#if (ne style 'styled')}}
  {{!-- Generate style file for non-styled components --}}
{{/if}}
```

---

#### `gt` (greater than)

Compare numbers.

```handlebars
{{#if (gt count 0)}}
  Has items
{{/if}}
```

---

#### `lt` (less than)

Compare numbers.

```handlebars
{{#if (lt index 10)}}
  Single digit
{{/if}}
```

---

## Template Variables

### Component Template Variables

```typescript
interface ComponentTemplateData {
  name: string;           // Component name (e.g., "Button")
  typescript: boolean;    // Use TypeScript?
  style: StyleFormat;     // 'css' | 'scss' | 'styled' | 'tailwind' | 'css-modules'
}
```

**Example Data**:
```typescript
{
  name: "UserCard",
  typescript: true,
  style: "css-modules"
}
```

---

### Hook Template Variables

```typescript
interface HookTemplateData {
  name: string;        // Hook name (e.g., "Counter" for "useCounter")
  typescript: boolean;
}
```

**Example Data**:
```typescript
{
  name: "Counter",      // Becomes "useCounter"
  typescript: true
}
```

---

### Page Template Variables

```typescript
interface PageTemplateData {
  name: string;        // Page name
  typescript: boolean;
  style: StyleFormat;
  dynamic: boolean;    // Is dynamic route?
}
```

**Example Data**:
```typescript
{
  name: "product",
  typescript: true,
  style: "tailwind",
  dynamic: true
}
```

---

## Built-in Templates

### React Component Template

**Location**: `templates/components/react/component.tsx.hbs`

```handlebars
{{#if (eq style 'styled')}}
import styled from 'styled-components';
{{else if (eq style 'css-modules')}}
import styles from './{{name}}.module.css';
{{else if (eq style 'css')}}
import './{{name}}.css';
{{else if (eq style 'scss')}}
import './{{name}}.scss';
{{/if}}

{{#if typescript}}
interface {{name}}Props {
  children?: React.ReactNode;
}
{{/if}}

{{#if (eq style 'styled')}}
const StyledContainer = styled.div`
  padding: 1rem;
`;

{{/if}}
{{#if typescript}}
export function {{name}}({ children }: {{name}}Props) {
{{else}}
export function {{name}}({ children }) {
{{/if}}
  return (
{{#if (eq style 'styled')}}
    <StyledContainer>
{{else if (eq style 'css-modules')}}
    <div className={styles.container}>
{{else if (eq style 'tailwind')}}
    <div className="p-4">
{{else}}
    <div className="{{kebabCase name}}-container">
{{/if}}
      <h2>{{name}} Component</h2>
      {children}
{{#if (eq style 'styled')}}
    </StyledContainer>
{{else}}
    </div>
{{/if}}
  );
}

export default {{name}};
```

**Generated Output** (name: "Button", style: "css-modules", typescript: true):
```tsx
import styles from './Button.module.css';

interface ButtonProps {
  children?: React.ReactNode;
}

export function Button({ children }: ButtonProps) {
  return (
    <div className={styles.container}>
      <h2>Button Component</h2>
      {children}
    </div>
  );
}

export default Button;
```

---

### React Hook Template

**Location**: `templates/hooks/react/hook.ts.hbs`

```handlebars
import { useState, useEffect } from 'react';

{{#if typescript}}
interface {{name}}Options {
  initialValue?: unknown;
}

interface {{name}}Return {
  value: unknown;
  setValue: (value: unknown) => void;
  reset: () => void;
}
{{/if}}

{{#if typescript}}
export function {{camelCase name}}(options: {{name}}Options = {}): {{name}}Return {
{{else}}
export function {{camelCase name}}(options = {}) {
{{/if}}
  const { initialValue } = options;
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    // Add your effect logic here
    console.log('{{name}} mounted');

    return () => {
      // Cleanup logic
      console.log('{{name}} unmounted');
    };
  }, []);

  const reset = () => {
    setValue(initialValue);
  };

  return {
    value,
    setValue,
    reset,
  };
}

export default {{camelCase name}};
```

**Generated Output** (name: "Counter", typescript: true):
```typescript
import { useState, useEffect } from 'react';

interface CounterOptions {
  initialValue?: unknown;
}

interface CounterReturn {
  value: unknown;
  setValue: (value: unknown) => void;
  reset: () => void;
}

export function useCounter(options: CounterOptions = {}): CounterReturn {
  const { initialValue } = options;
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    // Add your effect logic here
    console.log('Counter mounted');

    return () => {
      // Cleanup logic
      console.log('Counter unmounted');
    };
  }, []);

  const reset = () => {
    setValue(initialValue);
  };

  return {
    value,
    setValue,
    reset,
  };
}

export default useCounter;
```

---

### Component Test Template

**Location**: `templates/components/react/component.test.tsx.hbs`

```handlebars
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { {{name}} } from './{{name}}';

describe('{{name}}', () => {
  it('should render correctly', () => {
    render(<{{name}}>Test Content</{{name}}>);
    expect(screen.getByText('{{name}} Component')).toBeInTheDocument();
  });
});
```

---

## Creating Custom Templates

### Step 1: Create Template Directory

```bash
mkdir -p templates/my-component
```

### Step 2: Create Template File

**templates/my-component/component.tsx.hbs**:
```handlebars
import React from 'react';
{{#if (eq style 'css-modules')}}
import styles from './{{name}}.module.css';
{{/if}}

{{#if typescript}}
export interface {{pascalCase name}}Props {
  title: string;
  description?: string;
  onAction?: () => void;
}
{{/if}}

{{#if typescript}}
export const {{pascalCase name}}: React.FC<{{pascalCase name}}Props> = ({
{{else}}
export const {{pascalCase name}} = ({
{{/if}}
  title,
  description,
  onAction
{{#if typescript}}
}) => {
{{else}}
}) => {
{{/if}}
  return (
{{#if (eq style 'css-modules')}}
    <div className={styles.wrapper}>
      <h1 className={styles.title}>{title}</h1>
{{else if (eq style 'tailwind')}}
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold">{title}</h1>
{{else}}
    <div className="{{kebabCase name}}-wrapper">
      <h1>{title}</h1>
{{/if}}
      {description && <p>{description}</p>}
      {onAction && (
        <button onClick={onAction}>Action</button>
      )}
    </div>
  );
};

export default {{pascalCase name}};
```

### Step 3: Configure Template Override

**ff.config.ts**:
```typescript
import { defineConfig } from 'ffontana-cli';

export default defineConfig({
  templates: {
    component: './templates/my-component',
  },
});
```

### Step 4: Use Custom Template

```bash
ff g c MyFeature
# Uses ./templates/my-component/component.tsx.hbs
```

---

## Template Overrides

### Override Structure

```
project/
├── templates/
│   └── my-component/
│       ├── component.tsx.hbs
│       ├── component.test.tsx.hbs
│       ├── component.module.css.hbs
│       └── component.stories.tsx.hbs
├── ff.config.ts
└── ...
```

### Configuration

```typescript
// ff.config.ts
export default defineConfig({
  templates: {
    component: './templates/my-component',
    hook: './templates/my-hook',
    page: './templates/my-page',
  },
});
```

### Template Resolution

When generating, the CLI looks for templates in this order:

1. **Custom template path** (if configured in `templates.component`)
2. **Built-in templates** (`node_modules/ffontana-cli/templates/`)

---

## Best Practices

### 1. Keep Templates Simple

```handlebars
{{!-- ✅ Good: Simple and readable --}}
{{#if typescript}}
interface Props {
  title: string;
}
{{/if}}

{{!-- ❌ Bad: Too much logic --}}
{{#if (and typescript (or (eq style 'css') (eq style 'scss')))}}
  {{!-- Complex nested logic --}}
{{/if}}
```

---

### 2. Use Helpers for Transformations

```handlebars
{{!-- ✅ Good: Use helpers --}}
export const {{pascalCase name}} = {};

{{!-- ❌ Bad: Manual case handling --}}
export const {{name}} = {};  {{!-- Might not be PascalCase --}}
```

---

### 3. Add Comments for Clarity

```handlebars
{{!-- Import statements based on style format --}}
{{#if (eq style 'css-modules')}}
import styles from './{{name}}.module.css';
{{else if (eq style 'styled')}}
import styled from 'styled-components';
{{/if}}

{{!-- Component definition --}}
export function {{name}}() {
  // ...
}
```

---

### 4. Provide Sensible Defaults

```handlebars
{{!-- Default children prop for flexibility --}}
{{#if typescript}}
interface {{name}}Props {
  children?: React.ReactNode;
  className?: string;
}
{{/if}}
```

---

### 5. Test Templates

Create test script to verify template output:

```bash
# test-template.sh
ff g c TestButton --style=css-modules --debug
ff g c TestCard --style=tailwind --debug
ff g c TestModal --style=styled --debug

# Check generated files
cat src/components/TestButton/TestButton.tsx
```

---

## Advanced Examples

### Example 1: Conditional Imports

```handlebars
{{!-- Only import what's needed --}}
{{#if (eq style 'styled')}}
import styled from 'styled-components';
{{/if}}

{{#if typescript}}
import type { FC } from 'react';
{{/if}}

{{#if (ne style 'styled')}}
{{#if (ne style 'tailwind')}}
import './{{name}}{{#if (eq style 'css-modules')}}.module{{/if}}.{{#if (eq style 'scss')}}scss{{else}}css{{/if}}';
{{/if}}
{{/if}}
```

---

### Example 2: Dynamic Prop Types

```handlebars
{{#if typescript}}
interface {{name}}Props {
  {{!-- Common props --}}
  children?: React.ReactNode;
  className?: string;

  {{!-- Conditional props based on features --}}
  {{#if hasAction}}
  onAction: () => void;
  actionLabel?: string;
  {{/if}}

  {{#if hasData}}
  data: unknown[];
  onDataChange?: (data: unknown[]) => void;
  {{/if}}
}
{{/if}}
```

---

### Example 3: Framework-Specific Templates

```handlebars
{{!-- Next.js specific directives --}}
{{#if (eq framework 'next')}}
'use client';

{{/if}}
import React from 'react';

{{!-- Next.js Image component --}}
{{#if (eq framework 'next')}}
import Image from 'next/image';
{{/if}}
```

---

### Example 4: Interactive Form Component

```handlebars
import React, { useState } from 'react';
{{#if (eq style 'css-modules')}}
import styles from './{{name}}.module.css';
{{/if}}

{{#if typescript}}
interface {{name}}Props {
  onSubmit: (data: FormData) => void;
  fields: string[];
}

interface FormData {
  [key: string]: string;
}
{{/if}}

{{#if typescript}}
export function {{name}}({ onSubmit, fields }: {{name}}Props) {
{{else}}
export function {{name}}({ onSubmit, fields }) {
{{/if}}
  const [formData, setFormData] = useState{{#if typescript}}<FormData>{{/if}}({});

  const handleSubmit = (e{{#if typescript}}: React.FormEvent{{/if}}) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field{{#if typescript}}: string{{/if}}, value{{#if typescript}}: string{{/if}}) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
{{#if (eq style 'css-modules')}}
    <form className={styles.form} onSubmit={handleSubmit}>
{{else if (eq style 'tailwind')}}
    <form className="space-y-4" onSubmit={handleSubmit}>
{{else}}
    <form onSubmit={handleSubmit}>
{{/if}}
      {fields.map(field => (
        <input
          key={field}
          type="text"
          placeholder={field}
          onChange={(e) => handleChange(field, e.target.value)}
        />
      ))}
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

### Example 5: Data Fetching Hook Template

```handlebars
import { useState, useEffect } from 'react';

{{#if typescript}}
interface {{name}}Options<T> {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
}

interface {{name}}Return<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}
{{/if}}

{{#if typescript}}
export function {{camelCase name}}<T = unknown>(
  options: {{name}}Options<T>
): {{name}}Return<T> {
{{else}}
export function {{camelCase name}}(options) {
{{/if}}
  const { url, method = 'GET', body } = options;

  const [data, setData] = useState{{#if typescript}}<T | null>{{/if}}(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState{{#if typescript}}<Error | null>{{/if}}(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err {{#if typescript}}as Error{{/if}});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
```

---

## Testing Templates

### Manual Testing

```bash
# Test different variations
ff g c TestComponent --style=css-modules
ff g c TestComponent --style=tailwind
ff g c TestComponent --style=styled

# Inspect generated files
cat src/components/TestComponent/TestComponent.tsx
```

### Automated Testing

```typescript
// scripts/test-templates.ts
import { renderTemplateString } from 'ffontana-cli/core';

const template = '{{pascalCase name}}';
const result = renderTemplateString(template, { name: 'userCard' });

console.assert(result === 'UserCard', 'pascalCase helper failed');
```

---

For more information:
- [Configuration Guide](./CONFIGURATION.md)
- [API Reference](./API_REFERENCE.md)
- [Development Guide](./DEVELOPMENT.md)
- [Command Reference](./COMMANDS.md)
