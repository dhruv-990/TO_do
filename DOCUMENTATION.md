# Todo List Application - Complete Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Database Setup](#database-setup)
4. [API Documentation](#api-documentation)
5. [Frontend Documentation](#frontend-documentation)
6. [Authentication System](#authentication-system)
7. [Deployment Guide](#deployment-guide)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

A full-stack todo list application built with Express.js, MongoDB Atlas, and modern frontend technologies. Features user authentication, persistent data storage, and a responsive UI.

### **Key Features**
- ✅ User authentication with JWT tokens
- ✅ MongoDB Atlas cloud database
- ✅ Real-time todo management
- ✅ Responsive modern UI
- ✅ User-specific data isolation
- ✅ RESTful API architecture

---

## 🏗️ Architecture

### **Technology Stack**
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (Cloud)
- **Authentication**: JWT, bcryptjs
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Styling**: Custom CSS with modern design patterns

### **Project Structure**
```
todo-list-app/
├── server.js              # Main Express server
├── server-memory.js       # In-memory version (no database)
├── package.json           # Dependencies and scripts
├── config.env             # Environment variables
├── models/                # Database models
│   ├── User.js           # User schema and methods
│   └── Todo.js           # Todo schema and methods
├── utils/                 # Utility functions
│   ├── database.js       # Database connection
│   ├── seeder.js         # Database seeding
│   └── test-connection.js # Connection testing
├── public/                # Frontend files
│   ├── index.html        # Main application
│   ├── login.html        # Login page
│   ├── signup.html       # Signup page
│   ├── styles.css        # Main styles
│   ├── auth.css          # Authentication styles
│   ├── script.js         # Main JavaScript
│   └── auth.js           # Authentication JavaScript
└── docs/                  # Documentation
    ├── DATABASE_SETUP.md # Database setup guide
    └── API_REFERENCE.md  # API documentation
```

---

## 🗄️ Database Setup

### **Database Configuration**

#### **Environment Variables (`config.env`)**
```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todo_app?retryWrites=true&w=majority&appName=AppName

# JWT Secret (change in production)
JWT_SECRET=your-secret-key-change-in-production

# Server Configuration
PORT=3000
NODE_ENV=development
```

#### **Connection String Format**
```
mongodb+srv://[username]:[password]@[cluster-url]/[database-name]?retryWrites=true&w=majority&appName=[app-name]
```

### **Database Models**

#### **User Model (`models/User.js`)**
```javascript
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});
```

#### **Todo Model (`models/Todo.js`)**
```javascript
const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Todo text is required'],
    trim: true,
    maxlength: [200, 'Todo text cannot exceed 200 characters']
  },
  completed: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Todo must belong to a user']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date,
    default: null
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
```

### **Database Connection (`utils/database.js`)**
```javascript
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔄 MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};
```

### **Database Seeding (`utils/seeder.js`)**
```javascript
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Todo.deleteMany();
    
    // Create demo user
    const demoUser = await User.create({
      username: 'demo',
      email: 'demo@example.com',
      password: 'password'
    });

    // Create sample todos
    const sampleTodos = [
      {
        text: 'Learn Express.js',
        completed: false,
        user: demoUser._id,
        priority: 'high',
        tags: ['learning', 'backend']
      },
      // ... more todos
    ];

    await Todo.insertMany(sampleTodos);
    console.log('✅ Database seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
};
```

---

## 🔌 API Documentation

### **Authentication Endpoints**

#### **POST `/api/auth/signup`**
Creates a new user account.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "string",
    "email": "string"
  }
}
```

#### **POST `/api/auth/login`**
Authenticates a user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "string",
    "email": "string"
  }
}
```

### **Todo Endpoints (Require Authentication)**

#### **GET `/api/todos`**
Returns all todos for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "_id": "todo_id",
    "text": "Todo text",
    "completed": false,
    "user": "user_id",
    "priority": "medium",
    "dueDate": null,
    "tags": ["tag1", "tag2"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### **POST `/api/todos`**
Creates a new todo for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "text": "Todo description"
}
```

#### **PUT `/api/todos/:id`**
Updates a todo for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "text": "Updated text",
  "completed": true
}
```

#### **DELETE `/api/todos/:id`**
Deletes a specific todo for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

#### **DELETE `/api/todos`**
Deletes all completed todos for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

---

## 🔐 Authentication System

### **JWT Token Structure**
```javascript
const token = jwt.sign(
  { userId: user._id, username: user.username }, 
  JWT_SECRET, 
  { expiresIn: '24h' }
);
```

### **Password Hashing**
```javascript
// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Check password
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
```

### **Authentication Middleware**
```javascript
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(403).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};
```

---

## 🚀 Deployment Guide

### **Environment Setup**
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `config.env.example` to `config.env`
   - Update MongoDB connection string
   - Set JWT secret

3. **Seed the database:**
   ```bash
   npm run seed
   ```

4. **Start the application:**
   ```bash
   npm start
   ```

### **Production Considerations**
- Use strong JWT secrets
- Enable MongoDB Atlas authentication
- Use SSL/TLS connections
- Set up proper CORS configuration
- Implement rate limiting
- Add input validation
- Set up monitoring and logging

---

## 🛠️ Troubleshooting

### **Common Database Issues**

#### **Connection Errors**
```
Error: connect ECONNREFUSED
```
**Solution:** Check MongoDB Atlas network access settings

#### **Authentication Errors**
```
Error: bad auth : authentication failed
```
**Solution:** Verify username/password in connection string

#### **Port Conflicts**
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:** Kill existing process or change port

### **Testing Commands**

#### **Test Database Connection**
```bash
node test-connection.js
```

#### **Check Database Contents**
```bash
node check-database.js
```

#### **Seed Database**
```bash
npm run seed
```

### **Debugging Tools**

#### **MongoDB Compass**
- Download from MongoDB website
- Connect using your connection string
- Browse collections and documents

#### **MongoDB Shell**
```bash
mongosh "your_connection_string"
```

---

## 📊 Database Statistics

### **Current Database Status**
- **Connection**: ✅ Active
- **Users**: 2 (including demo user)
- **Todos**: 5 (with 1 completed)
- **Storage**: ✅ Persistent

### **Performance Indexes**
```javascript
// Todo indexes for better performance
todoSchema.index({ user: 1, completed: 1 });
todoSchema.index({ user: 1, createdAt: -1 });
```

### **Data Validation**
- Username: 3-30 characters, unique
- Email: Valid email format, unique
- Password: Minimum 6 characters, hashed
- Todo text: Maximum 200 characters
- Tags: Maximum 20 characters each

---

## 🔄 Version Control

### **Git Commands**
```bash
# Initialize repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Add database integration"

# Push to remote
git push origin main
```

### **Important Files to Track**
- `server.js` - Main application
- `models/` - Database models
- `utils/` - Utility functions
- `public/` - Frontend files
- `config.env` - Environment variables
- `package.json` - Dependencies

### **Files to Ignore**
- `node_modules/` - Dependencies
- `.env` - Sensitive data
- `*.log` - Log files
- `.DS_Store` - System files

---

## 📝 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Last Updated:** January 2024
**Version:** 1.0.0
**Database:** MongoDB Atlas
**Authentication:** JWT + bcrypt 