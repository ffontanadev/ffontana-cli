import express, { Request, Response, NextFunction } from 'express';
import type { Server } from 'http';
import type {
  JenkinsListenerConfig,
  JenkinsWebhookPayload,
  JenkinsBuildResult,
  JenkinsEventHandler,
} from '../../types/index.js';
import { logger } from '../logger.js';
import picocolors from 'picocolors';

/**
 * Security middleware for webhook validation
 */
function createSecurityMiddleware(config: JenkinsListenerConfig) {
  return (req: Request, res: Response, next: NextFunction) => {
    // IP whitelist check
    if (config.allowedIPs && config.allowedIPs.length > 0) {
      const clientIP = req.ip || req.socket.remoteAddress || '';
      const isAllowed = config.allowedIPs.some((ip) => clientIP.includes(ip));

      if (!isAllowed) {
        logger.warn(`Rejected request from unauthorized IP: ${clientIP}`);
        res.status(403).json({ error: 'Forbidden - IP not whitelisted' });
        return;
      }
    }

    // Token validation
    if (config.secret) {
      const token = req.headers['x-jenkins-token'] || req.headers['authorization'];

      if (token !== config.secret && token !== `Bearer ${config.secret}`) {
        logger.warn('Rejected request with invalid token');
        res.status(401).json({ error: 'Unauthorized - Invalid token' });
        return;
      }
    }

    next();
  };
}

/**
 * Parse Jenkins webhook payload
 */
function parseJenkinsPayload(payload: JenkinsWebhookPayload): JenkinsBuildResult {
  return {
    name: payload.name,
    url: payload.url,
    build: {
      number: payload.build.number,
      phase: payload.build.phase,
      status: payload.build.status,
      url: payload.build.url,
      fullUrl: payload.build.full_url,
      timestamp: payload.build.timestamp,
      duration: payload.build.duration,
    },
    parameters: payload.build.parameters as Record<string, string> | undefined,
  };
}

/**
 * Create and start Jenkins webhook listener server
 */
export class JenkinsWebhookServer {
  private app: express.Application;
  private server: Server | null = null;
  private config: JenkinsListenerConfig;
  private handlers: {
    onComplete?: JenkinsEventHandler;
    onSuccess?: JenkinsEventHandler;
    onFailure?: JenkinsEventHandler;
    onUnstable?: JenkinsEventHandler;
  } = {};

  constructor(config: JenkinsListenerConfig) {
    this.config = config;
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  /**
   * Setup Express middleware
   */
  private setupMiddleware() {
    // Parse JSON bodies
    this.app.use(express.json());

    // Security middleware
    this.app.use(createSecurityMiddleware(this.config));

    // Request logging
    this.app.use((req, res, next) => {
      const timestamp = new Date().toISOString();
      logger.debug(`[${timestamp}] ${req.method} ${req.path} from ${req.ip}`);
      next();
    });
  }

  /**
   * Setup Express routes
   */
  private setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: Date.now() });
    });

    // Jenkins webhook endpoint
    this.app.post('/webhook/jenkins', async (req, res) => {
      try {
        const payload: JenkinsWebhookPayload = req.body;

        logger.info(
          picocolors.cyan(
            `\n📦 Received Jenkins event: ${payload.name} #${payload.build.number}`
          )
        );
        logger.info(`Phase: ${payload.build.phase}, Status: ${payload.build.status}`);

        const buildResult = parseJenkinsPayload(payload);

        // Only process COMPLETED builds
        if (payload.build.phase === 'COMPLETED') {
          await this.handleBuildComplete(buildResult);
        }

        res.status(200).json({ received: true, processed: payload.build.phase === 'COMPLETED' });
      } catch (error) {
        logger.error(`Failed to process webhook: ${(error as Error).message}`);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Catch-all for unknown routes
    this.app.use((req, res) => {
      res.status(404).json({ error: 'Not found' });
    });
  }

  /**
   * Handle completed build
   */
  private async handleBuildComplete(result: JenkinsBuildResult) {
    // Call general completion handler
    if (this.handlers.onComplete) {
      await this.handlers.onComplete(result);
    }

    // Call status-specific handlers
    switch (result.build.status) {
      case 'SUCCESS':
        logger.success(picocolors.green(`✓ Build ${result.name} #${result.build.number} succeeded`));
        if (this.handlers.onSuccess) {
          await this.handlers.onSuccess(result);
        }
        // Auto-trigger testing if configured
        if (this.config.autoTest && this.config.testCommand) {
          await this.runTests(result);
        }
        break;

      case 'FAILURE':
        logger.error(picocolors.red(`✖ Build ${result.name} #${result.build.number} failed`));
        if (this.handlers.onFailure) {
          await this.handlers.onFailure(result);
        }
        break;

      case 'UNSTABLE':
        logger.warn(picocolors.yellow(`⚠ Build ${result.name} #${result.build.number} unstable`));
        if (this.handlers.onUnstable) {
          await this.handlers.onUnstable(result);
        }
        break;

      default:
        logger.info(`Build ${result.name} #${result.build.number}: ${result.build.status}`);
    }
  }

  /**
   * Run tests automatically
   */
  private async runTests(result: JenkinsBuildResult) {
    if (!this.config.testCommand) return;

    logger.info(picocolors.cyan(`\n🧪 Auto-triggering tests: ${this.config.testCommand}`));

    try {
      const { execa } = await import('execa');
      const [command, ...args] = this.config.testCommand.split(' ');

      const { stdout, stderr } = await execa(command!, args, {
        env: {
          ...process.env,
          JENKINS_BUILD_NUMBER: result.build.number.toString(),
          JENKINS_JOB_NAME: result.name,
          JENKINS_BUILD_URL: result.build.fullUrl,
        },
      });

      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);

      logger.success('Tests completed');
    } catch (error) {
      logger.error(`Tests failed: ${(error as Error).message}`);
    }
  }

  /**
   * Register event handlers
   */
  on(event: 'complete' | 'success' | 'failure' | 'unstable', handler: JenkinsEventHandler) {
    const eventMap = {
      complete: 'onComplete',
      success: 'onSuccess',
      failure: 'onFailure',
      unstable: 'onUnstable',
    };

    this.handlers[eventMap[event] as keyof typeof this.handlers] = handler;
  }

  /**
   * Start the server
   */
  async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.server = this.app.listen(this.config.port, () => {
          logger.success(
            picocolors.green(`\n🎧 Jenkins webhook server listening on port ${this.config.port}`)
          );
          logger.info(`Webhook URL: http://localhost:${this.config.port}/webhook/jenkins`);

          if (this.config.allowedIPs && this.config.allowedIPs.length > 0) {
            logger.info(`IP whitelist: ${this.config.allowedIPs.join(', ')}`);
          }

          if (this.config.secret) {
            logger.info(picocolors.gray('Token authentication: enabled'));
          }

          if (this.config.autoTest) {
            logger.info(picocolors.cyan(`Auto-test command: ${this.config.testCommand}`));
          }

          console.log();
          resolve();
        });

        this.server.on('error', (error: Error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Stop the server
   */
  async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.server) {
        resolve();
        return;
      }

      this.server.close((error) => {
        if (error) {
          reject(error);
        } else {
          logger.info('Jenkins webhook server stopped');
          resolve();
        }
      });
    });
  }
}
