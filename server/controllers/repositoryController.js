import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
import { logger } from '../utils/log.js';
import { saveRepositoryData, loadRepositoryData } from '../utils/storage.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

dotenv.config();

const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });
const log = logger('repositoryController');
const execAsync = promisify(exec);

let repositoryStore = new Map();
let io;

// Load data when the server starts
loadRepositoryData().then(data => {
  repositoryStore = new Map(Object.entries(data));
});

import('../server.js').then(module => {
  io = module.io;
});

export const searchRepositories = async (req, res) => {
  try {
    const { query } = req.query;
    log.info("Received search request with query:", query);
    if (!query) {
      log.warn("Search query is missing");
      return res.status(400).json({ error: 'Search query is required' });
    }

    log.info("Sending request to GitHub API");
    const { data } = await octokit.search.repos({
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: 10,
    });
    log.info("Received response from GitHub API:", data);

    const repositories = data.items.map(repo => {
      const existingRepo = repositoryStore.get(repo.id.toString());
      const repoData = existingRepo || {
        id: repo.id.toString(),
        url: repo.html_url,
        name: repo.name,
        language: repo.language,
        status: 'Not started',
        buildLogs: []
      };
      repositoryStore.set(repoData.id, repoData);
      return repoData;
    });

    await saveRepositoryData(Object.fromEntries(repositoryStore));

    log.info("Sending response to frontend:", repositories);
    res.json(repositories);
  } catch (error) {
    log.error('Error searching repositories:', error);
    res.status(500).json({ error: 'Failed to search repositories' });
  }
};

export const buildRepository = async (req, res) => {
  try {
    const { id } = req.params;
    const repository = repositoryStore.get(id);
    if (!repository) {
      return res.status(404).json({ success: false, message: 'Repository not found' });
    }

    repository.status = 'building';
    repository.buildLogs = [];

    // Use a temporary directory that works on both Unix and Windows
    const tempDir = path.join(os.tmpdir(), `repo-${id}`);

    // Clone the repository
    try {
      await execAsync(`git clone ${repository.url} "${tempDir}"`);
      repository.buildLogs.push("Repository cloned successfully");
    } catch (cloneError) {
      throw new Error(`Failed to clone repository: ${cloneError.message}`);
    }

    // Check if package.json exists
    const hasPackageJson = await fs.access(path.join(tempDir, 'package.json'))
      .then(() => true)
      .catch(() => false);

    if (hasPackageJson) {
      // Install dependencies
      try {
        await execAsync(`cd "${tempDir}" && npm install`);
        repository.buildLogs.push("Dependencies installed successfully");
      } catch (installError) {
        throw new Error(`Failed to install dependencies: ${installError.message}`);
      }

      // Run build script if it exists
      try {
        await execAsync(`cd "${tempDir}" && npm run build`);
        repository.buildLogs.push("Build completed successfully");
      } catch (buildError) {
        repository.buildLogs.push("No build script found or build failed");
      }
    } else {
      repository.buildLogs.push("No package.json found, skipping npm install and build");
    }

    repository.status = 'ready';
    repositoryStore.set(repository.id, repository);
    await saveRepositoryData(Object.fromEntries(repositoryStore));

    log.info(`Repository ${id} built successfully`);
    res.json({ success: true, message: "Repository built successfully", logs: repository.buildLogs });
  } catch (error) {
    console.error('Error building repository:', error);
    res.status(500).json({ success: false, message: 'Failed to build repository', error: error.message });
  }
};

export const getRepository = async (req, res) => {
  try {
    const { id } = req.params;
    log.info(`Fetching repository with id: ${id}`);
    console.log("Current repository store:", repositoryStore);

    const repository = repositoryStore.get(id) || null;

    if (!repository) {
      return res.status(404).json({ error: 'Repository not found' });
    }

    log.info(`Repository fetched successfully: ${JSON.stringify(repository)}`);
    res.json(repository);
  } catch (error) {
    log.error('Error fetching repository:', error);
    res.status(500).json({ error: 'Failed to fetch repository' });
  }
};

export const runRepository = async (req, res) => {
  try {
    const { id } = req.params;
    const repository = repositoryStore.get(id);

    if (!repository) {
      return res.status(404).json({ success: false, error: 'Repository not found' });
    }

    if (repository.status !== 'ready') {
      return res.status(400).json({ success: false, error: 'Repository is not ready to run' });
    }

    // Simulate running the repository
    const logs = ['Starting application...', 'Application running on port 3000'];

    // Simulate a random error (for testing purposes)
    if (Math.random() < 0.3) {
      throw new Error('Simulated run failure');
    }

    // Emit logs in real-time
    logs.forEach((log, index) => {
      setTimeout(() => {
        if (io) {
          io.emit(`repository:${id}:log`, log);
        }
      }, index * 1000);
    });

    repository.status = 'running';
    repositoryStore.set(id, repository);
    await saveRepositoryData(Object.fromEntries(repositoryStore));

    log.info(`Repository ${id} run successfully`);
    res.json({ success: true, message: 'Repository started running' });
  } catch (error) {
    log.error('Error running repository:', error);
    const errorMessage = error.message || 'Failed to run repository';
    res.status(500).json({ success: false, error: errorMessage });
  }
};