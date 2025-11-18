import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { detectProject, isFramework } from '../../core/project-detector.js';
import path from 'path';
import fs from 'fs-extra';
import os from 'os';

describe('project-detector', () => {
  let tempDir: string;

  beforeEach(async () => {
    // Create a temporary directory for testing
    tempDir = path.join(os.tmpdir(), `ff-cli-test-${Date.now()}`);
    await fs.ensureDir(tempDir);
  });

  afterEach(async () => {
    // Clean up temporary directory
    await fs.remove(tempDir);
  });

  describe('detectProject', () => {
    it('should detect Next.js project', async () => {
      const packageJson = {
        dependencies: {
          next: '^14.0.0',
          react: '^18.0.0',
        },
      };

      await fs.writeJSON(path.join(tempDir, 'package.json'), packageJson);

      const result = await detectProject(tempDir);

      expect(result.framework).toBe('next');
      expect(result.version).toBe('^14.0.0');
    });

    it('should detect React project (not Next.js)', async () => {
      const packageJson = {
        dependencies: {
          react: '^18.0.0',
        },
      };

      await fs.writeJSON(path.join(tempDir, 'package.json'), packageJson);

      const result = await detectProject(tempDir);

      expect(result.framework).toBe('react');
      expect(result.version).toBe('^18.0.0');
    });

    it('should detect Lit project', async () => {
      const packageJson = {
        dependencies: {
          lit: '^3.0.0',
        },
      };

      await fs.writeJSON(path.join(tempDir, 'package.json'), packageJson);

      const result = await detectProject(tempDir);

      expect(result.framework).toBe('lit');
      expect(result.version).toBe('^3.0.0');
    });

    it('should detect TypeScript when tsconfig.json exists', async () => {
      const packageJson = {
        dependencies: {
          react: '^18.0.0',
        },
      };

      await fs.writeJSON(path.join(tempDir, 'package.json'), packageJson);
      await fs.writeJSON(path.join(tempDir, 'tsconfig.json'), {});

      const result = await detectProject(tempDir);

      expect(result.typescript).toBe(true);
    });

    it('should detect TypeScript from dependencies', async () => {
      const packageJson = {
        dependencies: {
          react: '^18.0.0',
        },
        devDependencies: {
          typescript: '^5.0.0',
        },
      };

      await fs.writeJSON(path.join(tempDir, 'package.json'), packageJson);

      const result = await detectProject(tempDir);

      expect(result.typescript).toBe(true);
    });

    it('should prioritize Next.js over React', async () => {
      const packageJson = {
        dependencies: {
          next: '^14.0.0',
          react: '^18.0.0',
        },
      };

      await fs.writeJSON(path.join(tempDir, 'package.json'), packageJson);

      const result = await detectProject(tempDir);

      // Should detect as Next.js, not React
      expect(result.framework).toBe('next');
    });

    it('should throw error when no package.json found', async () => {
      await expect(detectProject(tempDir)).rejects.toThrow(
        'No package.json found'
      );
    });
  });

  describe('isFramework', () => {
    it('should return true for matching framework', async () => {
      const packageJson = {
        dependencies: {
          react: '^18.0.0',
        },
      };

      await fs.writeJSON(path.join(tempDir, 'package.json'), packageJson);

      const result = await isFramework('react', tempDir);

      expect(result).toBe(true);
    });

    it('should return false for non-matching framework', async () => {
      const packageJson = {
        dependencies: {
          react: '^18.0.0',
        },
      };

      await fs.writeJSON(path.join(tempDir, 'package.json'), packageJson);

      const result = await isFramework('lit', tempDir);

      expect(result).toBe(false);
    });

    it('should return false when no package.json exists', async () => {
      const result = await isFramework('react', tempDir);

      expect(result).toBe(false);
    });
  });
});
