import express from 'express';
const router = express.Router();
import { searchRepositories } from '../controllers/repositoryController.js';

router.get('/search', (req, res, next) => {
  console.log("Received request to /api/repositories/search");
  next();
}, searchRepositories);

export default router;