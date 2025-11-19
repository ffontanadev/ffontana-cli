import path from 'path';
import type { Command } from 'commander';
import type { PageGenerateOptions } from '../../types/index.js';
import { detectProject } from '../../core/index.js';
import { loadConfig } from '../../core/index.js';
import { renderTemplateToFile } from '../../core/index.js';
import { logger } from '../../utils/index.js';
import { fileExists, getDirname } from '../../utils/index.js';
import prompts from 'prompts';

/**
 * Get the page output directory (Next.js App Router)
 */
function getPageDir(cwd: string, pageName: string, dynamic: boolean): string {
  const appDir = path.join(cwd, 'app');
  const routeName = dynamic ? `[${pageName}]` : pageName;
  return path.join(appDir, routeName);
}

/**
 * Get template directory
 */
function getTemplateDir(): string {
  const currentDir = getDirname(import.meta.url);
  return path.join(currentDir, '..', '..', '..', 'templates');
}

/**
 * Prompt for page name
 */
async function promptPageName(): Promise<string> {
  const response = await prompts({
    type: 'text',
    name: 'name',
    message: 'Page name:',
    validate: (value) =>
      value.trim().length > 0 ? true : 'Page name is required',
  });

  return response.name;
}

/**
 * Prompt for page options
 */
async function promptPageOptions(): Promise<{
  style: string;
  test: boolean;
  dynamic: boolean;
}> {
  const response = await prompts([
    {
      type: 'select',
      name: 'style',
      message: 'Style format:',
      choices: [
        { title: 'CSS Modules', value: 'css-modules' },
        { title: 'CSS', value: 'css' },
        { title: 'SCSS', value: 'scss' },
        { title: 'Tailwind', value: 'tailwind' },
      ],
      initial: 0,
    },
    {
      type: 'confirm',
      name: 'test',
      message: 'Generate test file?',
      initial: true,
    },
    {
      type: 'confirm',
      name: 'dynamic',
      message: 'Is this a dynamic route?',
      initial: false,
    },
  ]);

  return response;
}

/**
 * Prompt for overwrite confirmation
 */
async function promptOverwrite(path: string): Promise<boolean> {
  const response = await prompts({
    type: 'confirm',
    name: 'overwrite',
    message: `Directory ${path} already exists. Overwrite?`,
    initial: false,
  });

  return response.overwrite;
}

/**
 * Generate a Next.js App Router page
 */
export async function generatePage(
  name: string | undefined,
  options: PageGenerateOptions
): Promise<void> {
  try {
    const cwd = options.cwd ?? process.cwd();

    // Detect project
    const project = await detectProject(cwd);

    // Only Next.js supports pages
    if (project.framework !== 'next') {
      logger.error('Page generation is only supported in Next.js projects');
      process.exit(1);
    }

    const config = await loadConfig(cwd);

    // Get page name
    const pageName = name ?? (await promptPageName());

    // Get options (merge CLI flags, config, and prompts)
    let pageOptions = {
      style: options.style ?? config.generators?.page?.style ?? 'css-modules',
      test: options.test ?? config.generators?.page?.test ?? true,
      typescript: options.typescript ?? config.generators?.page?.typescript ?? true,
      dynamic: options.dynamic ?? false,
    };

    // If no options provided via CLI, prompt for them
    if (!options.style && options.test === undefined && options.dynamic === undefined) {
      const prompted = await promptPageOptions();
      pageOptions = { ...pageOptions, ...prompted };
    }

    // Determine output directory
    const pageDir = options.outDir ?? getPageDir(cwd, pageName, pageOptions.dynamic);

    // Check if page already exists
    if (await fileExists(pageDir)) {
      const shouldOverwrite = options.force ?? (await promptOverwrite(pageDir));
      if (!shouldOverwrite) {
        logger.info('Page generation cancelled');
        return;
      }
    }

    // Get templates directory
    const templatesDir = getTemplateDir();
    const pageTemplateDir = path.join(templatesDir, 'pages', 'nextjs');

    // Prepare template data
    const templateData = {
      name: pageName.charAt(0).toUpperCase() + pageName.slice(1),
      typescript: pageOptions.typescript,
      style: pageOptions.style,
      dynamic: pageOptions.dynamic,
    };

    // Page file extension
    const ext = pageOptions.typescript ? 'tsx' : 'jsx';

    // Generate page.tsx file
    const pageTemplatePath = path.join(pageTemplateDir, `page.${ext}.hbs`);
    const pageOutputPath = path.join(pageDir, `page.${ext}`);

    await renderTemplateToFile(pageTemplatePath, pageOutputPath, templateData);
    logger.success(`Generated ${pageOutputPath}`);

    // Generate style file
    if (pageOptions.style !== 'tailwind') {
      const styleExt = pageOptions.style === 'scss' ? 'scss' : 'css';
      const styleFileName =
        pageOptions.style === 'css-modules' ? `page.module.${styleExt}` : `page.${styleExt}`;

      const styleTemplatePath = path.join(pageTemplateDir, `page.module.${styleExt}.hbs`);
      const styleOutputPath = path.join(pageDir, styleFileName);

      if (await fileExists(styleTemplatePath)) {
        await renderTemplateToFile(styleTemplatePath, styleOutputPath, templateData);
        logger.success(`Generated ${styleOutputPath}`);
      }
    }

    logger.success(`\n✨ Page "${pageName}" generated successfully in app/${pageOptions.dynamic ? `[${pageName}]` : pageName}!`);
  } catch (error) {
    logger.error(`Failed to generate page: ${(error as Error).message}`);
    if (options.debug) {
      console.error(error);
    }
    process.exit(1);
  }
}

/**
 * Register the page command
 */
export function registerPageCommand(program: Command): void {
  program
    .command('page')
    .alias('p')
    .description('Generate a new Next.js App Router page')
    .argument('[name]', 'Page name')
    .option('-s, --style <format>', 'Style format (css|scss|tailwind|css-modules)')
    .option('--test', 'Generate test file')
    .option('--no-test', 'Skip test file generation')
    .option('--typescript', 'Use TypeScript')
    .option('--no-typescript', 'Use JavaScript')
    .option('--dynamic', 'Create dynamic route segment')
    .option('-o, --out-dir <dir>', 'Output directory')
    .option('-f, --force', 'Overwrite existing files')
    .option('--debug', 'Enable debug mode')
    .action(generatePage);
}
