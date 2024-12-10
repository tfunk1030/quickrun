import { UserService } from '../../services/user.js';

const isAuthenticated = async (req, res, next) => {
  console.log('isAuthenticated middleware called');
  console.log('Session:', req.session);
  console.log('Headers:', req.headers);
  if (req.session && req.session.userId) {
    try {
      const user = await UserService.get(req.session.userId);
      if (!user) {
        console.log('User not found for session userId:', req.session.userId);
        return res.status(401).json({ error: 'Authentication required' });
      }
      req.user = user;
      console.log('User authenticated:', user.id);
      next();
    } catch (error) {
      console.error('Error during user authentication:', error);
      return res.status(500).json({ error: 'Internal server error during authentication' });
    }
  } else {
    console.log('No session or userId in session');
    return res.status(401).json({ error: 'Authentication required' });
  }
};

export const authenticateWithToken = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (authHeader) {
    const m = authHeader.match(/^(Token|Bearer) (.+)/i);
    if (m) {
      try {
        const user = await UserService.authenticateWithToken(m[2]);
        req.user = user;
        next();
      } catch (err) {
        console.error('Error during authentication with token:', err.message);
        console.error(err.stack);
        next(err);
      }
      return;
    }
  }

  next();
};

export const requireUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  next();
};

export { isAuthenticated };