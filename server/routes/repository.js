import express from 'express';
const router = express.Router();
import { searchRepositories, buildRepository, getRepository, runRepository } from '../controllers/repositoryController.js';

router.get('/search', (req, res, next) => {
  console.log("Received request to /api/repositories/search");
  next();
}, searchRepositories);

router.post('/:id/build', (req, res, next) => {
  console.log(`Received request to build repository ${req.params.id}`);
  next();
}, buildRepository);

router.get('/:id', (req, res, next) => {
  console.log(`Received request to /api/repositories/${req.params.id}`);
  next();
}, getRepository);

router.post('/:id/run', (req, res, next) => {
  console.log(`Received request to run repository ${req.params.id}`);
  next();
}, runRepository);

export default router;