import bcrypt from 'bcrypt';
import { logger } from '../utils/log.js';

const log = logger('utils/password');

export const generatePasswordHash = async (password) => {
  log.info('Generating hash for password');
  const saltRounds = 10;
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    log.info(`Generated salt: ${salt}`);
    const hash = await bcrypt.hash(password, salt);
    log.info(`Generated hash: ${hash}`);
    return hash;
  } catch (error) {
    log.error('Error generating password hash:', error.message);
    log.error(error.stack);
    throw error;
  }
};

export const validatePassword = async (password, hash) => {
  log.info('Validating password');
  log.info(`Input password length: ${password ? password.length : 'undefined'}`);
  log.info(`Stored hash length: ${hash ? hash.length : 'undefined'}`);
  try {
    if (!password || !hash) {
      log.info('Password or hash is undefined or empty');
      return false;
    }
    const result = await bcrypt.compare(password, hash);
    log.info(`Password validation result: ${result}`);
    return result;
  } catch (error) {
    log.error('Error validating password:', error.message);
    log.error(error.stack);
    throw error;
  }
};

export const isPasswordHash = (hash) => {
  log.info('Checking password hash format');
  if (!hash || hash.length !== 60) {
    log.info('Invalid password hash format');
    return false;
  }
  try {
    bcrypt.getRounds(hash);
    log.info('Password hash format is valid');
    return true;
  } catch (error) {
    log.error('Error checking password hash format:', error.message);
    log.error(error.stack);
    return false;
  }
};