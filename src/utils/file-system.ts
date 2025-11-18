import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

/**
 * Get __dirname equivalent in ES modules
 */
export function getDirname(importMetaUrl: string): string {
  return dirname(fileURLToPath(importMetaUrl));
}

/**
 * Check if a file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a directory exists
 */
export async function dirExists(dirPath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(dirPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Create a directory recursively
 */
export async function ensureDir(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath);
}

/**
 * Copy a file or directory
 */
export async function copy(src: string, dest: string): Promise<void> {
  await fs.copy(src, dest);
}

/**
 * Read a JSON file
 */
export async function readJSON<T = any>(filePath: string): Promise<T> {
  return fs.readJSON(filePath) as Promise<T>;
}

/**
 * Write a JSON file
 */
export async function writeJSON(filePath: string, data: unknown): Promise<void> {
  await fs.writeJSON(filePath, data, { spaces: 2 });
}

/**
 * Read a text file
 */
export async function readFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, 'utf-8');
}

/**
 * Write a text file
 */
export async function writeFile(filePath: string, content: string): Promise<void> {
  await fs.writeFile(filePath, content, 'utf-8');
}

/**
 * Find the nearest file by walking up the directory tree
 */
export async function findUp(filename: string, startDir: string): Promise<string | null> {
  let currentDir = path.resolve(startDir);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const filePath = path.join(currentDir, filename);

    if (await fileExists(filePath)) {
      return filePath;
    }

    const parentDir = path.dirname(currentDir);

    // Reached the root
    if (parentDir === currentDir) {
      return null;
    }

    currentDir = parentDir;
  }
}

/**
 * Get the project root (directory containing package.json)
 */
export async function getProjectRoot(startDir: string = process.cwd()): Promise<string | null> {
  const packageJsonPath = await findUp('package.json', startDir);
  return packageJsonPath ? path.dirname(packageJsonPath) : null;
}

/**
 * Check if a directory is empty
 */
export async function isEmptyDir(dirPath: string): Promise<boolean> {
  if (!(await dirExists(dirPath))) {
    return true;
  }

  const files = await fs.readdir(dirPath);
  return files.length === 0;
}
