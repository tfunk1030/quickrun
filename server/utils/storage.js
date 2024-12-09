import fs from 'fs/promises';
import path from 'path';

const STORAGE_FILE = path.join(process.cwd(), 'repository_data.json');

export async function saveRepositoryData(data) {
  await fs.writeFile(STORAGE_FILE, JSON.stringify(data, null, 2));
}

export async function loadRepositoryData() {
  try {
    const data = await fs.readFile(STORAGE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {};
    }
    console.error("Error loading repository data:", error);
    throw error;
  }
}