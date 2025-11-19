import type { ProjectInfo } from './plugin.js';
import type { FFConfig } from './config.js';

/**
 * Common options available to all commands
 */
export interface CommonCommandOptions {
  /** Enable debug mode */
  debug?: boolean;
  /** Suppress output */
  silent?: boolean;
  /** Verbose output */
  verbose?: boolean;
  /** Current working directory */
  cwd?: string;
}

/**
 * Init command options
 */
export interface InitCommandOptions extends CommonCommandOptions {
  /** Template name */
  template?: string;
  /** Skip git initialization */
  skipGit?: boolean;
  /** Skip dependency installation */
  skipInstall?: boolean;
  /** Use TypeScript */
  typescript?: boolean;
  /** Package manager to use */
  packageManager?: 'npm' | 'pnpm' | 'yarn' | 'bun';
}

/**
 * Generate command options (base)
 */
export interface GenerateCommandOptions extends CommonCommandOptions {
  /** Output directory */
  outDir?: string;
  /** Skip file overwrite confirmation */
  force?: boolean;
}

/**
 * Component generation options
 */
export interface ComponentGenerateOptions extends GenerateCommandOptions {
  /** Style format */
  style?: 'css' | 'scss' | 'styled' | 'tailwind' | 'css-modules';
  /** Generate test file */
  test?: boolean;
  /** Generate Storybook story */
  story?: boolean;
  /** Use TypeScript */
  typescript?: boolean;
}

/**
 * Hook generation options
 */
export interface HookGenerateOptions extends GenerateCommandOptions {
  /** Generate test file */
  test?: boolean;
  /** Use TypeScript */
  typescript?: boolean;
}

/**
 * Page generation options (Next.js)
 */
export interface PageGenerateOptions extends GenerateCommandOptions {
  /** Style format */
  style?: 'css' | 'scss' | 'tailwind' | 'css-modules';
  /** Generate test file */
  test?: boolean;
  /** Use TypeScript */
  typescript?: boolean;
  /** Dynamic route segment */
  dynamic?: boolean;
}

/**
 * Element generation options (Lit)
 */
export interface ElementGenerateOptions extends GenerateCommandOptions {
  /** Generate test file */
  test?: boolean;
  /** Use TypeScript */
  typescript?: boolean;
}

/**
 * Config command options
 */
export interface ConfigCommandOptions extends CommonCommandOptions {
  /** Show global config */
  global?: boolean;
  /** Show config source */
  source?: boolean;
}

/**
 * Add template command options
 */
export interface AddTemplateOptions extends CommonCommandOptions {
  /** Template name (override auto-detection) */
  name?: string;
  /** Force overwrite if template exists */
  force?: boolean;
}

/**
 * Command execution context
 */
export interface CommandExecutionContext {
  /** Project information */
  project: ProjectInfo;
  /** Resolved configuration */
  config: FFConfig;
  /** Current working directory */
  cwd: string;
}

/**
 * Command result
 */
export interface CommandResult {
  /** Success status */
  success: boolean;
  /** Result message */
  message?: string;
  /** Error if failed */
  error?: Error;
  /** Additional data */
  data?: Record<string, unknown>;
}
