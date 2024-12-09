import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

dotenv.config();

const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

export const searchRepositories = async (req, res) => {
  try {
    const { query } = req.query;
    console.log("Received search request with query:", query);
    if (!query) {
      console.log("Search query is missing");
      return res.status(400).json({ error: 'Search query is required' });
    }

    console.log("Sending request to GitHub API");
    const { data } = await octokit.search.repos({
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: 10,
    });
    console.log("Received response from GitHub API:", data);

    const repositories = data.items.map(repo => ({
      id: repo.id.toString(),
      url: repo.html_url,
      name: repo.name,
      language: repo.language,
      status: 'pending',
    }));

    console.log("Sending response to frontend:", repositories);
    res.json(repositories);
  } catch (error) {
    console.error('Error searching repositories:', error);
    res.status(500).json({ error: 'Failed to search repositories' });
  }
};