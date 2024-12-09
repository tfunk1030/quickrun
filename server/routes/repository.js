import express from 'express';
const router = express.Router();
import { searchRepositories, buildRepository, getRepository } from '../controllers/repositoryController.js';

router.get('/search', (req, res, next) => {
  console.log("Received request to /api/repositories/search");
  next();
}, searchRepositories);

router.post('/build', (req, res, next) => {
  console.log("Received request to /api/repositories/build");
  next();
}, buildRepository);

router.get('/:id', getRepository); // Add this new route

export default router;