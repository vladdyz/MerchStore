const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    console.log("test");
    try {
        await mongoose.connect(process.env.MONGO);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

testConnection();