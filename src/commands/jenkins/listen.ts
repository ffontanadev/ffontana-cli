import type { Command } from 'commander';
import prompts from 'prompts';
import picocolors from 'picocolors';
import { JenkinsWebhookServer } from '../../utils/jenkins/webhook-server.js';
import type { JenkinsListenerConfig } from '../../types/index.js';
import { logger } from '../../utils/index.js';
import { writeJSON, readJSON, fileExists, ensureDir } from '../../utils/index.js';
import path from 'path';
import os from 'os';

/**
 * Get Jenkins config path
 */
function getJenkinsConfigPath(): string {
  return path.join(os.homedir(), '.config', 'ff-cli', 'jenkins.json');
}

/**
 * Load Jenkins configuration
 */
async function loadJenkinsConfig(): Promise<JenkinsListenerConfig | null> {
  const configPath = getJenkinsConfigPath();
  if (await fileExists(configPath)) {
    return readJSON<JenkinsListenerConfig>(configPath);
  }
  return null;
}

/**
 * Save Jenkins configuration
 */
async function saveJenkinsConfig(config: JenkinsListenerConfig): Promise<void> {
  const configPath = getJenkinsConfigPath();
  await ensureDir(path.dirname(configPath));
  await writeJSON(configPath, config);
}

/**
 * Start Jenkins webhook listener
 */
export async function startJenkinsListener(options: {
  port?: number;
  secret?: string;
  autoTest?: boolean;
  testCommand?: string;
  config?: boolean;
  debug?: boolean;
}): Promise<void> {
  try {
    let config = await loadJenkinsConfig();

    // Interactive configuration if requested or no config exists
    if (options.config || !config) {
      console.log(picocolors.cyan('\n⚙️  Jenkins Listener Configuration\n'));

      const response = await prompts([
        {
          type: 'number',
          name: 'port',
          message: 'Webhook server port:',
          initial: options.port || config?.port || 9000,
        },
        {
          type: 'text',
          name: 'secret',
          message: 'Secret token (leave empty for none):',
          initial: options.secret || config?.secret || '',
        },
        {
          type: 'confirm',
          name: 'autoTest',
          message: 'Auto-trigger tests on successful builds?',
          initial: options.autoTest ?? config?.autoTest ?? false,
        },
      ]);

      let testCommand = options.testCommand || config?.testCommand;

      if (response.autoTest && !testCommand) {
        const cmdResponse = await prompts({
          type: 'text',
          name: 'testCommand',
          message: 'Test command to run:',
          initial: 'npm test',
        });
        testCommand = cmdResponse.testCommand;
      }

      config = {
        port: response.port,
        secret: response.secret || undefined,
        autoTest: response.autoTest,
        testCommand: response.autoTest ? testCommand : undefined,
      };

      // Ask to save configuration
      const { save } = await prompts({
        type: 'confirm',
        name: 'save',
        message: 'Save this configuration?',
        initial: true,
      });

      if (save) {
        await saveJenkinsConfig(config);
        logger.success('Configuration saved');
      }
    } else {
      // Override with CLI options
      config = {
        ...config,
        port: options.port || config.port,
        secret: options.secret || config.secret,
        autoTest: options.autoTest ?? config.autoTest,
        testCommand: options.testCommand || config.testCommand,
      };
    }

    // Create and start server
    const server = new JenkinsWebhookServer(config);

    // Register event handlers
    server.on('success', async (result) => {
      logger.success(
        picocolors.green(`\n✨ Build succeeded: ${result.name} #${result.build.number}`)
      );
      logger.info(`URL: ${result.build.fullUrl}`);
      if (result.build.duration) {
        logger.info(`Duration: ${Math.round(result.build.duration / 1000)}s`);
      }
    });

    server.on('failure', async (result) => {
      logger.error(picocolors.red(`\n❌ Build failed: ${result.name} #${result.build.number}`));
      logger.info(`URL: ${result.build.fullUrl}`);
    });

    server.on('unstable', async (result) => {
      logger.warn(
        picocolors.yellow(`\n⚠️  Build unstable: ${result.name} #${result.build.number}`)
      );
      logger.info(`URL: ${result.build.fullUrl}`);
    });

    // Start listening
    await server.start();

    // Keep process alive
    process.on('SIGINT', async () => {
      logger.info('\n\nShutting down Jenkins listener...');
      await server.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await server.stop();
      process.exit(0);
    });
  } catch (error) {
    logger.error(`Failed to start Jenkins listener: ${(error as Error).message}`);
    if (options.debug) {
      console.error(error);
    }
    process.exit(1);
  }
}

/**
 * Register Jenkins listen command
 */
export function registerJenkinsListenCommand(program: Command): void {
  program
    .command('listen')
    .description('Start webhook listener for Jenkins events')
    .option('-p, --port <port>', 'Webhook server port', parseInt)
    .option('-s, --secret <token>', 'Secret token for authentication')
    .option('--auto-test', 'Auto-trigger tests on successful builds')
    .option('--test-command <command>', 'Command to run for tests')
    .option('-c, --config', 'Interactive configuration')
    .option('--debug', 'Enable debug mode')
    .action(startJenkinsListener);
}
