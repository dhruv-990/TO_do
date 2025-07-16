const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

console.log('🔍 Testing MongoDB Atlas Connection...');
console.log('📡 Connection String:', process.env.MONGODB_URI);

async function testConnection() {
  try {
    console.log('🔄 Attempting to connect...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`🗄️ Database: ${conn.connection.name}`);
    
    // Test creating a simple document
    const TestModel = mongoose.model('Test', new mongoose.Schema({ name: String }));
    const testDoc = await TestModel.create({ name: 'connection-test' });
    console.log('✅ Successfully created test document:', testDoc);
    
    // Clean up
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('✅ Successfully deleted test document');
    
    await mongoose.connection.close();
    console.log('🔌 Connection closed successfully');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('bad auth')) {
      console.log('\n🔐 Authentication Error - Possible solutions:');
      console.log('1. Check your username and password in MongoDB Atlas');
      console.log('2. Make sure the user has "Read and write to any database" permissions');
      console.log('3. Verify the connection string format');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n🌐 Network Error - Possible solutions:');
      console.log('1. Check your internet connection');
      console.log('2. Make sure you allowed access from anywhere in Network Access');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('\n🚫 Connection Refused - Possible solutions:');
      console.log('1. Check if your IP is whitelisted in MongoDB Atlas');
      console.log('2. Try allowing access from anywhere temporarily');
    }
    
    console.log('\n📋 Troubleshooting Steps:');
    console.log('1. Go to MongoDB Atlas Dashboard');
    console.log('2. Check "Database Access" - verify username/password');
    console.log('3. Check "Network Access" - allow access from anywhere');
    console.log('4. Get a fresh connection string from "Database" → "Connect"');
  }
}

testConnection(); 