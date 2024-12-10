import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function clearUsers() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    const result = await mongoose.connection.db.collection('users').deleteMany({});
    console.log(`Deleted ${result.deletedCount} users`);
  } catch (error) {
    console.error('Error clearing users:', error);
  } finally {
    await mongoose.disconnect();
  }
}

clearUsers();