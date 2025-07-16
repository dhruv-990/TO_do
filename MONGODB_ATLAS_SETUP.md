# MongoDB Atlas Setup Guide

Since MongoDB is not installed locally, let's use MongoDB Atlas (free cloud database).

## 🚀 Quick Setup (5 minutes)

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" or "Sign Up"
3. Create your account

### Step 2: Create a Free Cluster

1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select your preferred cloud provider (AWS/Google Cloud/Azure)
4. Choose a region close to you
5. Click "Create"

### Step 3: Set Up Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Username: `todoapp`
4. Password: Create a strong password (save it!)
5. Select "Read and write to any database"
6. Click "Add User"

### Step 4: Set Up Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### Step 5: Get Your Connection String

1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. It looks like: `mongodb+srv://ddhruv:<96cWaFJE6vMdImtZ>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### Step 6: Update Your Configuration

Edit `config.env` file:

```env
# Replace with your MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://todoapp:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/todo_app?retryWrites=true&w=majority

JWT_SECRET=your-secret-key-change-in-production
PORT=3000
NODE_ENV=development
```

**Important:** Replace `YOUR_PASSWORD` with the password you created in Step 3.

### Step 7: Seed the Database

```bash
npm run seed
```

### Step 8: Start the Application

```bash
npm start
```

## 🔍 Troubleshooting

### If you get connection errors:

1. **Check your password** - Make sure you replaced `YOUR_PASSWORD` correctly
2. **Check network access** - Make sure you allowed access from anywhere
3. **Check database user** - Make sure the user has read/write permissions

### Common Error Messages:

```
MongoServerError: Authentication failed
```
**Solution:** Check your password in the connection string

```
MongoServerError: Server selection timed out
```
**Solution:** Check your network access settings

```
MongoServerError: User not found
```
**Solution:** Make sure you created the database user correctly

## 🎯 Alternative: Install MongoDB Locally

If you prefer to install MongoDB locally:

### Windows:
1. Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer
3. MongoDB will start as a Windows service automatically

### macOS:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu):
```bash
sudo apt update
sudo apt install mongodb
sudo systemctl start mongod
sudo systemctl enable mongod
```

Then use this connection string in `config.env`:
```env
MONGODB_URI=mongodb://localhost:27017/todo_app
```

## ✅ Verification

After setup, you should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
🚀 Server is running on http://localhost:3000
```

Then visit `http://localhost:3000` in your browser!

## 🆘 Need Help?

If you're still having issues:
1. Check the MongoDB Atlas dashboard for any error messages
2. Make sure your connection string is correct
3. Try the local MongoDB installation instead 