import path from 'path';
import os from 'os';
import { pathToFileURL } from 'url';
import type { FFConfig, ResolvedConfig, PartialFFConfig } from '../types/index.js';
import { FFConfigSchema } from '../types/index.js';
import { fileExists, readJSON, findUp } from '../utils/index.js';

/**
 * Default configuration
 */
const defaultConfig: FFConfig = {
  framework: 'auto',
  plugins: [],
  generators: {
    component: {
      style: 'css-modules',
      typescript: true,
      test: true,
      story: false,
    },
  },
  tasks: {},
  templates: {},
  hooks: {},
};

/**
 * Get the global config path
 */
function getGlobalConfigPath(): string {
  return path.join(os.homedir(), '.config', 'ff-cli', 'config.json');
}

/**
 * Load global configuration
 */
async function loadGlobalConfig(): Promise<PartialFFConfig | null> {
  const configPath = getGlobalConfigPath();

  if (await fileExists(configPath)) {
    try {
      return await readJSON<PartialFFConfig>(configPath);
    } catch (error) {
      console.warn(`Failed to load global config from ${configPath}:`, error);
    }
  }

  return null;
}

/**
 * Load workspace configuration
 */
async function loadWorkspaceConfig(cwd: string): Promise<PartialFFConfig | null> {
  const configPath = await findUp('.ff/config.json', cwd);

  if (configPath && (await fileExists(configPath))) {
    try {
      return await readJSON<PartialFFConfig>(configPath);
    } catch (error) {
      console.warn(`Failed to load workspace config from ${configPath}:`, error);
    }
  }

  return null;
}

/**
 * Load project configuration (supports .ts, .js, .json)
 */
async function loadProjectConfig(cwd: string): Promise<PartialFFConfig | null> {
  // Try different config file extensions
  const configFiles = ['ff.config.ts', 'ff.config.js', 'ff.config.json', '.ffrc'];

  for (const configFile of configFiles) {
    const configPath = path.join(cwd, configFile);

    if (await fileExists(configPath)) {
      try {
        // For TypeScript/JavaScript configs, use dynamic import
        if (configFile.endsWith('.ts') || configFile.endsWith('.js')) {
          const configUrl = pathToFileURL(configPath).href;
          const configModule = (await import(configUrl)) as {
            default: PartialFFConfig;
          };
          return configModule.default;
        }

        // For JSON configs, use readJSON
        return await readJSON<PartialFFConfig>(configPath);
      } catch (error) {
        console.warn(`Failed to load project config from ${configPath}:`, error);
      }
    }
  }

  return null;
}

/**
 * Deep merge two objects
 */
function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = result[key];

    if (sourceValue !== undefined) {
      if (
        typeof sourceValue === 'object' &&
        sourceValue !== null &&
        !Array.isArray(sourceValue) &&
        typeof targetValue === 'object' &&
        targetValue !== null &&
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        ) as T[Extract<keyof T, string>];
      } else {
        result[key] = sourceValue as T[Extract<keyof T, string>];
      }
    }
  }

  return result;
}

/**
 * Load and merge all configurations
 */
export async function loadConfig(cwd: string = process.cwd()): Promise<ResolvedConfig> {
  // Load configs from all sources
  const globalConfig = await loadGlobalConfig();
  const workspaceConfig = await loadWorkspaceConfig(cwd);
  const projectConfig = await loadProjectConfig(cwd);

  // Merge configs (global -> workspace -> project)
  let mergedConfig = { ...defaultConfig };

  if (globalConfig) {
    mergedConfig = deepMerge(mergedConfig, globalConfig);
  }

  if (workspaceConfig) {
    mergedConfig = deepMerge(mergedConfig, workspaceConfig);
  }

  if (projectConfig) {
    mergedConfig = deepMerge(mergedConfig, projectConfig);
  }

  // Validate the final config
  const validatedConfig = FFConfigSchema.parse(mergedConfig);

  // Determine the source
  let source: ResolvedConfig['source'] = 'default';
  let configPath: string | undefined;

  if (projectConfig) {
    source = 'project';
    configPath = path.join(cwd, 'ff.config.ts'); // Simplified for now
  } else if (workspaceConfig) {
    source = 'workspace';
  } else if (globalConfig) {
    source = 'global';
    configPath = getGlobalConfigPath();
  }

  return {
    ...validatedConfig,
    configPath,
    source,
  };
}

/**
 * Get a specific config value
 */
export async function getConfigValue<K extends keyof FFConfig>(
  key: K,
  cwd: string = process.cwd()
): Promise<FFConfig[K]> {
  const config = await loadConfig(cwd);
  return config[key];
}
