# 🚀 SocialConnect - Complete Startup Guide

## 📍 **PORTS & URLs**

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| **Backend API** | `5000` | http://localhost:5000 | Node.js/Express server |
| **Frontend** | `3000` | http://localhost:3000 | Web application |
| **MongoDB** | `27017` | mongodb://localhost:27017 | Database |

---

## ⚡ **Quick Start (3 Steps)**

### Step 1: Start MongoDB

```bash
# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongodb

# Windows
# MongoDB starts automatically after installation
```

**Verify MongoDB is running:**
```bash
mongosh
# Should connect successfully
```

### Step 2: Start Backend (Terminal 1)

```bash
cd backend
npm run dev
```

**You should see:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📍 Environment: development
🌐 API URL: http://localhost:5000/api
```

### Step 3: Start Frontend (Terminal 2)

```bash
cd frontend
python3 -m http.server 3000
```

**Or use Node.js:**
```bash
npx http-server -p 3000
```

**You should see:**
```
Serving HTTP on 0.0.0.0 port 3000
```

---

## 🌐 **Access the Application**

Open your browser and go to:

### **http://localhost:3000**

You should see the SocialConnect login page!

---

## 🧪 **Testing the Full Stack**

### 1. Register a New User

1. Click "Create Account"
2. Fill in the form:
   - Full Name: Your Name
   - Username: yourname
   - Email: your@email.com
   - Password: password123
3. Click "Create Account"

**What happens:**
- Frontend sends POST to `http://localhost:5000/api/auth/register`
- Backend creates user in MongoDB
- Backend returns JWT token
- Frontend stores token and logs you in

### 2. Create a Post

1. Type in the "What's on your mind?" box
2. Add hashtags like `#hello #world`
3. Optionally add an image URL
4. Click "Post"

**What happens:**
- Frontend sends POST to `http://localhost:5000/api/posts`
- Backend saves post to MongoDB
- Backend extracts hashtags automatically
- Post appears in feed

### 3. Test Search

1. Type in the search bar
2. Search for hashtags: `#hello`
3. Search for content: `world`

**What happens:**
- Frontend sends GET to `http://localhost:5000/api/posts?search=...`
- Backend filters posts
- Results update in real-time

### 4. Send a Message

1. Click on a user's avatar
2. Click "Message" button
3. Go to Messages tab
4. Type and send

**What happens:**
- Frontend sends POST to `http://localhost:5000/api/messages`
- Backend saves to MongoDB
- Message appears in chat

---

## 🔧 **Troubleshooting**

### Backend won't start

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process on port 5000
lsof -i :5000

# Kill it
kill -9 <PID>

# Or use different port in backend/.env
PORT=5001
```

### MongoDB connection failed

**Error:** `MongoNetworkError: connect ECONNREFUSED`

**Solution:**
```bash
# Check MongoDB status
brew services list  # Mac
sudo systemctl status mongodb  # Linux

# Start MongoDB
brew services start mongodb-community  # Mac
sudo systemctl start mongodb  # Linux
```

### Frontend can't connect to backend

**Error:** `Failed to fetch` or `CORS error`

**Solution:**
1. Make sure backend is running on port 5000
2. Check `frontend/app.js` has `API_URL = 'http://localhost:5000/api'`
3. Check backend `.env` has `CLIENT_URL=http://localhost:3000`

### CORS errors

**Solution:**
Backend is already configured for CORS. If you still see errors:
1. Make sure frontend is on port 3000
2. Check backend console for CORS logs
3. Try clearing browser cache

---

## 📁 **Project Structure**

```
social_media/
├── backend/                    # Node.js API (Port 5000)
│   ├── models/                # MongoDB models
│   ├── routes/                # API endpoints
│   ├── middleware/            # Auth middleware
│   ├── server.js              # Main server
│   └── .env                   # Configuration
│
├── frontend/                   # Web App (Port 3000)
│   ├── index.html             # Main HTML
│   ├── styles.css             # Styling
│   └── app.js                 # API integration
│
└── START_HERE.md              # This file
```

---

## 🔄 **Data Flow**

```
Browser (Port 3000)
    ↓ HTTP Request
Express Server (Port 5000)
    ↓ Mongoose
MongoDB (Port 27017)
    ↓ Data
Express Server
    ↓ JSON Response
Browser
```

---

## 📊 **API Endpoints Being Used**

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts (with search/filter)
- `POST /api/posts` - Create post
- `PUT /api/posts/:id/like` - Like/unlike
- `GET /api/posts/trending` - Get trending hashtags

### Comments
- `POST /api/comments` - Add comment

### Messages
- `GET /api/messages/conversations` - Get all chats
- `GET /api/messages/:userId` - Get messages with user
- `POST /api/messages` - Send message

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id/follow` - Follow/unfollow

---

## 🎯 **What's Different from localStorage Version?**

| Feature | localStorage Version | Full-Stack Version |
|---------|---------------------|-------------------|
| **Data Storage** | Browser only | MongoDB database |
| **Multi-user** | Single browser | Real multi-user |
| **Data Persistence** | Per browser | Server-side |
| **Authentication** | Fake | Real JWT tokens |
| **Sync** | No sync | Real-time updates |
| **Deployment** | Static hosting | Needs server |

---

## 🚀 **Next Steps**

### Development
- ✅ Backend running on port 5000
- ✅ Frontend running on port 3000
- ✅ MongoDB running on port 27017
- ✅ All features connected

### Testing
- Create multiple users
- Test all features
- Check MongoDB data: `mongosh` → `use socialconnect` → `db.posts.find()`

### Deployment
- Backend: Heroku, Render, Railway
- Frontend: Netlify, Vercel, GitHub Pages
- Database: MongoDB Atlas (free tier)

---

## 💡 **Useful Commands**

### Check what's running on ports
```bash
lsof -i :3000  # Frontend
lsof -i :5000  # Backend
lsof -i :27017 # MongoDB
```

### View MongoDB data
```bash
mongosh
use socialconnect
db.users.find().pretty()
db.posts.find().pretty()
db.messages.find().pretty()
```

### Stop services
```bash
# Stop backend: Ctrl+C in terminal
# Stop frontend: Ctrl+C in terminal
# Stop MongoDB:
brew services stop mongodb-community  # Mac
sudo systemctl stop mongodb  # Linux
```

---

## 🆘 **Still Having Issues?**

1. **Check all services are running:**
   - MongoDB: `mongosh` should connect
   - Backend: `curl http://localhost:5000/api/health`
   - Frontend: Open http://localhost:3000

2. **Check logs:**
   - Backend terminal shows API requests
   - Browser console (F12) shows frontend errors
   - MongoDB logs: `brew services list`

3. **Restart everything:**
   ```bash
   # Stop all
   brew services stop mongodb-community
   # Kill backend (Ctrl+C)
   # Kill frontend (Ctrl+C)
   
   # Start fresh
   brew services start mongodb-community
   cd backend && npm run dev  # Terminal 1
   cd frontend && python3 -m http.server 3000  # Terminal 2
   ```

---

## ✅ **Success Checklist**

- [ ] MongoDB is running (port 27017)
- [ ] Backend is running (port 5000)
- [ ] Frontend is running (port 3000)
- [ ] Can access http://localhost:3000
- [ ] Can register a new user
- [ ] Can create a post
- [ ] Can see posts in feed
- [ ] Can search and filter
- [ ] Can send messages

---

**🎉 You're all set! Enjoy your full-stack social media app!**

For detailed API documentation, see `backend/README.md`
