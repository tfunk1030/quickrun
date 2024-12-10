import { User } from '../models/User.js';

export const updateSettings = async (req, res) => {
  console.log('Updating user settings');
  console.log('Request body:', req.body);
  console.log('Session:', req.session);
  try {
    const { autoRunAfterBuild, darkMode } = req.body;
    const userId = req.session.userId;
    console.log('User ID from session:', userId);

    if (typeof autoRunAfterBuild !== 'boolean' || typeof darkMode !== 'boolean') {
      return res.status(400).json({ error: 'Invalid settings data' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { autoRunAfterBuild, darkMode } },
      { new: true, select: 'autoRunAfterBuild darkMode' }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Settings updated successfully',
      settings: {
        autoRunAfterBuild: updatedUser.autoRunAfterBuild,
        darkMode: updatedUser.darkMode
      }
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};