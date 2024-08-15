
import mongoose from 'mongoose';
//const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Check if the model already exists before defining it again
//export default mongoose?.models.User || mongoose.model('User', userSchema);

let User;

try {
  User = mongoose.model('User'); // Try to get the existing model
} catch (error) {
  User = mongoose.model('User', userSchema); // If not defined, create it
}

module.exports = User;
