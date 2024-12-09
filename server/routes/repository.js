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

router.get('/:id', (req, res, next) => {
  console.log(`Received request to /api/repositories/${req.params.id}`);
  next();
}, getRepository);

export default router;