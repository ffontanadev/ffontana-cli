import { execa } from 'execa';
import { fileExists } from './file-system.js';
import path from 'path';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

/**
 * Detect the package manager used in a project
 */
export async function detectPackageManager(cwd: string): Promise<PackageManager> {
  // Check for lock files
  if (await fileExists(path.join(cwd, 'bun.lockb'))) {
    return 'bun';
  }

  if (await fileExists(path.join(cwd, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }

  if (await fileExists(path.join(cwd, 'yarn.lock'))) {
    return 'yarn';
  }

  if (await fileExists(path.join(cwd, 'package-lock.json'))) {
    return 'npm';
  }

  // Default to npm
  return 'npm';
}

/**
 * Get the install command for a package manager
 */
export function getInstallCommand(packageManager: PackageManager): string {
  switch (packageManager) {
    case 'npm':
      return 'npm install';
    case 'pnpm':
      return 'pnpm install';
    case 'yarn':
      return 'yarn';
    case 'bun':
      return 'bun install';
  }
}

/**
 * Get the add package command for a package manager
 */
export function getAddCommand(packageManager: PackageManager, packages: string[]): string {
  const pkgs = packages.join(' ');

  switch (packageManager) {
    case 'npm':
      return `npm install ${pkgs}`;
    case 'pnpm':
      return `pnpm add ${pkgs}`;
    case 'yarn':
      return `yarn add ${pkgs}`;
    case 'bun':
      return `bun add ${pkgs}`;
  }
}

/**
 * Get the run script command for a package manager
 */
export function getRunCommand(packageManager: PackageManager, script: string): string {
  switch (packageManager) {
    case 'npm':
      return `npm run ${script}`;
    case 'pnpm':
      return `pnpm ${script}`;
    case 'yarn':
      return `yarn ${script}`;
    case 'bun':
      return `bun run ${script}`;
  }
}

/**
 * Install dependencies using the specified package manager
 */
export async function installDependencies(
  cwd: string,
  packageManager: PackageManager
): Promise<void> {
  const commands: Record<PackageManager, [string, string[]]> = {
    npm: ['npm', ['install']],
    pnpm: ['pnpm', ['install']],
    yarn: ['yarn', []],
    bun: ['bun', ['install']],
  };

  const [command, args] = commands[packageManager];

  await execa(command, args, {
    cwd,
    stdio: 'inherit',
  });
}

/**
 * Add packages using the specified package manager
 */
export async function addPackages(
  cwd: string,
  packageManager: PackageManager,
  packages: string[],
  dev = false
): Promise<void> {
  const commands: Record<PackageManager, [string, string[]]> = {
    npm: ['npm', ['install', dev ? '--save-dev' : '--save', ...packages]],
    pnpm: ['pnpm', ['add', dev ? '-D' : '', ...packages].filter(Boolean)],
    yarn: ['yarn', ['add', dev ? '-D' : '', ...packages].filter(Boolean)],
    bun: ['bun', ['add', dev ? '-d' : '', ...packages].filter(Boolean)],
  };

  const [command, args] = commands[packageManager];

  await execa(command, args, {
    cwd,
    stdio: 'inherit',
  });
}

/**
 * Run a package.json script using the specified package manager
 */
export async function runScript(
  cwd: string,
  packageManager: PackageManager,
  script: string
): Promise<void> {
  const commands: Record<PackageManager, [string, string[]]> = {
    npm: ['npm', ['run', script]],
    pnpm: ['pnpm', [script]],
    yarn: ['yarn', [script]],
    bun: ['bun', ['run', script]],
  };

  const [command, args] = commands[packageManager];

  await execa(command, args, {
    cwd,
    stdio: 'inherit',
  });
}
