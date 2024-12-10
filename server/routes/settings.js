import express from 'express';
import { updateSettings } from '../controllers/settingsController.js';
import { isAuthenticated } from './middleware/auth.js';

const router = express.Router();

// Middleware to log the request
router.use((req, res, next) => {
  console.log(`[Settings Route] ${req.method} ${req.originalUrl}`);
  next();
});

router.put('/', isAuthenticated, async (req, res) => {
  console.log('Settings route accessed'); // New log
  console.log('Request body:', req.body); // New log
  console.log('User from request:', req.user); // New log
  try {
    console.log('Updating user settings');
    await updateSettings(req, res);
  } catch (error) {
    console.error('Error in settings route:', error.message);
    console.error(error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;