import path from 'path';
import type { ProjectInfo } from '../types/index.js';
import { fileExists, readJSON, getProjectRoot } from '../utils/index.js';

/**
 * Detect project information from the current directory
 */
export async function detectProject(cwd: string = process.cwd()): Promise<ProjectInfo> {
  const projectRoot = await getProjectRoot(cwd);

  if (!projectRoot) {
    throw new Error('No package.json found. Are you in a project directory?');
  }

  const packageJsonPath = path.join(projectRoot, 'package.json');
  const packageJson = await readJSON<{
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  }>(packageJsonPath);

  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  // Detect framework (order matters: Next.js before React, as Next.js uses React)
  let framework: ProjectInfo['framework'] = 'unknown';
  let version: string | undefined;

  if (allDeps['next']) {
    framework = 'next';
    version = allDeps['next'];
  } else if (allDeps['lit']) {
    framework = 'lit';
    version = allDeps['lit'];
  } else if (allDeps['react']) {
    framework = 'react';
    version = allDeps['react'];
  }

  // Detect TypeScript
  const typescript =
    (await fileExists(path.join(projectRoot, 'tsconfig.json'))) || Boolean(allDeps['typescript']);

  // Detect package manager
  const { detectPackageManager } = await import('../utils/package-manager.js');
  const packageManager = await detectPackageManager(projectRoot);

  return {
    framework,
    version,
    packageManager,
    typescript,
    packageJsonPath,
    rootDir: projectRoot,
  };
}

/**
 * Check if the current directory is a specific framework
 */
export async function isFramework(
  framework: 'react' | 'next' | 'lit',
  cwd: string = process.cwd()
): Promise<boolean> {
  try {
    const project = await detectProject(cwd);
    return project.framework === framework;
  } catch {
    return false;
  }
}

/**
 * Ensure we're in a valid project
 */
export async function ensureProject(cwd: string = process.cwd()): Promise<ProjectInfo> {
  try {
    return await detectProject(cwd);
  } catch (error) {
    throw new Error(
      'Not in a project directory. Please run this command from a project root or use "ff init" to create a new project.'
    );
  }
}
