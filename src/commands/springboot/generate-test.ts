import type { Command } from 'commander';
import prompts from 'prompts';
import picocolors from 'picocolors';
import path from 'path';
import type { SpringBootTestOptions, SpringBootTestType } from '../../types/index.js';
import { logger, getDirname, ensureDir, fileExists } from '../../utils/index.js';
import { renderTemplateToFile } from '../../core/template-engine.js';

/**
 * Generate Spring Boot test file
 */
export async function generateSpringBootTest(
  className?: string,
  options: {
    apiName?: string;
    package?: string;
    type?: string;
    module?: string;
    outDir?: string;
    debug?: boolean;
  } = {}
): Promise<void> {
  try {
    console.log(picocolors.cyan('\n🍃 Spring Boot Test Generator\n'));

    // Get test parameters interactively if not provided
    let testClassName = className;
    let apiName = options.apiName;
    let basePackage = options.package;
    let testType = options.type as SpringBootTestType | undefined;
    let moduleType = options.module;

    if (!testClassName) {
      const response = await prompts({
        type: 'text',
        name: 'className',
        message: 'Class name to test (e.g., UserController):',
        validate: (value) => (value ? true : 'Class name is required'),
      });
      testClassName = response.className;
    }

    if (!testClassName) {
      logger.error('Class name is required');
      return;
    }

    if (!apiName) {
      const response = await prompts({
        type: 'text',
        name: 'apiName',
        message: 'API name (e.g., users-api):',
        validate: (value) => (value ? true : 'API name is required'),
      });
      apiName = response.apiName;
    }

    if (!basePackage) {
      const response = await prompts({
        type: 'text',
        name: 'package',
        message: 'Java base package (e.g., com.bbva.users):',
        initial: `com.bbva.${apiName?.replace(/-api$/, '')}`,
        validate: (value) => (value ? true : 'Package is required'),
      });
      basePackage = response.package;
    }

    if (!testType) {
      const response = await prompts({
        type: 'select',
        name: 'testType',
        message: 'Test type:',
        choices: [
          { title: 'Controller (MockMVC)', value: 'controller' },
          { title: 'Service (Mockito)', value: 'service' },
          { title: 'DAO/Repository (Mockito)', value: 'dao' },
        ],
      });
      testType = response.testType;
    }

    if (!moduleType) {
      const response = await prompts({
        type: 'select',
        name: 'module',
        message: 'Module type:',
        choices: [
          { title: 'REST (rest-sb-{apiname})', value: 'rest' },
          { title: 'Service (services-{apiname})', value: 'service' },
          { title: 'DAO (services-{apiname})', value: 'dao' },
        ],
      });
      moduleType = response.module;
    }

    // Build directory structure
    const moduleName =
      moduleType === 'rest' ? `rest-sb-${apiName}` : `services-${apiName}`;
    const packagePath = basePackage!.replace(/\./g, '/');

    let outputDir = options.outDir;
    if (!outputDir) {
      outputDir = path.join(
        process.cwd(),
        `${apiName}`,
        moduleName,
        'src',
        'test',
        'java',
        packagePath
      );
    }

    // Template data
    const templateData = {
      packageName: basePackage,
      className: testClassName,
      classNameCamel: testClassName!.charAt(0).toLowerCase() + testClassName!.slice(1),
      mocks: [], // Can be extended with actual dependencies
      dependencies: ['repository', 'service'], // Example dependencies
      endpoints: [
        {
          method: 'GET',
          path: '/api/v1/resource',
          description: 'Get all resources',
          expectedStatus: 'Ok',
          testMethodName: 'testGetAllResources',
        },
      ],
      methods: [
        {
          name: 'findById',
          description: 'Find entity by ID',
          returnType: 'Optional',
          parameters: [{ name: 'id', type: 'Long' }],
        },
      ],
    };

    // Get template path
    const currentDir = getDirname(import.meta.url);
    const templateDir = path.join(currentDir, '..', '..', '..', 'templates', 'springboot');

    let templateFile: string;
    switch (testType) {
      case 'controller':
        templateFile = path.join(templateDir, 'controller', 'ControllerTest.java.hbs');
        break;
      case 'service':
        templateFile = path.join(templateDir, 'service', 'ServiceTest.java.hbs');
        break;
      case 'dao':
        templateFile = path.join(templateDir, 'dao', 'DAOTest.java.hbs');
        break;
      default:
        throw new Error(`Unknown test type: ${testType}`);
    }

    // Ensure output directory exists
    await ensureDir(outputDir);

    // Output file path
    const outputFile = path.join(outputDir, `${testClassName}Test.java`);

    // Check if file exists
    if (await fileExists(outputFile)) {
      const { overwrite } = await prompts({
        type: 'confirm',
        name: 'overwrite',
        message: `File ${testClassName}Test.java already exists. Overwrite?`,
        initial: false,
      });

      if (!overwrite) {
        logger.info('Test generation cancelled');
        return;
      }
    }

    // Generate test file
    await renderTemplateToFile(templateFile, outputFile, templateData);

    logger.success(`\n✨ Generated: ${picocolors.green(outputFile)}`);
    console.log(picocolors.cyan('\nFile structure:'));
    console.log(picocolors.gray(`${apiName}/`));
    console.log(picocolors.gray(`  ${moduleName}/`));
    console.log(picocolors.gray(`    src/test/java/${packagePath}/`));
    console.log(picocolors.green(`      ${testClassName}Test.java`));

    console.log(picocolors.cyan('\nNext steps:'));
    console.log('  1. Review and customize the generated test');
    console.log('  2. Add specific test cases for your endpoints/methods');
    console.log('  3. Run tests with: mvn test');
  } catch (error) {
    logger.error(`Failed to generate test: ${(error as Error).message}`);
    if (options.debug) {
      console.error(error);
    }
    process.exit(1);
  }
}

/**
 * Register Spring Boot test generation command
 */
export function registerGenerateTestCommand(program: Command): void {
  program
    .command('generate-test [className]')
    .alias('gt')
    .description('Generate JUnit 5 test file for Spring Boot')
    .option('-a, --api-name <name>', 'API name')
    .option('-p, --package <package>', 'Java base package')
    .option('-t, --type <type>', 'Test type (controller|service|dao)')
    .option('-m, --module <module>', 'Module type (rest|service|dao)')
    .option('-o, --out-dir <dir>', 'Output directory')
    .option('--debug', 'Enable debug mode')
    .action(generateSpringBootTest);
}
