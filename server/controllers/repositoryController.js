import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/log.js';

dotenv.config();

const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });
const log = logger('repositoryController');

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

    const repositories = data.items.map(repo => ({
      id: repo.id.toString(),
      url: repo.html_url,
      name: repo.name,
      language: repo.language,
      status: 'pending',
    }));

    log.info("Sending response to frontend:", repositories);
    res.json(repositories);
  } catch (error) {
    log.error('Error searching repositories:', error);
    res.status(500).json({ error: 'Failed to search repositories' });
  }
};

export const buildRepository = async (req, res) => {
  try {
    const { url } = req.body;
    log.info(`Received build request for repository: ${url}`);

    if (!url) {
      log.warn('Repository URL is missing');
      return res.status(400).json({ error: 'Repository URL is required' });
    }

    // Extract owner and repo from the GitHub URL
    const urlParts = url.split('/');
    const owner = urlParts[urlParts.length - 2];
    const repo = urlParts[urlParts.length - 1];

    // Fetch repository information from GitHub
    const { data: repoData } = await octokit.repos.get({ owner, repo });

    // Create a build object
    const build = {
      id: uuidv4(),
      url: repoData.html_url,
      name: repoData.name,
      language: repoData.language,
      status: 'pending',
      buildLogs: [],
    };

    // In a real-world scenario, you would start an async build process here
    // For now, we'll just return the initial build object
    log.info(`Build initiated for repository: ${build.name}`);
    res.status(200).json(build);
  } catch (error) {
    log.error('Error initiating repository build:', error);
    res.status(500).json({ error: 'Failed to initiate repository build' });
  }
};