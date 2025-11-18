import { z } from 'zod';

/**
 * Supported frameworks
 */
export type Framework = 'react' | 'next' | 'lit' | 'auto';

/**
 * Supported style formats
 */
export type StyleFormat = 'css' | 'scss' | 'styled' | 'tailwind' | 'css-modules';

/**
 * Component generator configuration
 */
export const ComponentGeneratorConfigSchema = z.object({
  style: z.enum(['css', 'scss', 'styled', 'tailwind', 'css-modules']).default('css-modules'),
  typescript: z.boolean().default(true),
  test: z.boolean().default(true),
  story: z.boolean().default(false),
});

export type ComponentGeneratorConfig = z.infer<typeof ComponentGeneratorConfigSchema>;

/**
 * Hook generator configuration
 */
export const HookGeneratorConfigSchema = z.object({
  typescript: z.boolean().default(true),
  test: z.boolean().default(true),
});

export type HookGeneratorConfig = z.infer<typeof HookGeneratorConfigSchema>;

/**
 * Page generator configuration (Next.js)
 */
export const PageGeneratorConfigSchema = z.object({
  style: z.enum(['css', 'scss', 'tailwind', 'css-modules']).default('css-modules'),
  typescript: z.boolean().default(true),
  test: z.boolean().default(true),
});

export type PageGeneratorConfig = z.infer<typeof PageGeneratorConfigSchema>;

/**
 * Element generator configuration (Lit)
 */
export const ElementGeneratorConfigSchema = z.object({
  typescript: z.boolean().default(true),
  test: z.boolean().default(true),
});

export type ElementGeneratorConfig = z.infer<typeof ElementGeneratorConfigSchema>;

/**
 * All generators configuration
 */
export const GeneratorsConfigSchema = z.object({
  component: ComponentGeneratorConfigSchema.optional(),
  hook: HookGeneratorConfigSchema.optional(),
  page: PageGeneratorConfigSchema.optional(),
  element: ElementGeneratorConfigSchema.optional(),
});

export type GeneratorsConfig = z.infer<typeof GeneratorsConfigSchema>;

/**
 * Task configuration
 */
export const TasksConfigSchema = z.object({
  lint: z.string().optional(),
  test: z.string().optional(),
  format: z.string().optional(),
});

export type TasksConfig = z.infer<typeof TasksConfigSchema>;

/**
 * Template overrides
 */
export const TemplatesConfigSchema = z.object({
  component: z.string().optional(),
  hook: z.string().optional(),
  page: z.string().optional(),
  element: z.string().optional(),
});

export type TemplatesConfig = z.infer<typeof TemplatesConfigSchema>;

/**
 * Hooks configuration
 */
export const HooksConfigSchema = z.record(z.string());

export type HooksConfig = z.infer<typeof HooksConfigSchema>;

/**
 * Main CLI configuration schema
 */
export const FFConfigSchema = z.object({
  framework: z.enum(['react', 'next', 'lit', 'auto']).default('auto'),
  plugins: z.array(z.string()).default([]),
  generators: GeneratorsConfigSchema.optional(),
  tasks: TasksConfigSchema.optional(),
  templates: TemplatesConfigSchema.optional(),
  hooks: HooksConfigSchema.optional(),
});

export type FFConfig = z.infer<typeof FFConfigSchema>;

/**
 * Partial config for user-defined configurations
 */
export type PartialFFConfig = Partial<FFConfig>;

/**
 * Config file locations
 */
export interface ConfigPaths {
  global?: string;
  workspace?: string;
  project?: string;
}

/**
 * Resolved configuration with metadata
 */
export interface ResolvedConfig extends FFConfig {
  configPath?: string;
  source: 'global' | 'workspace' | 'project' | 'default';
}
