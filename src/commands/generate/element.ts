import path from 'path';
import type { Command } from 'commander';
import type { ElementGenerateOptions } from '../../types/index.js';
import { detectProject } from '../../core/index.js';
import { loadConfig } from '../../core/index.js';
import { renderTemplateToFile } from '../../core/index.js';
import { logger } from '../../utils/index.js';
import { fileExists, getDirname } from '../../utils/index.js';
import prompts from 'prompts';

/**
 * Get the element output directory
 */
function getElementDir(cwd: string): string {
  return path.join(cwd, 'src', 'components');
}

/**
 * Get template directory
 */
function getTemplateDir(): string {
  const currentDir = getDirname(import.meta.url);
  return path.join(currentDir, '..', '..', '..', 'templates');
}

/**
 * Prompt for element name
 */
async function promptElementName(): Promise<string> {
  const response = await prompts({
    type: 'text',
    name: 'name',
    message: 'Element name (e.g., MyButton):',
    validate: (value) =>
      value.trim().length > 0 ? true : 'Element name is required',
  });

  return response.name;
}

/**
 * Prompt for element options
 */
async function promptElementOptions(): Promise<{ test: boolean }> {
  const response = await prompts([
    {
      type: 'confirm',
      name: 'test',
      message: 'Generate test file?',
      initial: true,
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
 * Generate a Lit web component
 */
export async function generateElement(
  name: string | undefined,
  options: ElementGenerateOptions
): Promise<void> {
  try {
    const cwd = options.cwd ?? process.cwd();

    // Detect project
    const project = await detectProject(cwd);

    // Only Lit supports elements
    if (project.framework !== 'lit') {
      logger.error('Element generation is only supported in Lit projects');
      process.exit(1);
    }

    const config = await loadConfig(cwd);

    // Get element name
    const elementName = name ?? (await promptElementName());

    // Get options (merge CLI flags, config, and prompts)
    let elementOptions = {
      test: options.test ?? config.generators?.element?.test ?? true,
      typescript: options.typescript ?? config.generators?.element?.typescript ?? true,
    };

    // If no options provided via CLI, prompt for them
    if (options.test === undefined) {
      const prompted = await promptElementOptions();
      elementOptions = { ...elementOptions, ...prompted };
    }

    // Determine output directory
    const baseDir = options.outDir ?? getElementDir(cwd);
    const elementDir = path.join(baseDir, elementName);

    // Check if element already exists
    if (await fileExists(elementDir)) {
      const shouldOverwrite = options.force ?? (await promptOverwrite(elementDir));
      if (!shouldOverwrite) {
        logger.info('Element generation cancelled');
        return;
      }
    }

    // Get templates directory
    const templatesDir = getTemplateDir();
    const elementTemplateDir = path.join(templatesDir, 'components', 'lit');

    // Prepare template data
    const templateData = {
      name: elementName,
      typescript: elementOptions.typescript,
    };

    // Element file extension
    const ext = elementOptions.typescript ? 'ts' : 'js';

    // Generate element file
    const elementTemplatePath = path.join(elementTemplateDir, `element.${ext}.hbs`);
    const elementOutputPath = path.join(elementDir, `${elementName}.${ext}`);

    await renderTemplateToFile(elementTemplatePath, elementOutputPath, templateData);
    logger.success(`Generated ${elementOutputPath}`);

    // Generate CSS file (Lit uses external stylesheet)
    const cssTemplatePath = path.join(elementTemplateDir, 'element.css.hbs');
    const cssOutputPath = path.join(elementDir, `${elementName}.css`);

    if (await fileExists(cssTemplatePath)) {
      await renderTemplateToFile(cssTemplatePath, cssOutputPath, templateData);
      logger.success(`Generated ${cssOutputPath}`);
    }

    // Generate test file
    if (elementOptions.test) {
      const testTemplatePath = path.join(elementTemplateDir, `element.test.${ext}.hbs`);
      const testOutputPath = path.join(elementDir, `${elementName}.test.${ext}`);

      if (await fileExists(testTemplatePath)) {
        await renderTemplateToFile(testTemplatePath, testOutputPath, templateData);
        logger.success(`Generated ${testOutputPath}`);
      }
    }

    logger.success(`\n✨ Element "${elementName}" generated successfully!`);
  } catch (error) {
    logger.error(`Failed to generate element: ${(error as Error).message}`);
    if (options.debug) {
      console.error(error);
    }
    process.exit(1);
  }
}

/**
 * Register the element command
 */
export function registerElementCommand(program: Command): void {
  program
    .command('element')
    .alias('e')
    .description('Generate a new Lit web component')
    .argument('[name]', 'Element name')
    .option('--test', 'Generate test file')
    .option('--no-test', 'Skip test file generation')
    .option('--typescript', 'Use TypeScript')
    .option('--no-typescript', 'Use JavaScript')
    .option('-o, --out-dir <dir>', 'Output directory')
    .option('-f, --force', 'Overwrite existing files')
    .option('--debug', 'Enable debug mode')
    .action(generateElement);
}
