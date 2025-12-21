# 🚀 SocialConnect Backend API

Node.js/Express backend for the SocialConnect social media platform.

## 📋 Prerequisites

- **Node.js** 14+ and npm
- **MongoDB** 4.4+ (local or MongoDB Atlas)

## ⚡ Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/socialconnect
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas** (Cloud)
- Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster
- Get connection string
- Update `MONGODB_URI` in `.env`

### 4. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will start at `http://localhost:5000`

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users` | Get all users (search) | Yes |
| GET | `/api/users/:id` | Get user by ID | Yes |
| PUT | `/api/users/:id/follow` | Follow/unfollow user | Yes |

### Posts

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/posts` | Get all posts | Yes |
| GET | `/api/posts/trending` | Get trending hashtags | Yes |
| POST | `/api/posts` | Create post | Yes |
| PUT | `/api/posts/:id/like` | Like/unlike post | Yes |
| DELETE | `/api/posts/:id` | Delete post | Yes |

### Comments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/comments` | Create comment | Yes |
| DELETE | `/api/comments/:id` | Delete comment | Yes |

### Messages

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/messages/conversations` | Get conversations | Yes |
| GET | `/api/messages/:userId` | Get messages with user | Yes |
| POST | `/api/messages` | Send message | Yes |
| GET | `/api/messages/unread/count` | Get unread count | Yes |

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📝 Example API Calls

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "fullName": "John Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Post

```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "content": "Hello world! #firstpost",
    "image": "https://example.com/image.jpg"
  }'
```

## 🗄️ Database Models

### User
- username, email, password (hashed)
- fullName, bio, avatar
- followers, following arrays
- Timestamps

### Post
- author (User reference)
- content, image
- likes array, hashtags array
- Timestamps

### Comment
- post (Post reference)
- author (User reference)
- content
- Timestamps

### Message
- sender, receiver (User references)
- content
- read status
- Timestamps

## 🛠️ Development

### Project Structure

```
backend/
├── models/           # Mongoose models
│   ├── User.js
│   ├── Post.js
│   ├── Comment.js
│   └── Message.js
├── routes/           # API routes
│   ├── auth.js
│   ├── users.js
│   ├── posts.js
│   ├── comments.js
│   └── messages.js
├── middleware/       # Custom middleware
│   └── auth.js
├── server.js         # Main server file
├── package.json
└── .env
```

### Adding New Features

1. Create model in `models/`
2. Create routes in `routes/`
3. Add route to `server.js`
4. Test with Postman or curl

## 🧪 Testing

Use Postman, Insomnia, or curl to test endpoints.

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

## 🚀 Deployment

### Heroku

```bash
heroku create your-app-name
heroku config:set MONGODB_URI=your-mongodb-atlas-uri
heroku config:set JWT_SECRET=your-secret-key
git push heroku main
```

### Render/Railway

1. Connect GitHub repo
2. Set environment variables
3. Deploy

## 📚 Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - Cross-origin requests
- **morgan** - HTTP logging

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation
- CORS configuration
- MongoDB injection protection

## 📄 License

MIT

---

**Need help?** Check the code comments or create an issue.
