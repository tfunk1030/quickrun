import { UserService } from '../services/user.js';
import { connectDB } from '../server.js'; // Assuming you have a separate function for DB connection

async function addTestUser() {
  await connectDB();
  try {
    const testUser = await UserService.createUser({
      email: 'test@example.com',
      password: 'testpassword',
      name: 'Test User'
    });
    console.log('Test user created:', testUser);
  } catch (error) {
    console.error('Error creating test user:', error);
  }
  process.exit();
}

addTestUser();