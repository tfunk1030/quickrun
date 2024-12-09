import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
import { logger } from '../utils/log.js';
import { saveRepositoryData, loadRepositoryData } from '../utils/storage.js';

dotenv.config();

const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });
const log = logger('repositoryController');

let repositoryStore = new Map();

// Load data when the server starts
loadRepositoryData().then(data => {
  repositoryStore = new Map(Object.entries(data));
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
    const { id } = req.body;
    log.info(`Received build request for repository: ${id}`);
    console.log("Repository store before build:", repositoryStore);

    // Fetch repository details from GitHub using the numeric ID
    const { data: repoData } = await octokit.request('GET /repositories/{id}', {
      id: id
    });

    let repository = {
      id: repoData.id.toString(),
      url: repoData.html_url,
      name: repoData.name,
      language: repoData.language || 'Unknown',
      status: 'building',
      buildLogs: ['Build started', 'Cloning repository...']
    };

    setTimeout(async () => {
      const buildSteps = [
        { step: 'Cloning repository', success: true },
        { step: 'Installing dependencies', success: true },
        { step: 'Running tests', success: repoData.has_issues }, // Use a real property to determine success
        { step: 'Building project', success: true },
      ];

      let buildSuccess = true;
      for (const step of buildSteps) {
        repository.buildLogs.push(`${step.step}...`);
        if (!step.success) {
          repository.buildLogs.push(`Error: Failed to ${step.step.toLowerCase()}`);
          buildSuccess = false;
          break;
        }
      }

      repository.status = buildSuccess ? 'ready' : 'error';
      if (buildSuccess) {
        repository.buildLogs.push('Build completed successfully');
      }

      log.info(`Build completed for repository: ${JSON.stringify(repository)}`);
      repositoryStore.set(repository.id, repository);
      await saveRepositoryData(Object.fromEntries(repositoryStore));
      console.log("Final repository state before sending response:", repository);
    }, 5000);

    res.json(repository);
  } catch (error) {
    log.error('Error initiating repository build:', error);
    res.status(500).json({ error: 'Failed to initiate repository build' });
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
      return res.status(404).json({ error: 'Repository not found' });
    }

    if (repository.status !== 'ready') {
      return res.status(400).json({ error: 'Repository is not ready to run' });
    }

    // Simulate running the repository
    const logs = ['Starting application...'];

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    logs.push('Application running on port 3000');

    log.info(`Repository ${id} run successfully`);
    res.json({ success: true, logs });
  } catch (error) {
    log.error('Error running repository:', error);
    res.status(500).json({ error: 'Failed to run repository' });
  }
};