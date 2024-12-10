import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function clearAllUserData() {
  try {
    console.log('DATABASE_URL:', process.env.DATABASE_URL); // Add this line for debugging
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined in the environment variables');
    }
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to database');

    const result = await mongoose.connection.db.collection('users').deleteMany({});
    console.log(`Deleted ${result.deletedCount} users`);
  } catch (error) {
    console.error('Error clearing user data:', error);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

clearAllUserData();