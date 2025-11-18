# Jenkins Integration Guide

## Overview

The `ff jenkins` command provides production-ready integration with Jenkins CI/CD pipelines, enabling automatic event listening, webhook handling, and test triggering.

## Features

✅ **Webhook Server** - Express-based server for Jenkins webhooks
✅ **Security** - Token authentication & IP whitelisting
✅ **Auto-Testing** - Trigger tests automatically on successful builds
✅ **Event Handlers** - Custom handlers for success, failure, unstable builds
✅ **API Client** - Polling fallback for environments without webhooks

## Quick Start

### 1. Start Webhook Listener

```bash
ff jenkins listen
```

This will start an interactive setup wizard that guides you through:
- Port configuration
- Secret token setup
- Auto-test configuration
- Test command specification

### 2. Configure Jenkins Webhook

In your Jenkins job configuration:

1. Add **Post-build Actions** → **Notification**
2. Set URL: `http://your-server:9000/webhook/jenkins`
3. Add header: `X-Jenkins-Token: your-secret-token`
4. Select events: **Job Completed**

## Command Reference

### `ff jenkins listen`

Start the webhook listener server.

**Options:**
- `-p, --port <port>` - Webhook server port (default: 9000)
- `-s, --secret <token>` - Secret token for authentication
- `--auto-test` - Auto-trigger tests on successful builds
- `--test-command <command>` - Command to run for tests (e.g., "npm test")
- `-c, --config` - Interactive configuration
- `--debug` - Enable debug mode

**Examples:**

```bash
# Interactive setup
ff jenkins listen --config

# With specific port
ff jenkins listen --port 8080

# With auto-testing
ff jenkins listen --auto-test --test-command "npm run test:integration"

# With authentication
ff jenkins listen --secret "my-secret-token-123"
```

## Security Features

### 1. Token Authentication

Set a secret token that Jenkins must include in webhook requests:

```bash
ff jenkins listen --secret "your-secure-token"
```

Jenkins must send this token in the `X-Jenkins-Token` header or `Authorization: Bearer <token>` header.

### 2. IP Whitelisting

Configure allowed IP addresses in `~/.config/ff-cli/jenkins.json`:

```json
{
  "port": 9000,
  "secret": "your-token",
  "allowedIPs": ["192.168.1.100", "10.0.0.0/24"]
}
```

## Configuration File

Configuration is stored in: `~/.config/ff-cli/jenkins.json`

```json
{
  "port": 9000,
  "secret": "your-secret-token",
  "autoTest": true,
  "testCommand": "npm test",
  "allowedIPs": ["192.168.1.0/24"],
  "jenkinsUrl": "https://jenkins.yourcompany.com",
  "apiToken": "api-token-for-polling",
  "username": "your-jenkins-user"
}
```

## Event Handling

The webhook server automatically handles different build statuses:

- **SUCCESS** ✅ - Build succeeded
- **FAILURE** ❌ - Build failed
- **UNSTABLE** ⚠️ - Build unstable (tests failed but build succeeded)
- **ABORTED** 🛑 - Build was cancelled

## Auto-Testing

When `autoTest` is enabled, the CLI automatically runs your test command when a build succeeds:

```bash
ff jenkins listen --auto-test --test-command "npm run test:e2e"
```

Environment variables available during test execution:
- `JENKINS_BUILD_NUMBER` - Build number
- `JENKINS_JOB_NAME` - Job name
- `JENKINS_BUILD_URL` - Build URL

## Webhook Payload

Jenkins sends this payload structure:

```json
{
  "name": "job-name",
  "url": "https://jenkins/job/job-name/",
  "build": {
    "number": 42,
    "phase": "COMPLETED",
    "status": "SUCCESS",
    "url": "job/job-name/42/",
    "full_url": "https://jenkins/job/job-name/42/",
    "timestamp": 1234567890000,
    "duration": 123456
  }
}
```

## Production Deployment

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start listener
pm2 start "ff jenkins listen --port 9000" --name jenkins-listener

# Save PM2 configuration
pm2 save

# Setup startup script
pm2 startup
```

### Using Docker

```dockerfile
FROM node:18
RUN npm install -g ffontana-cli
EXPOSE 9000
CMD ["ff", "jenkins", "listen", "--port", "9000"]
```

### Using systemd

```ini
[Unit]
Description=Jenkins Webhook Listener
After=network.target

[Service]
Type=simple
User=jenkins-listener
WorkingDirectory=/opt/jenkins-listener
ExecStart=/usr/bin/ff jenkins listen --port 9000
Restart=always

[Install]
WantedBy=multi-user.target
```

## Troubleshooting

### Webhook not receiving events

1. Check firewall rules allow inbound connections on your port
2. Verify Jenkins can reach your server
3. Check authentication token is correct
4. Review Jenkins job notification configuration

### Tests not triggering automatically

1. Verify `autoTest` is `true` in config
2. Check `testCommand` is valid
3. Review logs with `--debug` flag
4. Ensure test command exits with proper status codes

## Best Practices

1. **Use HTTPS in production** - Consider a reverse proxy (nginx, Caddy)
2. **Set strong secret tokens** - Use cryptographically random tokens
3. **Enable IP whitelisting** - Restrict to your Jenkins server IPs
4. **Monitor logs** - Use `--debug` to track all events
5. **Test configuration** - Use `/health` endpoint to verify server is running

## API Reference

### Health Check

```bash
curl http://localhost:9000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": 1234567890000
}
```

### Webhook Endpoint

```bash
POST /webhook/jenkins
Headers:
  X-Jenkins-Token: your-secret-token
  Content-Type: application/json
```

## BBVA Production Checklist

- [ ] Configure secure token authentication
- [ ] Enable IP whitelisting for Jenkins servers
- [ ] Set up HTTPS with reverse proxy
- [ ] Configure systemd service for auto-start
- [ ] Set up logging and monitoring
- [ ] Test webhook with dry-run builds
- [ ] Document emergency shutdown procedure
- [ ] Set up alerts for listener failures
