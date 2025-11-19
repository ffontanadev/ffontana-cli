import prompts from 'prompts';
import path from 'path';
import os from 'os';
import fs from 'fs-extra';
import type { Framework, StyleFormat } from '../types/index.js';
import { dirExists } from './file-system.js';
import { loadConfig } from '../core/config-loader.js';

/**
 * Get user templates if they exist
 */
async function getUserTemplates(): Promise<Array<{ title: string; value: string }>> {
  try {
    const config = await loadConfig();
    const defaultDir = path.join(os.homedir(), '.config', 'ff-cli', 'user-templates');
    const userTemplatesDir = config.userTemplatesDir ?? defaultDir;

    if (!(await dirExists(userTemplatesDir))) {
      return [];
    }

    const entries = await fs.readdir(userTemplatesDir, { withFileTypes: true });
    const directories = entries.filter((entry) => entry.isDirectory());

    return directories.map((dir) => ({
      title: `${dir.name} (custom)`,
      value: `user:${dir.name}`,
    }));
  } catch {
    return [];
  }
}

/**
 * Prompt for project template selection
 */
export async function promptTemplate(): Promise<string> {
  // Get built-in templates
  const builtInTemplates = [
    { title: 'React + Vite (TypeScript)', value: 'react-ts' },
    { title: 'Next.js (App Router)', value: 'nextjs-app' },
    { title: 'Lit (Web Components)', value: 'lit-component' },
  ];

  // Get user templates
  const userTemplates = await getUserTemplates();

  // Combine templates
  const allTemplates = [...builtInTemplates, ...userTemplates];

  const response = await prompts({
    type: 'select',
    name: 'template',
    message: 'Select a project template:',
    choices: allTemplates,
  });

  return response.template as string;
}

/**
 * Prompt for component name
 */
export async function promptComponentName(): Promise<string> {
  const response = await prompts({
    type: 'text',
    name: 'name',
    message: 'Component name:',
    validate: (value) => {
      if (!value) return 'Component name is required';
      if (!/^[A-Z]/.test(value)) return 'Component name must start with an uppercase letter';
      if (!/^[A-Za-z0-9]+$/.test(value)) return 'Component name must be alphanumeric';
      return true;
    },
  });

  return response.name as string;
}

/**
 * Prompt for component generation options
 */
export async function promptComponentOptions() {
  const response = await prompts([
    {
      type: 'select',
      name: 'style',
      message: 'Style format:',
      choices: [
        { title: 'CSS Modules', value: 'css-modules' },
        { title: 'Styled Components', value: 'styled' },
        { title: 'Tailwind CSS', value: 'tailwind' },
        { title: 'SCSS', value: 'scss' },
        { title: 'Plain CSS', value: 'css' },
      ],
      initial: 0,
    },
    {
      type: 'toggle',
      name: 'test',
      message: 'Generate test file?',
      initial: true,
      active: 'yes',
      inactive: 'no',
    },
    {
      type: 'toggle',
      name: 'story',
      message: 'Generate Storybook story?',
      initial: false,
      active: 'yes',
      inactive: 'no',
    },
  ]);

  return {
    style: response.style as StyleFormat,
    test: response.test as boolean,
    story: response.story as boolean,
  };
}

/**
 * Prompt for project name
 */
export async function promptProjectName(): Promise<string> {
  const response = await prompts({
    type: 'text',
    name: 'name',
    message: 'Project name:',
    validate: (value) => {
      if (!value) return 'Project name is required';
      if (!/^[a-z0-9-]+$/.test(value))
        return 'Project name must be lowercase alphanumeric with hyphens';
      return true;
    },
  });

  return response.name as string;
}

/**
 * Prompt for package manager selection
 */
export async function promptPackageManager(): Promise<'npm' | 'pnpm' | 'yarn' | 'bun'> {
  const response = await prompts({
    type: 'select',
    name: 'packageManager',
    message: 'Select package manager:',
    choices: [
      { title: 'npm', value: 'npm' },
      { title: 'pnpm', value: 'pnpm' },
      { title: 'yarn', value: 'yarn' },
      { title: 'bun', value: 'bun' },
    ],
  });

  return response.packageManager as 'npm' | 'pnpm' | 'yarn' | 'bun';
}

/**
 * Prompt for confirmation
 */
export async function promptConfirm(message: string, initial = true): Promise<boolean> {
  const response = await prompts({
    type: 'confirm',
    name: 'confirmed',
    message,
    initial,
  });

  return response.confirmed as boolean;
}

/**
 * Prompt for file overwrite confirmation
 */
export async function promptOverwrite(filePath: string): Promise<boolean> {
  return promptConfirm(`File ${filePath} already exists. Overwrite?`, false);
}
