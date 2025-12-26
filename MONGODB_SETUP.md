# MongoDB Backend Setup Guide

This guide shows how to set up a Node.js/Express backend server to handle tasks storage with MongoDB.

---

## 📋 Prerequisites

Before starting, make sure you have:
- **Node.js** (v14+) installed
- **MongoDB** (local or Atlas cloud database)
- **npm** or **yarn**

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Backend Directory

```bash
mkdir tasks-backend
cd tasks-backend
npm init -y
```

### Step 2: Install Dependencies

```bash
npm install express mongoose cors dotenv
npm install --save-dev nodemon
```

### Step 3: Create `.env` File

Create a file named `.env` in the `tasks-backend` directory:

```env
MONGODB_URI=mongodb://localhost:27017/tasks-db
PORT=5000
NODE_ENV=development
```

**For MongoDB Atlas Cloud:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tasks-db?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

### Step 4: Create `server.js`

Create a file named `server.js`:

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Define Task Schema
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Email', 'File Upload', 'Message', 'Other'],
        default: 'Other',
    },
    desc: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create Task Model
const Task = mongoose.model('Task', taskSchema);

// API Routes

// GET all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: 1 });
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// POST new tasks (replace all)
app.post('/api/tasks', async (req, res) => {
    try {
        const tasksArray = req.body;
        
        // Clear existing tasks
        await Task.deleteMany({});
        
        // Insert new tasks
        if (Array.isArray(tasksArray) && tasksArray.length > 0) {
            const insertedTasks = await Task.insertMany(tasksArray);
            res.json({
                success: true,
                message: `Saved ${insertedTasks.length} tasks`,
                tasks: insertedTasks
            });
        } else {
            res.json({
                success: true,
                message: 'No tasks to save',
                tasks: []
            });
        }
    } catch (error) {
        console.error('Error saving tasks:', error);
        res.status(500).json({ error: 'Failed to save tasks' });
    }
});

// POST single task
app.post('/api/tasks/add', async (req, res) => {
    try {
        const newTask = new Task(req.body);
        const savedTask = await newTask.save();
        res.json({ success: true, task: savedTask });
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ error: 'Failed to add task' });
    }
});

// DELETE all tasks
app.delete('/api/tasks', async (req, res) => {
    try {
        const result = await Task.deleteMany({});
        res.json({
            success: true,
            message: `Deleted ${result.deletedCount} tasks`
        });
    } catch (error) {
        console.error('Error deleting tasks:', error);
        res.status(500).json({ error: 'Failed to delete tasks' });
    }
});

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date() });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 MongoDB: ${process.env.MONGODB_URI}`);
});
```

### Step 5: Update `package.json` Scripts

Add this to your `package.json`:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### Step 6: Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

---

## 📱 How It Works

### Frontend (tasks.js) ↔ Backend (server.js) ↔ MongoDB

```
┌─────────────────────┐
│   tasks.html/js     │
│  (Your Dashboard)   │
└──────────┬──────────┘
           │ Fetch API
           ↓
┌──────────────────────────┐
│  server.js (Express)     │
│  localhost:5000          │
└──────────┬───────────────┘
           │ Mongoose
           ↓
┌──────────────────────────┐
│     MongoDB Database     │
│  (Your Task Collection)  │
└──────────────────────────┘
```

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| **GET** | `/api/tasks` | Load all tasks from MongoDB |
| **POST** | `/api/tasks` | Save all tasks to MongoDB |
| **POST** | `/api/tasks/add` | Add single task to MongoDB |
| **DELETE** | `/api/tasks` | Delete all tasks from MongoDB |
| **GET** | `/health` | Check if server is running |

---

## 🔧 Configuration Options

### Use Local MongoDB

```bash
# Start MongoDB service (if installed locally)
mongod

# Then start your server
npm run dev
```

### Use MongoDB Atlas (Cloud)

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Add to `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tasks-db?retryWrites=true&w=majority
```

