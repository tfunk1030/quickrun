import express from 'express';
import { UserService } from '../services/user.js';
import { requireUser } from './middleware/auth.js';
import { logger } from '../utils/log.js';

const router = express.Router();
const log = logger('api/routes/authRoutes');

router.post('/login', async (req, res) => {
  console.log('Login attempt received for email:', req.body.email);
  console.log('Request body:', req.body);
  const sendError = msg => {
    console.log('Sending error response:', msg);
    res.status(400).json({ error: msg });
  };
  const { email, password } = req.body;

  if (!email || !password) {
    console.log('Missing email or password');
    return sendError('Email and password are required');
  }

  try {
    const user = await UserService.authenticateWithPassword(email, password);

    if (user) {
      req.session.userId = user._id;
      console.log('User authenticated, session created with userId:', req.session.userId);
      return res.json({ success: true, message: 'Logged in successfully', token: user.token });
    } else {
      console.log('Authentication failed for email:', email);
      return sendError('Email or password is incorrect');
    }
  } catch (error) {
    console.error('Error during login:', error);
    return sendError('An error occurred during login');
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.createUser({ email, password });
    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.message === 'User with this email already exists') {
      return res.status(409).json({ error: 'Email already in use' });
    }
    res.status(400).json({ error: 'Registration failed' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error during session destruction:', err);
      return res.status(500).json({ success: false, message: 'Error logging out' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

router.all('/api/auth/logout', async (req, res) => {
  if (req.user) {
    await UserService.regenerateToken(req.user);
  }
  return res.status(204).send();
});

router.get('/me', requireUser, async (req, res) => {
  return res.status(200).json(req.user);
});

// Temporary route for updating user password
router.post('/update-password', async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    await UserService.updateUserPassword(email, newPassword);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/user-count', async (req, res) => {
  try {
    const count = await UserService.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error getting user count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;