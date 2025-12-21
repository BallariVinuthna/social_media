# 🚀 SocialConnect - Full-Stack Setup Guide

Complete setup instructions for running SocialConnect with Node.js backend and MongoDB.

## 📋 What You'll Need

- **Node.js** 14+ ([Download](https://nodejs.org/))
- **MongoDB** ([Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - free cloud option)
- **Git** (optional, for version control)

---

## ⚡ Quick Setup (5 Minutes)

### Step 1: Install MongoDB

**Option A: Local MongoDB (Recommended for development)**

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
- Download from [mongodb.com](https://www.mongodb.com/try/download/community)
- Run installer
- MongoDB will start automatically

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**Option B: MongoDB Atlas (Cloud - No installation)**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a cluster (free tier)
4. Get connection string
5. Use it in Step 3

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

This installs all required packages (Express, Mongoose, JWT, etc.)

### Step 3: Configure Environment

Create `.env` file in the `backend` folder:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` with your settings:

```env
PORT=5000
NODE_ENV=development

# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/socialconnect

# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/socialconnect

JWT_SECRET=change-this-to-a-random-secret-key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

### Step 4: Start the Backend Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

### Step 5: Test the API

Open a new terminal and test:

```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "SocialConnect API is running"
}
```

---

## 🎨 Connect Frontend to Backend

Now update your frontend (`app.js`) to use the API instead of localStorage.

### Update API Configuration

Add to the top of `app.js`:

```javascript
const API_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('authToken');

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
}
```

---

## 📡 API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post
- `PUT /api/posts/:id/like` - Like/unlike
- `DELETE /api/posts/:id` - Delete post

### Comments
- `POST /api/comments` - Add comment
- `DELETE /api/comments/:id` - Delete comment

### Messages
- `GET /api/messages/conversations` - Get conversations
- `GET /api/messages/:userId` - Get messages
- `POST /api/messages` - Send message

### Users
- `GET /api/users` - Search users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id/follow` - Follow/unfollow

---

## 🧪 Testing the Backend

### 1. Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the token from the response!

### 3. Create a Post

```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "content": "My first post! #hello",
    "image": "https://images.unsplash.com/photo-1"
  }'
```

---

## 🔧 Troubleshooting

### MongoDB Connection Error

**Error:** `MongoNetworkError: connect ECONNREFUSED`

**Solution:**
```bash
# Check if MongoDB is running
brew services list  # Mac
sudo systemctl status mongodb  # Linux

# Start MongoDB
brew services start mongodb-community  # Mac
sudo systemctl start mongodb  # Linux
```

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change PORT in .env to 5001
```

### JWT Secret Error

**Error:** `secretOrPrivateKey must have a value`

**Solution:**
- Make sure `.env` file exists in `backend/` folder
- Check that `JWT_SECRET` is set in `.env`

---

## 📁 Project Structure

```
social_media/
├── backend/                 # Node.js API
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   ├── server.js           # Main server
│   ├── package.json
│   └── .env               # Configuration
│
├── index_enhanced.html     # Frontend (current)
├── styles.css
└── app.js                  # Will be updated for API
```

---

## 🚀 Next Steps

1. ✅ Backend is running
2. 📝 Update frontend to use API (I can help with this!)
3. 🧪 Test all features
4. 🌐 Deploy to production

---

## 💡 Tips

- Use **Postman** or **Insomnia** for easier API testing
- Check `backend/README.md` for full API documentation
- MongoDB data is stored in `/data/db` (local) or Atlas (cloud)
- All passwords are automatically hashed with bcrypt
- JWT tokens expire after 7 days (configurable in `.env`)

---

## 🆘 Need Help?

1. Check if MongoDB is running: `mongosh` (should connect)
2. Check if server is running: `curl http://localhost:5000/api/health`
3. Check logs in the terminal where you ran `npm run dev`
4. Verify `.env` file exists and has correct values

---

**Ready to connect the frontend?** Let me know and I'll update `app.js` to use the backend API!
