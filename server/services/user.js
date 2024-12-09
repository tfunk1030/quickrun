import { randomUUID } from 'crypto';

import { User } from '../models/user.js'; // Corrected import statement
import { generatePasswordHash, validatePassword } from '../utils/password.js';

class UserService {
  static async list() {
    try {
      return User.find();
    } catch (err) {
      console.error('Error listing users:', err.message);
      console.error(err.stack);
      throw `Database error while listing users: ${err}`;
    }
  }

  static async get(id) {
    try {
      return User.findOne({ _id: id }).exec();
    } catch (err) {
      console.error(`Error getting user by ID ${id}:`, err.message);
      console.error(err.stack);
      throw `Database error while getting the user by their ID: ${err}`;
    }
  }

  static async getByEmail(email) {
    try {
      return User.findOne({ email }).exec();
    } catch (err) {
      console.error(`Error getting user by email ${email}:`, err.message);
      console.error(err.stack);
      throw `Database error while getting the user by their email: ${err}`;
    }
  }

  static async update(id, data) {
    try {
      return User.findOneAndUpdate({ _id: id }, data, { new: true, upsert: false });
    } catch (err) {
      console.error(`Error updating user ${id}:`, err.message);
      console.error(err.stack);
      throw `Database error while updating user ${id}: ${err}`;
    }
  }

  static async delete(id) {
    try {
      const result = await User.deleteOne({ _id: id }).exec();
      return (result.deletedCount === 1);
    } catch (err) {
      console.error(`Error deleting user ${id}:`, err.message);
      console.error(err.stack);
      throw `Database error while deleting user ${id}: ${err}`;
    }
  }

  static async authenticateWithPassword(email, password) {
    if (!email) throw 'Email is required';
    if (!password) throw 'Password is required';

    try {
      const user = await User.findOne({email}).exec();
      if (!user) return null;

      const passwordValid = await validatePassword(password, user.password);
      if (!passwordValid) return null;

      user.lastLoginAt = Date.now();
      const updatedUser = await user.save();
      return updatedUser;
    } catch (err) {
      console.error(`Error authenticating user ${email} with password:`, err.message);
      console.error(err.stack);
      throw `Database error while authenticating user ${email} with password: ${err}`;
    }
  }

  static async authenticateWithToken(token) {
    try {
      return User.findOne({ token }).exec();
    } catch (err) {
      console.error(`Error authenticating user with token:`, err.message);
      console.error(err.stack);
      throw `Database error while authenticating user with token: ${err}`;
    }
  }

  static async regenerateToken(user) {
    user.token = randomUUID(); // eslint-disable-line

    try {
      if (!user.isNew) {
        await user.save();
      }

      return user;
    } catch (err) {
      console.error(`Error generating user token:`, err.message);
      console.error(err.stack);
      throw `Database error while generating user token: ${err}`;
    }
  }

  static async createUser({ email, password, name = '' }) {
    if (!email) throw 'Email is required';
    if (!password) throw 'Password is required';

    const existingUser = await UserService.getByEmail(email);
    if (existingUser) throw 'User with this email already exists';

    const hash = await generatePasswordHash(password);

    try {
      const user = new User({
        email,
        password: hash,
        name,
        token: randomUUID(),
      });

      await user.save();
      return user;
    } catch (err) {
      console.error(`Error creating new user:`, err.message);
      console.error(err.stack);
      throw `Database error while creating new user: ${err}`;
    }
  }

  static async setPassword(user, password) {
    if (!password) throw 'Password is required';
    user.password = await generatePasswordHash(password); // eslint-disable-line

    try {
      if (!user.isNew) {
        await user.save();
      }

      return user;
    } catch (err) {
      console.error(`Error setting user password:`, err.message);
      console.error(err.stack);
      throw `Database error while setting user password: ${err}`;
    }
  }
}

export { UserService };