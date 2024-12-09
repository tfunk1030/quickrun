import express from 'express';
const router = express.Router();
import { searchRepositories, buildRepository } from '../controllers/repositoryController.js';

router.get('/search', (req, res, next) => {
  console.log("Received request to /api/repositories/search");
  next();
}, searchRepositories);

router.post('/build', (req, res, next) => {
  console.log("Received request to /api/repositories/build");
  next();
}, buildRepository);

export default router;