const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './config.env' });

async function testLogin() {
  try {
    console.log('🔍 Testing Login Functionality...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
    
    // Find the second user
    const user = await User.findOne({ email: 'sddwivedi798@gmail.com' }).select('+password');
    
    if (!user) {
      console.log('❌ User not found: sddwivedi798@gmail.com');
      console.log('\n📋 Available users:');
      const allUsers = await User.find().select('-password');
      allUsers.forEach(u => {
        console.log(`- ${u.username} (${u.email})`);
      });
      return;
    }
    
    console.log('✅ User found:', user.username);
    console.log('📧 Email:', user.email);
    console.log('📅 Created:', user.createdAt.toLocaleDateString());
    
    // Test password (you'll need to provide the actual password)
    console.log('\n🔐 To test login, you need to provide the password you used when signing up.');
    console.log('💡 If you forgot the password, you can:');
    console.log('1. Create a new account using signup');
    console.log('2. Use the demo account: demo@example.com / password');
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testLogin(); 