---

## ✅ Testing the API

### Using cURL

```bash
# Get all tasks
curl http://localhost:5000/api/tasks

# Add tasks
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '[{"title":"Task 1","type":"Email","desc":"Description"}]'

# Health check
curl http://localhost:5000/health
```

### Using Postman

1. Import these requests in Postman:

**GET All Tasks**
```
GET http://localhost:5000/api/tasks
```

**POST Tasks**
```
POST http://localhost:5000/api/tasks
Body (JSON):
[
  {
    "title": "Send Report",
    "type": "Email",
    "desc": "Send Q4 report to management"
  },
  {
    "title": "Update Files",
    "type": "File Upload",
    "desc": "Upload latest documents"
  }
]
```

---

## 🐛 Troubleshooting

### Connection Failed to localhost:5000
- Is the server running? (`npm run dev`)
- Is port 5000 in use? Try different port in `.env`
- Check firewall settings

### MongoDB Connection Error
- **Local:** Is `mongod` service running?
- **Atlas:** Check connection string in `.env`
- **Network:** Check IP whitelist in Atlas (allow 0.0.0.0/0)

### Tasks Not Saving
- Check browser console for errors (F12)
- Check server console for error messages
- Verify MongoDB is connected (`✅ Connected to MongoDB`)

### CORS Error
- Already configured in `server.js`
- If still issues, update CORS:
```javascript
app.use(cors({
  origin: 'http://localhost:8000',
  credentials: true
}));
```

---

## 🚀 Advanced Options

### Add Authentication

```javascript
// Example: Simple API Key
const API_KEY = process.env.API_KEY || 'your-secret-key';

app.use((req, res, next) => {
    const key = req.headers['x-api-key'];
    if (key !== API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
});
```

### Add Request Logging

```javascript
const morgan = require('morgan');
app.use(morgan('dev'));
```

### Add Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

---

## 📊 Database Schema

Tasks stored in MongoDB:

```javascript
{
  _id: ObjectId,
  title: "Send quarterly report",
  type: "Email",
  desc: "Send Q4 report to management team",
  createdAt: ISODate("2024-12-26T10:30:00.000Z")
}
```

---

## 🔄 Updating Frontend

The frontend (`tasks.js`) is already configured to use:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

All tasks now:
- ✅ Load from MongoDB on page open
- ✅ Save to MongoDB on each change
- ✅ Persist across browser sessions
- ✅ Are accessible from any device

---

## 📦 Complete Project Structure

```
tasks-backend/
├── server.js           # Express server
├── package.json        # Dependencies
├── .env               # Configuration (don't commit!)
└── .gitignore         # Ignore node_modules, .env
```

Add to `.gitignore`:
```
node_modules/
.env
.env.local
*.log
```

---

## 🎯 Next Steps

1. ✅ Install Node.js & npm
2. ✅ Create backend directory
3. ✅ Install dependencies
4. ✅ Create `.env` and `server.js`
5. ✅ Start server (`npm run dev`)
6. ✅ Test endpoints
7. ✅ Open tasks.html in browser
8. ✅ Add/save tasks to MongoDB

---

## 📚 Resources

- **Express.js:** [expressjs.com](https://expressjs.com)
- **Mongoose:** [mongoosejs.com](https://mongoosejs.com)
- **MongoDB:** [mongodb.com](https://mongodb.com)
- **REST API:** [restfulapi.net](https://restfulapi.net)

---

## ✨ Features Enabled

With this backend setup, you now have:

- ✅ **Persistent Storage** - Tasks saved to database
- ✅ **Multi-Device Sync** - Access from any device
- ✅ **Scalability** - Handle thousands of tasks
- ✅ **Backup** - All data in MongoDB
- ✅ **API Access** - Integrate with other apps
- ✅ **Real-time** - Automatic sync on save

---

**Status:** ✅ Ready to Deploy!

Start your backend server and enjoy MongoDB-powered task management! 🚀
