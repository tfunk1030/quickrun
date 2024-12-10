import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function clearAllUserData() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to database');

    const result = await mongoose.connection.db.collection('users').deleteMany({});
    console.log(`Deleted ${result.deletedCount} users`);

    // Clear any other collections related to user data if they exist
    // For example:
    // await mongoose.connection.db.collection('sessions').deleteMany({});
    // console.log('Cleared all sessions');

    console.log('All user data has been cleared');
  } catch (error) {
    console.error('Error clearing user data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

clearAllUserData();