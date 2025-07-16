# Database Setup Guide

This guide will help you set up MongoDB for your Todo List application.

## 🗄️ MongoDB Installation

### Option 1: MongoDB Community Server (Recommended)

1. **Download MongoDB Community Server**
   - Go to [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Select your operating system and download the installer
   - Follow the installation wizard

2. **Start MongoDB Service**
   - **Windows**: MongoDB should start automatically as a service
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

### Option 2: MongoDB Atlas (Cloud Database)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier
   - Select your preferred provider and region
   - Click "Create"

3. **Set Up Database Access**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create a username and password
   - Select "Read and write to any database"
   - Click "Add User"

4. **Set Up Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## 🔧 Configuration

### 1. Update Environment Variables

Edit `config.env` file:

```env
# For Local MongoDB
MONGODB_URI=mongodb://localhost:27017/todo_app

# For MongoDB Atlas (replace with your connection string)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todo_app

JWT_SECRET=your-secret-key-change-in-production
PORT=3000
NODE_ENV=development
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Seed the Database

```bash
npm run seed
```

This will create:
- A demo user (email: `demo@example.com`, password: `password`)
- Sample todos for the demo user

### 4. Start the Application

```bash
npm start
```

## 📊 Database Structure

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  createdAt: Date,
  lastLogin: Date,
  updatedAt: Date
}
```

### Todos Collection
```javascript
{
  _id: ObjectId,
  text: String,
  completed: Boolean,
  user: ObjectId (reference to User),
  priority: String (low/medium/high),
  dueDate: Date,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔍 Database Operations

### View Data in MongoDB Compass

1. **Install MongoDB Compass** (GUI tool)
   - Download from [MongoDB Compass](https://www.mongodb.com/try/download/compass)

2. **Connect to Database**
   - Open MongoDB Compass
   - Enter connection string: `mongodb://localhost:27017`
   - Click "Connect"

3. **Browse Collections**
   - Select `todo_app` database
   - View `users` and `todos` collections

### MongoDB Shell Commands

```bash
# Connect to MongoDB shell
mongosh

# Switch to database
use todo_app

# View all users
db.users.find()

# View all todos
db.todos.find()

# View todos for specific user
db.todos.find({ user: ObjectId("user_id_here") })

# Count documents
db.users.countDocuments()
db.todos.countDocuments()
```

## 🛠️ Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```
   Error: connect ECONNREFUSED 127.0.0.1:27017
   ```
   **Solution**: Make sure MongoDB service is running

2. **Authentication Error**
   ```
   Error: Authentication failed
   ```
   **Solution**: Check username/password in connection string

3. **Database Not Found**
   ```
   Error: Database todo_app not found
   ```
   **Solution**: The database will be created automatically when you first run the application

### Reset Database

```bash
# Clear all data and reseed
npm run seed
```

### Check MongoDB Status

**Windows:**
```cmd
services.msc
# Look for "MongoDB" service
```

**macOS:**
```bash
brew services list | grep mongodb
```

**Linux:**
```bash
sudo systemctl status mongod
```

## 🚀 Production Considerations

1. **Environment Variables**
   - Use strong JWT secrets
   - Use environment-specific MongoDB URIs
   - Never commit sensitive data

2. **Database Security**
   - Enable authentication
   - Use SSL/TLS connections
   - Restrict network access

3. **Backup Strategy**
   - Regular database backups
   - Test restore procedures

4. **Monitoring**
   - Monitor database performance
   - Set up alerts for errors

## 📈 Performance Tips

1. **Indexes**: The application includes indexes for better performance
2. **Connection Pooling**: Mongoose handles connection pooling automatically
3. **Query Optimization**: Use specific field selection when possible

## 🔐 Security Best Practices

1. **Password Hashing**: Bcrypt with cost factor 12
2. **JWT Tokens**: 24-hour expiration
3. **Input Validation**: Server-side validation for all inputs
4. **SQL Injection Protection**: Mongoose provides built-in protection
5. **CORS**: Configured for cross-origin requests

## 📝 API Endpoints with Database

All endpoints now use the database:

- `POST /api/auth/signup` - Creates user in database
- `POST /api/auth/login` - Authenticates against database
- `GET /api/todos` - Fetches user's todos from database
- `POST /api/todos` - Creates todo in database
- `PUT /api/todos/:id` - Updates todo in database
- `DELETE /api/todos/:id` - Deletes todo from database
- `DELETE /api/todos` - Deletes completed todos from database

The application now has full database persistence with MongoDB! 🎉 