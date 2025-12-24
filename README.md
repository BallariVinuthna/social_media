# social_media
Purpose: A demo social media app ("SocialConnect"/"Connext") for posting, hashtags, searching, following, direct messaging, and profiles.
Tech stack: Backend: Node.js + Express + Mongoose (MongoDB). Frontend: vanilla HTML/CSS/JS. No front-end framework.
Data persistence: MongoDB for full-stack mode (or localStorage for the standalone demo UI). See START_HERE.md and README.md.
Run Locally

Backend: open a terminal, configure .env (MONGODB_URI, JWT_SECRET), then:
Frontend (static): serve frontend on port 3000:
Quick check: GET http://localhost:5000/api/health
Backend API (high-level)

Base URL: http://localhost:5000/api (see server.js)
Auth: POST /api/auth/register, POST /api/auth/login, GET /api/auth/me
Posts: GET /api/posts (search/hashtag), POST /api/posts, PUT /api/posts/:id/like, DELETE /api/posts/:id
Comments: POST /api/comments, DELETE /api/comments/:id
Messages: GET /api/messages/conversations, GET /api/messages/:userId, POST /api/messages
Users: GET /api/users, GET /api/users/:id, PUT /api/users/:id/follow
(See API docs in SETUP_GUIDE.md.)
Data Models 
User: username, email, password (hashed), fullName, bio, avatar, followers, following — model in User.js.
Post: author, content, image, likes, hashtags, virtuals for counts/comments — model in Post.js.
Comments & Messages: implemented under models and exposed via routes.
Frontend features

UI pages: login, register, feed, profile, messages (files: index.html, app.js).
Key client behavior: app.js uses API_URL = 'http://localhost:5000/api', handles auth/token (localStorage), posts (with image upload as data URL or URL), live search, hashtag filtering, trending tags, optimistic likes, comments, and messaging.
Standalone demo mode: a fully client-side demo exists (localStorage) per README.md.
Key files

Project overview & demo: README.md
Start & setup instructions: START_HERE.md, SETUP_GUIDE.md
Backend server: server.js, package.json
Backend models: User.js, Post.js
Frontend: index.html, app.js

