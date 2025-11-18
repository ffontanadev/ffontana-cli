import axios, { AxiosInstance } from 'axios';
import type { JenkinsJobInfo, JenkinsBuildInfo, JenkinsPipelineStatus } from '../../types/index.js';
import { logger } from '../logger.js';

/**
 * Jenkins API Client
 */
export class JenkinsAPIClient {
  private client: AxiosInstance;
  private jenkinsUrl: string;

  constructor(jenkinsUrl: string, username?: string, apiToken?: string) {
    this.jenkinsUrl = jenkinsUrl.replace(/\/$/, ''); // Remove trailing slash

    this.client = axios.create({
      baseURL: this.jenkinsUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      auth: username && apiToken ? { username, password: apiToken } : undefined,
    });
  }

  /**
   * Get job information
   */
  async getJob(jobName: string): Promise<JenkinsJobInfo> {
    const response = await this.client.get(`/job/${jobName}/api/json`);
    return response.data;
  }

  /**
   * Get specific build information
   */
  async getBuild(jobName: string, buildNumber: number): Promise<JenkinsBuildInfo> {
    const response = await this.client.get(`/job/${jobName}/${buildNumber}/api/json`);
    return response.data;
  }

  /**
   * Get last build information
   */
  async getLastBuild(jobName: string): Promise<JenkinsBuildInfo | null> {
    try {
      const job = await this.getJob(jobName);
      if (!job.lastBuild) return null;

      return await this.getBuild(jobName, job.lastBuild.number);
    } catch (error) {
      logger.error(`Failed to get last build for ${jobName}: ${(error as Error).message}`);
      return null;
    }
  }

  /**
   * Poll job for completion
   */
  async pollUntilComplete(
    jobName: string,
    buildNumber: number,
    interval: number = 5000,
    timeout: number = 300000
  ): Promise<JenkinsPipelineStatus> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const build = await this.getBuild(jobName, buildNumber);

      if (!build.building && build.result) {
        return build.result;
      }

      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error(`Polling timeout after ${timeout}ms`);
  }
}
