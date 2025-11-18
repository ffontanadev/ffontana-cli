/**
 * Jenkins integration type definitions
 */

/**
 * Jenkins pipeline status
 */
export type JenkinsPipelineStatus = 'SUCCESS' | 'FAILURE' | 'UNSTABLE' | 'ABORTED' | 'NOT_BUILT';

/**
 * Jenkins build result
 */
export interface JenkinsBuildResult {
  name: string;
  url: string;
  build: {
    number: number;
    phase: string;
    status: JenkinsPipelineStatus;
    url: string;
    fullUrl: string;
    timestamp: number;
    duration?: number;
  };
  parameters?: Record<string, string>;
}

/**
 * Jenkins webhook payload
 */
export interface JenkinsWebhookPayload {
  name: string;
  url: string;
  build: {
    number: number;
    phase: 'STARTED' | 'COMPLETED' | 'FINALIZED';
    status: JenkinsPipelineStatus;
    url: string;
    full_url: string;
    timestamp: number;
    duration?: number;
    parameters?: Record<string, unknown>;
    log?: string;
    artifacts?: {
      fileName: string;
      relativePath: string;
    }[];
  };
}

/**
 * Jenkins listener configuration
 */
export interface JenkinsListenerConfig {
  /** Port for webhook server */
  port: number;
  /** Secret token for webhook validation */
  secret?: string;
  /** Allowed IP addresses (whitelist) */
  allowedIPs?: string[];
  /** Jenkins URL for API polling */
  jenkinsUrl?: string;
  /** Jenkins API token */
  apiToken?: string;
  /** Jenkins username */
  username?: string;
  /** Polling interval in milliseconds */
  pollingInterval?: number;
  /** Jobs to monitor */
  jobs?: string[];
  /** Auto-trigger testing on success */
  autoTest?: boolean;
  /** Test command to run */
  testCommand?: string;
}

/**
 * Jenkins API job info
 */
export interface JenkinsJobInfo {
  _class: string;
  name: string;
  url: string;
  buildable: boolean;
  builds: Array<{
    number: number;
    url: string;
  }>;
  lastBuild?: {
    number: number;
    url: string;
  };
  lastCompletedBuild?: {
    number: number;
    url: string;
  };
  lastSuccessfulBuild?: {
    number: number;
    url: string;
  };
}

/**
 * Jenkins API build info
 */
export interface JenkinsBuildInfo {
  _class: string;
  number: number;
  url: string;
  result: JenkinsPipelineStatus | null;
  timestamp: number;
  duration: number;
  building: boolean;
  description?: string;
  displayName: string;
  fullDisplayName: string;
  id: string;
  queueId: number;
  actions: unknown[];
}

/**
 * Event handler for Jenkins events
 */
export type JenkinsEventHandler = (event: JenkinsBuildResult) => void | Promise<void>;

/**
 * Jenkins listener options
 */
export interface JenkinsListenerOptions {
  config: JenkinsListenerConfig;
  onBuildComplete?: JenkinsEventHandler;
  onBuildSuccess?: JenkinsEventHandler;
  onBuildFailure?: JenkinsEventHandler;
  onBuildUnstable?: JenkinsEventHandler;
}
