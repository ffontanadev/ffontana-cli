import type { Command } from 'commander';
import type { FFConfig } from './config.js';

/**
 * Plugin context provided to plugins during setup
 */
export interface PluginContext {
  /** CLI version */
  version: string;
  /** Current working directory */
  cwd: string;
  /** Resolved configuration */
  config: FFConfig;
  /** Logger utilities */
  logger: Logger;
}

/**
 * Logger interface
 */
export interface Logger {
  info: (message: string) => void;
  success: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
  debug: (message: string) => void;
}

/**
 * Project information detected by the CLI
 */
export interface ProjectInfo {
  /** Detected framework */
  framework: 'react' | 'next' | 'lit' | 'unknown';
  /** Framework version if detected */
  version?: string;
  /** Package manager used (npm, pnpm, yarn, bun) */
  packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun';
  /** Whether TypeScript is configured */
  typescript: boolean;
  /** Path to package.json */
  packageJsonPath: string;
  /** Project root directory */
  rootDir: string;
}

/**
 * Template definition for code generation
 */
export interface TemplateDefinition {
  /** Template identifier */
  name: string;
  /** Human-readable description */
  description: string;
  /** Path to template file */
  path: string;
  /** Target framework(s) */
  frameworks?: Array<'react' | 'next' | 'lit'>;
}

/**
 * Generator definition for code scaffolding
 */
export interface GeneratorDefinition {
  /** Generator identifier */
  name: string;
  /** Human-readable description */
  description: string;
  /** Generator function */
  generate: (options: GeneratorOptions) => Promise<void>;
}

/**
 * Options passed to generators
 */
export interface GeneratorOptions {
  /** Name of the thing being generated */
  name: string;
  /** Current working directory */
  cwd: string;
  /** Project information */
  project: ProjectInfo;
  /** User configuration */
  config: FFConfig;
  /** Additional user-provided options */
  options: Record<string, unknown>;
}

/**
 * Hook function type
 */
export type HookFunction<T = unknown> = (data: T) => T | Promise<T>;

/**
 * Plugin hooks for lifecycle events
 */
export interface PluginHooks {
  /** Called when project is detected */
  'project:detect'?: HookFunction<ProjectInfo>;
  /** Called when config is resolved */
  'config:resolve'?: HookFunction<FFConfig>;
  /** Called before template rendering */
  'template:before-render'?: HookFunction<TemplateContext>;
  /** Called after template rendering */
  'template:after-render'?: HookFunction<TemplateContext>;
  /** Called before command runs */
  'command:before-run'?: HookFunction<CommandContext>;
  /** Called after command runs */
  'command:after-run'?: HookFunction<CommandContext>;
}

/**
 * Template rendering context
 */
export interface TemplateContext {
  templatePath: string;
  outputPath: string;
  data: Record<string, unknown>;
}

/**
 * Command execution context
 */
export interface CommandContext {
  command: string;
  args: string[];
  options: Record<string, unknown>;
}

/**
 * Plugin definition
 */
export interface Plugin {
  /** Plugin name (should match package name) */
  name: string;
  /** Plugin version */
  version: string;
  /** Plugin setup function */
  setup?: (context: PluginContext) => void | Promise<void>;
  /** Commands contributed by this plugin */
  commands?: Array<(program: Command) => void>;
  /** Lifecycle hooks */
  hooks?: PluginHooks;
  /** Templates contributed by this plugin */
  templates?: TemplateDefinition[];
  /** Generators contributed by this plugin */
  generators?: GeneratorDefinition[];
}

/**
 * Plugin module (default export from plugin package)
 */
export type PluginModule = Plugin | ((context: PluginContext) => Plugin | Promise<Plugin>);
