import { UserService } from '../../services/user.js';

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