# 🗄️ MongoDB Setup & Troubleshooting Guide

## Error: `ESERVFAIL _mongodb._tcp.cluster0.frqdah4.mongodb.net`

This DNS resolution error means your server cannot reach MongoDB Atlas. Follow these steps to fix it.

---

## ✅ Solution Checklist

### 1. **Verify Connection String Format**

Your `.env` file should have:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
PORT=5000
```

**Check these points:**
- ✓ Username and password are correct (URL encoded if they contain special characters)
- ✓ Cluster name is correct (e.g., `cluster0`)
- ✓ No spaces before or after the URI
- ✓ String starts with `mongodb+srv://`

---

### 2. **Whitelist Your IP Address**

This is the MOST COMMON cause of the error!

**Steps:**
1. Go to [MongoDB Atlas Dashboard](https://www.mongodb.com/cloud/atlas)
2. Login with your account
3. Select your project
4. Click **Network Access** in the left sidebar
5. Click **Add IP Address**
6. Choose one of these:
   - **Allow access from anywhere**: `0.0.0.0/0` (for development only)
   - **Add current IP**: Automatically detects your IP
   - **Custom**: Enter your specific IP address
7. Click **Confirm**

**Note**: If you're developing locally, use `0.0.0.0/0`. For production, use your server's specific IP.

---

### 3. **Check Database User Credentials**

**Steps:**
1. Go to MongoDB Atlas Dashboard
2. Click **Database Access** in left sidebar
3. Verify your database user exists
4. If not, click **Add New Database User**
5. Set username and password
6. Ensure you're using the CORRECT username/password in your connection string

**Important**: MongoDB credentials are different from your Atlas account login!

---

### 4. **Verify Internet Connection**

```bash
# Test if you can reach MongoDB servers
ping cluster0.frqdah4.mongodb.net

# Or check DNS resolution
nslookup _mongodb._tcp.cluster0.frqdah4.mongodb.net
```

If these fail:
- Check your internet connection
- Try connecting from a different network
- Disable VPN if you're using one

---

### 5. **Test MongoDB Connection Locally**

```bash
# Install MongoDB CLI tools (optional but helpful)
npm install -g mongodb-shell

# Test your connection string
mongosh "mongodb+srv://username:password@cluster0.frqdah4.mongodb.net/test"
```

---

### 6. **Check Server Logs**

The improved server now provides detailed error messages:

```bash
cd server
node index.js
```

You should see one of:
- ✅ `✅ MongoDB Connected Successfully!`
- ❌ Error with troubleshooting steps

---

## 🔧 Step-by-Step MongoDB Atlas Setup

### Create a New Cluster (if needed)

1. **Go to MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
2. **Sign up/Login** with your account
3. **Create a Project**:
   - Click "Create a Project"
   - Name your project (e.g., "DSA Projects")
   - Click "Create Project"

4. **Create a Cluster**:
   - Click "Build a Database"
   - Choose "M0 Free" tier (perfect for development)
   - Click "Create"
   - Wait 2-3 minutes for cluster to initialize

5. **Create Database User**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Set "Built-in Role" to "readWriteAnyDatabase"
   - Click "Add User"

6. **Whitelist IP Address**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow access from anywhere" or your IP
   - Click "Confirm"

7. **Get Connection String**:
   - Go to "Databases" tab
   - Click "Connect"
   - Choose "Drivers"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `myFirstDatabase` with a name (or leave as is)

---

## 📝 Connection String Template

```
mongodb+srv://username:password@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
```

**Breaking it down:**
- `username` - Your database user (NOT Atlas account email)
- `password` - Your database user password (URL encode if special chars)
- `cluster-name` - Your cluster identifier (e.g., `cluster0.frqdah4`)
- `database-name` - Your database name (any name you want)

### Example:
```
mongodb+srv://akoredegboyega1_db_user:QueIkvJHcnPVRBga@cluster0.frqdah4.mongodb.net/dsa_projects?retryWrites=true&w=majority
```

---

## 🆘 Common Errors & Fixes

### Error: "Authentication failed"
- **Cause**: Wrong username or password
- **Fix**: Double-check credentials in MongoDB Atlas Database Access

### Error: "Connection refused"
- **Cause**: IP not whitelisted
- **Fix**: Whitelist your IP in Network Access

### Error: "ENOTFOUND" or "ESERVFAIL"
- **Cause**: DNS resolution failure
- **Fix**: Check internet, try VPN off, whitelist `0.0.0.0/0`

### Error: "ETIMEDOUT"
- **Cause**: Network connectivity issue
- **Fix**: Check firewall, try different network, restart device

### Error: "Invalid connection string"
- **Cause**: Malformed URI
- **Fix**: Verify format matches template above

---

## ✨ Testing the Connection

### Method 1: Using Server Health Check
```bash
# Start server
cd server
node index.js

# In another terminal, test the endpoint
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "Server running",
  "mongoStatus": "Connected",
  "timestamp": "2025-12-06T..."
}
```

### Method 2: Using Frontend
1. Start your frontend: `npm run dev`
2. Go to Text Editor section
3. Click "Save to DB" button
4. Check server console for success/error message

### Method 3: Direct Mongoose Test
Create `test-connection.js`:
```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
```

Run: `node test-connection.js`

---

## 🔐 Security Best Practices

⚠️ **IMPORTANT**: Never commit `.env` with real credentials!

### Protect Your Connection String
1. Add `.env` to `.gitignore`:
   ```
   server/.env
   .env
   node_modules/
   ```

2. Use environment variables in production
3. Rotate passwords periodically
4. Don't share connection strings
5. Use different credentials for dev vs production

---

## 📚 Helpful Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Mongoose Connection Guide](https://mongoosejs.com/docs/connections.html)
- [MongoDB Shell Documentation](https://docs.mongodb.com/mongodb-shell/)
- [Network Access Troubleshooting](https://docs.atlas.mongodb.com/troubleshoot-connection/)

---

## 🚀 Once Connected

Your server will show:
```
🚀 Server running on http://localhost:5000
📍 Available endpoints:
   GET  /health         - Check server health
   POST /api/save       - Save editor content
   GET  /api/states     - Get saved states
```

Now you can:
1. Use the Text Editor to save content to MongoDB
2. Retrieve saved states
3. Build more features with your database!

---

## 💡 Need Help?

1. **Check server console** - Look for specific error messages
2. **Test connection string** with `mongosh` command
3. **Verify whitelist** - Is your IP in Network Access?
4. **Check credentials** - Match `username:password` exactly
5. **Restart everything** - Node server + MongoDB connection

---

*Last Updated: December 6, 2025*
