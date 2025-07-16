const mongoose = require('mongoose');
const User = require('../models/User');
const Todo = require('../models/Todo');
require('dotenv').config({ path: './config.env' });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Todo.deleteMany();
    console.log('🗑️ Cleared existing data');

    // Create demo user
    const demoUser = await User.create({
      username: 'demo',
      email: 'demo@example.com',
      password: 'password'
    });
    console.log('👤 Created demo user');

    // Create sample todos for demo user
    const sampleTodos = [
      {
        text: 'Learn Express.js',
        completed: false,
        user: demoUser._id,
        priority: 'high',
        tags: ['learning', 'backend']
      },
      {
        text: 'Build a todo app',
        completed: true,
        user: demoUser._id,
        priority: 'medium',
        tags: ['project', 'frontend']
      },
      {
        text: 'Deploy to production',
        completed: false,
        user: demoUser._id,
        priority: 'high',
        tags: ['deployment']
      },
      {
        text: 'Add database integration',
        completed: false,
        user: demoUser._id,
        priority: 'medium',
        tags: ['database', 'backend']
      },
      {
        text: 'Write documentation',
        completed: false,
        user: demoUser._id,
        priority: 'low',
        tags: ['documentation']
      }
    ];

    await Todo.insertMany(sampleTodos);
    console.log('📝 Created sample todos');

    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${await User.countDocuments()}`);
    console.log(`- Todos: ${await Todo.countDocuments()}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

// Run seeder if this file is executed directly
if (require.main === module) {
  connectDB().then(() => {
    seedData();
  });
}

module.exports = { connectDB, seedData }; 