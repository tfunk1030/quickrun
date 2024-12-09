import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // schema definition here
});

const User = mongoose.model('User', userSchema);

export { User };