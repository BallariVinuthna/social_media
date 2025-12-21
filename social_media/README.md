# 🚀 SocialConnect - Enhanced Social Media Platform

A modern, feature-rich social media application with a stunning dark theme UI, built with vanilla JavaScript, HTML, and CSS.

## ✨ Features

### 🎨 **Premium Dark Theme UI**
- Sleek dark mode design with glassmorphism effects
- Smooth animations and micro-interactions
- Gradient accents and modern typography (Inter font)
- Responsive design for all devices

### 💾 **Persistent Storage**
- All data saved to localStorage
- Automatic data persistence across sessions
- No data loss on page refresh

### 🔍 **Advanced Search**
- Real-time search across posts, users, and hashtags
- Search by content, author name, or username
- Instant results as you type

### #️⃣ **Hashtag Support**
- Automatic hashtag detection in posts
- Clickable hashtags for filtered views
- Trending hashtags sidebar
- Post count for each trending tag

### 💬 **Direct Messaging**
- One-on-one conversations
- Real-time message updates
- Conversation list with previews
- Message timestamps

### 📱 **Core Social Features**
- Create posts with text and images
- Like and unlike posts
- Comment on posts
- User profiles with stats
- Follow/unfollow users
- User avatars

### 🔔 **Toast Notifications**
- Success notifications for actions
- Error alerts for issues
- Auto-dismissing toasts
- Smooth slide-in animations

### 🎯 **User Experience**
- Intuitive navigation
- Loading states
- Empty states with helpful messages
- Hover effects and transitions
- Mobile-responsive design

## 📁 Project Structure

```
social_media/
├── index_enhanced.html    # Enhanced HTML with dark theme
├── styles.css            # Complete CSS with animations
├── app.js               # JavaScript with all features
├── index.html           # Original version (backup)
└── README.md            # This file
```

## 🚀 Getting Started

### Quick Start

1. **Open the Application**
   - Simply open `index_enhanced.html` in your web browser
   - Or use a local server for best experience

2. **Login**
   - Use demo credentials:
     - Email: `demo@socialconnect.com`
     - Password: `demo123456`
   - Or create a new account

3. **Start Exploring!**
   - Create posts with hashtags
   - Search for content
   - Message other users
   - Follow people

### Demo Accounts

The app comes with pre-loaded demo users:

1. **Demo User**
   - Email: demo@socialconnect.com
   - Password: demo123456

2. **Sarah Johnson**
   - Email: sarah@example.com
   - Password: password123

3. **Alex Rivera**
   - Email: alex@example.com
   - Password: password123

## 🎮 How to Use

### Creating Posts
1. Click on the text area in "Create a post"
2. Type your message (use #hashtags!)
3. Optionally add an image URL
4. Click "Post"

### Using Hashtags
- Type `#` followed by a word in your posts
- Click any hashtag to filter posts
- View trending hashtags in the sidebar

### Messaging
1. Click "Messages" in the navigation
2. Select a user from the conversations list
3. Type your message and press Enter or click Send

### Search
- Use the search bar in the header
- Search for posts, users, or hashtags
- Results update in real-time

### Following Users
1. Visit a user's profile
2. Click the "Follow" button
3. See their posts in your feed

## 🎨 Design Features

### Color Scheme
- Primary: Indigo (#6366f1)
- Secondary: Emerald (#10b981)
- Danger: Red (#ef4444)
- Background: Slate (#0f172a)
- Surface: Slate (#1e293b)

### Animations
- Fade in effects for new content
- Slide in for toasts
- Bounce for likes
- Pulse for backgrounds
- Smooth transitions everywhere

### Typography
- Font Family: Inter (Google Fonts)
- Weights: 400, 500, 600, 700
- Optimized for readability

## 💡 Tips & Tricks

1. **Hashtags**: Use hashtags like `#coding`, `#webdev`, `#design` to categorize posts
2. **Search**: Search for `#` to see all posts with hashtags
3. **Messages**: Click the message button on any post to start a conversation
4. **Data**: All your data is saved locally - no server needed!
5. **Reset**: Clear browser localStorage to reset all data

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with animations
- **JavaScript (ES6+)**: Vanilla JS, no frameworks
- **localStorage**: Client-side data persistence
- **Google Fonts**: Inter font family

### Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design

### Performance
- Lightweight: No external dependencies
- Fast: Pure vanilla JavaScript
- Efficient: Optimized animations
- Responsive: Mobile-first design

## 📊 Data Storage

All data is stored in browser localStorage:
- `users`: User accounts and profiles
- `posts`: All posts with content and metadata
- `comments`: Comments on posts
- `messages`: Direct messages
- `nextUserId`, `nextPostId`, etc.: ID counters

### Clearing Data
To reset the application:
```javascript
localStorage.clear();
location.reload();
```

## 🎯 Future Enhancements

Potential features for future versions:
- [ ] Image upload (not just URLs)
- [ ] Video support
- [ ] Stories feature
- [ ] Notifications system
- [ ] Dark/Light theme toggle
- [ ] Export data feature
- [ ] Group chats
- [ ] Post sharing
- [ ] Bookmarks
- [ ] User mentions (@username)

## 🐛 Known Limitations

- Data is stored locally (not synced across devices)
- Image URLs must be valid and accessible
- No backend server (all client-side)
- No real-time updates (requires page refresh)

## 📝 License

This is a demo project for educational purposes.

## 🤝 Contributing

This is a standalone demo project. Feel free to fork and modify for your own use!

## 📧 Support

For issues or questions, refer to the code comments or create an issue.

---

**Enjoy using SocialConnect!** 🎉

Made with ❤️ using vanilla JavaScript, HTML, and CSS.
