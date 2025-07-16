const mongoose = require('mongoose');
const User = require('./models/User');
const Todo = require('./models/Todo');
require('dotenv').config({ path: './config.env' });

async function checkDatabase() {
  try {
    console.log('🔍 Checking MongoDB Atlas Database...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
    
    // Check users
    const users = await User.find().select('-password');
    console.log('\n👥 Users in database:');
    console.log(`Total users: ${users.length}`);
    users.forEach(user => {
      console.log(`- ${user.username} (${user.email}) - Created: ${user.createdAt.toLocaleDateString()}`);
    });
    
    // Check todos
    const todos = await Todo.find().populate('user', 'username');
    console.log('\n📝 Todos in database:');
    console.log(`Total todos: ${todos.length}`);
    todos.forEach(todo => {
      console.log(`- [${todo.completed ? '✅' : '⏳'}] ${todo.text} (User: ${todo.user.username})`);
    });
    
    // Check database stats
    const userCount = await User.countDocuments();
    const todoCount = await Todo.countDocuments();
    const completedTodos = await Todo.countDocuments({ completed: true });
    const pendingTodos = await Todo.countDocuments({ completed: false });
    
    console.log('\n📊 Database Statistics:');
    console.log(`- Users: ${userCount}`);
    console.log(`- Total Todos: ${todoCount}`);
    console.log(`- Completed Todos: ${completedTodos}`);
    console.log(`- Pending Todos: ${pendingTodos}`);
    
    await mongoose.connection.close();
    console.log('\n✅ Database check completed successfully!');
    
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  }
}

checkDatabase(); 