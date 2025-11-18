import Handlebars from 'handlebars';
import path from 'path';
import { readFile, writeFile, ensureDir } from '../utils/index.js';

/**
 * Template data for rendering
 */
export interface TemplateData {
  [key: string]: unknown;
}

/**
 * Register custom Handlebars helpers
 */
function registerHelpers() {
  // Pascal case helper
  Handlebars.registerHelper('pascalCase', (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  // Camel case helper
  Handlebars.registerHelper('camelCase', (str: string) => {
    return str.charAt(0).toLowerCase() + str.slice(1);
  });

  // Kebab case helper
  Handlebars.registerHelper('kebabCase', (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();
  });

  // Snake case helper
  Handlebars.registerHelper('snakeCase', (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/\s+/g, '_')
      .toLowerCase();
  });
}

// Register helpers on module load
registerHelpers();

/**
 * Compile and render a template
 */
export async function renderTemplate(
  templatePath: string,
  data: TemplateData
): Promise<string> {
  const templateContent = await readFile(templatePath);
  const template = Handlebars.compile(templateContent);
  return template(data);
}

/**
 * Render a template string directly
 */
export function renderTemplateString(templateString: string, data: TemplateData): string {
  const template = Handlebars.compile(templateString);
  return template(data);
}

/**
 * Render template and write to file
 */
export async function renderTemplateToFile(
  templatePath: string,
  outputPath: string,
  data: TemplateData
): Promise<void> {
  const rendered = await renderTemplate(templatePath, data);

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  await ensureDir(outputDir);

  // Write rendered content to file
  await writeFile(outputPath, rendered);
}

/**
 * Batch render multiple templates
 */
export async function renderTemplates(
  templates: Array<{
    templatePath: string;
    outputPath: string;
    data: TemplateData;
  }>
): Promise<void> {
  await Promise.all(
    templates.map((t) => renderTemplateToFile(t.templatePath, t.outputPath, t.data))
  );
}
