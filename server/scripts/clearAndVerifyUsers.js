import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function clearAndVerifyUsers() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to database:', mongoose.connection.name);

    const result = await mongoose.connection.db.collection('users').deleteMany({});
    console.log(`Deleted ${result.deletedCount} users`);

    const remainingUsers = await mongoose.connection.db.collection('users').countDocuments();
    console.log(`Remaining users in the database: ${remainingUsers}`);

    if (remainingUsers === 0) {
      console.log("All users have been successfully deleted.");
    } else {
      console.log("Warning: Some users still exist in the database.");
    }
  } catch (error) {
    console.error('Error clearing and verifying users:', error);
  } finally {
    await mongoose.disconnect();
  }
}

clearAndVerifyUsers();