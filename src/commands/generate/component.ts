import path from 'path';
import type { Command } from 'commander';
import type { ComponentGenerateOptions } from '../../types/index.js';
import { detectProject } from '../../core/index.js';
import { loadConfig } from '../../core/index.js';
import { renderTemplateToFile } from '../../core/index.js';
import { logger } from '../../utils/index.js';
import { promptComponentName, promptComponentOptions, promptOverwrite } from '../../utils/index.js';
import { fileExists, getDirname } from '../../utils/index.js';

/**
 * Get the component output directory based on framework
 */
function getComponentDir(framework: string, cwd: string): string {
  switch (framework) {
    case 'next':
      return path.join(cwd, 'src', 'components');
    case 'react':
      return path.join(cwd, 'src', 'components');
    case 'lit':
      return path.join(cwd, 'src', 'components');
    default:
      return path.join(cwd, 'src', 'components');
  }
}

/**
 * Get template directory
 */
function getTemplateDir(): string {
  // In production, templates are copied to dist/templates
  // In development, they're in the source templates folder
  const currentDir = getDirname(import.meta.url);
  return path.join(currentDir, 'templates');
}

/**
 * Generate a component
 */
export async function generateComponent(
  name: string | undefined,
  options: ComponentGenerateOptions
): Promise<void> {
  try {
    const cwd = options.cwd ?? process.cwd();

    // Detect project
    const project = await detectProject(cwd);
    const config = await loadConfig(cwd);

    // Get component name
    const componentName = name ?? (await promptComponentName());

    // Get options (merge CLI flags, config, and prompts)
    let componentOptions = {
      style: options.style ?? config.generators?.component?.style ?? 'css-modules',
      test: options.test ?? config.generators?.component?.test ?? true,
      story: options.story ?? config.generators?.component?.story ?? false,
      typescript: options.typescript ?? config.generators?.component?.typescript ?? true,
    };

    // If no options provided via CLI, prompt for them
    if (!options.style && !options.test && !options.story) {
      const prompted = await promptComponentOptions();
      componentOptions = { ...componentOptions, ...prompted };
    }

    // Determine output directory
    const baseDir = options.outDir ?? getComponentDir(project.framework, cwd);
    const componentDir = path.join(baseDir, componentName);

    // Check if component already exists
    if (await fileExists(componentDir)) {
      const shouldOverwrite = options.force ?? (await promptOverwrite(componentDir));
      if (!shouldOverwrite) {
        logger.info('Component generation cancelled');
        return;
      }
    }

    // Get templates directory
    const templatesDir = getTemplateDir();
    const frameworkTemplateDir = path.join(
      templatesDir,
      'components',
      project.framework === 'next' ? 'react' : project.framework
    );

    // Prepare template data
    const templateData = {
      name: componentName,
      typescript: componentOptions.typescript,
      style: componentOptions.style,
    };

    // Component file extension
    const ext = componentOptions.typescript ? 'tsx' : 'jsx';

    // Generate component file
    const componentTemplatePath = path.join(frameworkTemplateDir, `component.${ext}.hbs`);
    const componentOutputPath = path.join(componentDir, `${componentName}.${ext}`);

    await renderTemplateToFile(componentTemplatePath, componentOutputPath, templateData);
    logger.success(`Generated ${componentOutputPath}`);

    // Generate style file
    if (componentOptions.style !== 'styled') {
      const styleExt = componentOptions.style === 'scss' ? 'scss' : 'css';
      const styleTemplatePath = path.join(
        frameworkTemplateDir,
        componentOptions.style === 'css-modules'
          ? `component.module.${styleExt}.hbs`
          : `component.${styleExt}.hbs`
      );
      const styleFileName =
        componentOptions.style === 'css-modules'
          ? `${componentName}.module.${styleExt}`
          : `${componentName}.${styleExt}`;
      const styleOutputPath = path.join(componentDir, styleFileName);

      if (await fileExists(styleTemplatePath)) {
        await renderTemplateToFile(styleTemplatePath, styleOutputPath, templateData);
        logger.success(`Generated ${styleOutputPath}`);
      }
    }

    // Generate test file
    if (componentOptions.test) {
      const testTemplatePath = path.join(frameworkTemplateDir, `component.test.${ext}.hbs`);
      const testOutputPath = path.join(componentDir, `${componentName}.test.${ext}`);

      if (await fileExists(testTemplatePath)) {
        await renderTemplateToFile(testTemplatePath, testOutputPath, templateData);
        logger.success(`Generated ${testOutputPath}`);
      }
    }

    // Generate story file
    if (componentOptions.story) {
      const storyTemplatePath = path.join(frameworkTemplateDir, `component.stories.${ext}.hbs`);
      const storyOutputPath = path.join(componentDir, `${componentName}.stories.${ext}`);

      if (await fileExists(storyTemplatePath)) {
        await renderTemplateToFile(storyTemplatePath, storyOutputPath, templateData);
        logger.success(`Generated ${storyOutputPath}`);
      }
    }

    logger.success(`\n✨ Component "${componentName}" generated successfully!`);
  } catch (error) {
    logger.error(`Failed to generate component: ${(error as Error).message}`);
    if (options.debug) {
      console.error(error);
    }
    process.exit(1);
  }
}

/**
 * Register the component command
 */
export function registerComponentCommand(program: Command): void {
  program
    .command('component')
    .alias('c')
    .description('Generate a new component')
    .argument('[name]', 'Component name')
    .option('-s, --style <format>', 'Style format (css|scss|styled|tailwind|css-modules)')
    .option('--test', 'Generate test file')
    .option('--no-test', 'Skip test file generation')
    .option('--story', 'Generate Storybook story')
    .option('--no-story', 'Skip story file generation')
    .option('--typescript', 'Use TypeScript')
    .option('--no-typescript', 'Use JavaScript')
    .option('-o, --out-dir <dir>', 'Output directory')
    .option('-f, --force', 'Overwrite existing files')
    .option('--debug', 'Enable debug mode')
    .action(generateComponent);
}
