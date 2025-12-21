// ==================== STORAGE LAYER ====================
const Storage = {
    save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    load(key, defaultValue = null) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    },

    clear() {
        localStorage.clear();
    }
};

// ==================== DATA INITIALIZATION ====================
let users = Storage.load('users', [
    {
        id: '1',
        username: 'demo',
        email: 'demo@socialconnect.com',
        password: 'demo123456',
        fullName: 'Demo User',
        bio: 'Welcome to SocialConnect! 🚀 Building the future of social networking.',
        avatar: 'https://i.pravatar.cc/150?img=12',
        followers: [],
        following: [],
        joinDate: new Date('2024-01-01').toISOString()
    },
    {
        id: '2',
        username: 'sarah_tech',
        email: 'sarah@example.com',
        password: 'password123',
        fullName: 'Sarah Johnson',
        bio: 'Software Engineer | Tech Enthusiast | Coffee Lover ☕',
        avatar: 'https://i.pravatar.cc/150?img=5',
        followers: ['1'],
        following: ['1'],
        joinDate: new Date('2024-02-15').toISOString()
    },
    {
        id: '3',
        username: 'alex_dev',
        email: 'alex@example.com',
        password: 'password123',
        fullName: 'Alex Rivera',
        bio: 'Full-stack developer | Open source contributor 💻',
        avatar: 'https://i.pravatar.cc/150?img=33',
        followers: ['1'],
        following: ['1', '2'],
        joinDate: new Date('2024-03-10').toISOString()
    }
]);

let posts = Storage.load('posts', [
    {
        id: '1',
        authorId: '1',
        content: '🎉 Welcome to SocialConnect! This is your space to share ideas, connect with others, and build meaningful relationships. #SocialConnect #Welcome',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
        likes: ['2'],
        createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
        id: '2',
        authorId: '2',
        content: 'Just finished building an amazing feature! The feeling when your code works on the first try is unmatched. 💻✨ #coding #webdev',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
        likes: ['1'],
        createdAt: new Date(Date.now() - 7200000).toISOString()
    }
]);

let comments = Storage.load('comments', [
    {
        id: '1',
        postId: '1',
        authorId: '2',
        content: 'This looks amazing! Can\'t wait to connect with everyone here! 🙌',
        createdAt: new Date(Date.now() - 1800000).toISOString()
    }
]);

let messages = Storage.load('messages', []);

let currentUser = null;
let nextUserId = Storage.load('nextUserId', 4);
let nextPostId = Storage.load('nextPostId', 3);
let nextCommentId = Storage.load('nextCommentId', 2);
let nextMessageId = Storage.load('nextMessageId', 1);
let searchQuery = '';
let currentConversation = null;

// ==================== UTILITY FUNCTIONS ====================
function saveAllData() {
    Storage.save('users', users);
    Storage.save('posts', posts);
    Storage.save('comments', comments);
    Storage.save('messages', messages);
    Storage.save('nextUserId', nextUserId);
    Storage.save('nextPostId', nextPostId);
    Storage.save('nextCommentId', nextCommentId);
    Storage.save('nextMessageId', nextMessageId);
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

    toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
  `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 30) return `${days}d ago`;

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
}

function getUserById(id) {
    return users.find(u => u.id === id);
}

function getPostComments(postId) {
    return comments.filter(c => c.postId === postId);
}

function extractHashtags(text) {
    const hashtagRegex = /#[\w]+/g;
    return text.match(hashtagRegex) || [];
}

function highlightHashtags(text) {
    return text.replace(/#([\w]+)/g, '<span class="hashtag" onclick="searchByHashtag(\'#$1\')">#$1</span>');
}

function searchByHashtag(hashtag) {
    searchQuery = hashtag;
    document.getElementById('searchInput').value = hashtag;
    renderPosts();
    showToast(`Showing posts with ${hashtag}`, 'success');
}

function getTrendingHashtags() {
    const hashtagCount = {};

    posts.forEach(post => {
        const hashtags = extractHashtags(post.content);
        hashtags.forEach(tag => {
            hashtagCount[tag] = (hashtagCount[tag] || 0) + 1;
        });
    });

    return Object.entries(hashtagCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tag, count]) => ({ tag, count }));
}

function showAlert(elementId, message, type = 'error') {
    const el = document.getElementById(elementId);
    el.innerHTML = `<div class="alert alert-${type}">${type === 'error' ? '⚠️' : '✓'} ${message}</div>`;
    setTimeout(() => el.innerHTML = '', 5000);
}

// ==================== NAVIGATION ====================
function showLogin() {
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('registerPage').classList.add('hidden');
    document.getElementById('feedPage').classList.add('hidden');
    document.getElementById('profilePage').classList.add('hidden');
    document.getElementById('messagesPage').classList.add('hidden');
    document.getElementById('header').classList.add('hidden');
}

function showRegister() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('registerPage').classList.remove('hidden');
    document.getElementById('feedPage').classList.add('hidden');
    document.getElementById('profilePage').classList.add('hidden');
    document.getElementById('messagesPage').classList.add('hidden');
    document.getElementById('header').classList.add('hidden');
}

function showFeed() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('registerPage').classList.add('hidden');
    document.getElementById('feedPage').classList.remove('hidden');
    document.getElementById('profilePage').classList.add('hidden');
    document.getElementById('messagesPage').classList.add('hidden');
    document.getElementById('header').classList.remove('hidden');

    setActiveNav('navHome');
    renderPosts();
    renderTrending();
}

function showProfile(userId = currentUser.id) {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('registerPage').classList.add('hidden');
    document.getElementById('feedPage').classList.add('hidden');
    document.getElementById('profilePage').classList.remove('hidden');
    document.getElementById('messagesPage').classList.add('hidden');
    document.getElementById('header').classList.remove('hidden');

    setActiveNav('');
    renderProfile(userId);
}

function showMessages() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('registerPage').classList.add('hidden');
    document.getElementById('feedPage').classList.add('hidden');
    document.getElementById('profilePage').classList.add('hidden');
    document.getElementById('messagesPage').classList.remove('hidden');
    document.getElementById('header').classList.remove('hidden');

    setActiveNav('navMessages');
    renderConversations();
}

function setActiveNav(navId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    if (navId) {
        document.getElementById(navId)?.classList.add('active');
    }
}

function logout() {
    currentUser = null;
    searchQuery = '';
    showToast('Logged out successfully', 'success');
    showLogin();
}

function updateNavbar() {
    document.getElementById('navAvatar').src = currentUser.avatar;
    document.getElementById('navUsername').textContent = `@${currentUser.username}`;
    document.getElementById('createPostAvatar').src = currentUser.avatar;

    // Update unread messages badge
    const unreadCount = getUnreadMessagesCount();
    const badge = document.getElementById('messagesBadge');
    if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

function getUnreadMessagesCount() {
    // Simplified - in real app would track read status
    return 0;
}

// ==================== AUTHENTICATION ====================
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        updateNavbar();
        showToast(`Welcome back, ${user.fullName}!`, 'success');
        showFeed();
    } else {
        showAlert('loginError', 'Invalid email or password');
    }
});

document.getElementById('registerForm')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('regFullName').value;
    const username = document.getElementById('regUsername').value.toLowerCase();
    const email = document.getElementById('regEmail').value.toLowerCase();
    const password = document.getElementById('regPassword').value;

    if (users.some(u => u.email === email)) {
        showAlert('registerError', 'Email already registered');
        return;
    }

    if (users.some(u => u.username === username)) {
        showAlert('registerError', 'Username already taken');
        return;
    }

    const newUser = {
        id: String(nextUserId++),
        username,
        email,
        password,
        fullName,
        bio: '',
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        followers: [],
        following: [],
        joinDate: new Date().toISOString()
    };

    users.push(newUser);
    currentUser = newUser;
    saveAllData();
    updateNavbar();
    showToast(`Account created! Welcome, ${fullName}!`, 'success');
    showFeed();
});

// ==================== SEARCH ====================
document.getElementById('searchInput')?.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    if (document.getElementById('feedPage').classList.contains('hidden') === false) {
        renderPosts();
    }
});

// ==================== POSTS ====================
document.getElementById('createPostForm')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const content = document.getElementById('postContent').value;
    const image = document.getElementById('postImage').value || null;

    const newPost = {
        id: String(nextPostId++),
        authorId: currentUser.id,
        content,
        image,
        likes: [],
        createdAt: new Date().toISOString()
    };

    posts.unshift(newPost);
    saveAllData();
    document.getElementById('postContent').value = '';
    document.getElementById('postImage').value = '';
    showToast('Post created successfully!', 'success');
    renderPosts();
    renderTrending();
});

function renderPosts() {
    const container = document.getElementById('postsContainer');

    let filteredPosts = posts;

    if (searchQuery) {
        filteredPosts = posts.filter(post => {
            const author = getUserById(post.authorId);
            return post.content.toLowerCase().includes(searchQuery) ||
                author.fullName.toLowerCase().includes(searchQuery) ||
                author.username.toLowerCase().includes(searchQuery);
        });
    }

    if (filteredPosts.length === 0) {
        container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <p>${searchQuery ? 'No posts found matching your search' : 'No posts yet. Be the first to share something! 🚀'}</p>
      </div>
    `;
        return;
    }

    container.innerHTML = filteredPosts.map(post => {
        const author = getUserById(post.authorId);
        const isLiked = post.likes.includes(currentUser.id);
        const postComments = getPostComments(post.id);
        const contentWithHashtags = highlightHashtags(post.content);

        return `
      <div class="card post-card">
        <div class="card-body">
          <div class="post-header">
            <img class="post-avatar" src="${author.avatar}" alt="${author.fullName}" onclick="showProfile('${author.id}')">
            <div class="post-author" onclick="showProfile('${author.id}')">
              <div class="post-author-name">${author.fullName}</div>
              <div class="post-author-username">@${author.username}</div>
            </div>
            <div class="post-time">${formatDate(post.createdAt)}</div>
          </div>
          
          <div class="post-content">${contentWithHashtags}</div>
          
          ${post.image ? `<img class="post-image" src="${post.image}" alt="Post image">` : ''}
          
          <div class="post-actions">
            <button class="post-action-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike('${post.id}')">
              ${isLiked ? '❤️' : '🤍'} ${post.likes.length}
            </button>
            <button class="post-action-btn ${postComments.length > 0 ? 'active' : ''}" onclick="toggleComments('${post.id}')">
              💬 ${postComments.length}
            </button>
            <button class="post-action-btn" onclick="startConversation('${author.id}')">
              ✉️ Message
            </button>
          </div>
        </div>
        
        <div class="comments-section" id="comments-${post.id}">
          <div id="comments-list-${post.id}">
            ${postComments.map(comment => {
            const commentAuthor = getUserById(comment.authorId);
            return `
                <div class="comment">
                  <img class="comment-avatar" src="${commentAuthor.avatar}" alt="${commentAuthor.fullName}">
                  <div class="comment-body">
                    <div class="comment-author">${commentAuthor.fullName}</div>
                    <div class="comment-text">${comment.content}</div>
                    <div class="comment-time">${formatDate(comment.createdAt)}</div>
                  </div>
                </div>
              `;
        }).join('')}
          </div>
          
          <div class="comment-form">
            <img class="comment-avatar" src="${currentUser.avatar}" alt="Your avatar">
            <input 
              type="text" 
              class="comment-input" 
              placeholder="Write a comment..."
              onkeypress="handleCommentSubmit(event, '${post.id}')"
            >
          </div>
        </div>
      </div>
    `;
    }).join('');
}

function toggleLike(postId) {
    const post = posts.find(p => p.id === postId);
    const index = post.likes.indexOf(currentUser.id);

    if (index > -1) {
        post.likes.splice(index, 1);
    } else {
        post.likes.push(currentUser.id);
        showToast('Post liked!', 'success');
    }

    saveAllData();
    renderPosts();
}

function toggleComments(postId) {
    const section = document.getElementById(`comments-${postId}`);
    section.classList.toggle('show');
}

function handleCommentSubmit(event, postId) {
    if (event.key === 'Enter' && event.target.value.trim()) {
        const content = event.target.value.trim();

        const newComment = {
            id: String(nextCommentId++),
            postId,
            authorId: currentUser.id,
            content,
            createdAt: new Date().toISOString()
        };

        comments.push(newComment);
        saveAllData();
        event.target.value = '';
        renderPosts();

        const section = document.getElementById(`comments-${postId}`);
        section.classList.add('show');
        showToast('Comment added!', 'success');
    }
}

// ==================== TRENDING ====================
function renderTrending() {
    const trending = getTrendingHashtags();
    const container = document.getElementById('trendingContainer');

    if (!container) return;

    if (trending.length === 0) {
        container.innerHTML = '<p style="color: var(--text-light); font-size: 14px;">No trending hashtags yet</p>';
        return;
    }

    container.innerHTML = trending.map(({ tag, count }) => `
    <div class="trending-item" onclick="searchByHashtag('${tag}')">
      <div class="hashtag">${tag}</div>
      <div class="trending-count">${count} ${count === 1 ? 'post' : 'posts'}</div>
    </div>
  `).join('');
}

// ==================== PROFILE ====================
function renderProfile(userId) {
    const user = getUserById(userId);
    const userPosts = posts.filter(p => p.authorId === userId);
    const isOwnProfile = userId === currentUser.id;
    const isFollowing = user.followers.includes(currentUser.id);

    document.getElementById('profileContent').innerHTML = `
    <div class="profile-header">
      <img class="profile-avatar" src="${user.avatar}" alt="${user.fullName}">
      <div class="profile-name">${user.fullName}</div>
      <div class="profile-username">@${user.username}</div>
      <div class="profile-bio">${user.bio || 'No bio yet'}</div>
      
      <div class="profile-stats">
        <div class="stat">
          <span class="stat-number">${userPosts.length}</span>
          <span class="stat-label">Posts</span>
        </div>
        <div class="stat">
          <span class="stat-number">${user.followers.length}</span>
          <span class="stat-label">Followers</span>
        </div>
        <div class="stat">
          <span class="stat-number">${user.following.length}</span>
          <span class="stat-label">Following</span>
        </div>
      </div>

      ${!isOwnProfile ? `
        <div style="display: flex; gap: 12px; justify-content: center; position: relative; z-index: 1;">
          <button class="btn ${isFollowing ? 'btn-secondary' : 'btn-primary'}" 
                  style="max-width: 200px;"
                  onclick="toggleFollow('${userId}')">
            ${isFollowing ? '✓ Following' : '+ Follow'}
          </button>
          <button class="btn btn-secondary" 
                  style="max-width: 200px;"
                  onclick="startConversation('${userId}')">
            ✉️ Message
          </button>
        </div>
      ` : ''}
    </div>

    <div style="max-width: 600px; margin: 0 auto;">
      <h2 style="margin-bottom: 20px; font-size: 20px; color: var(--text);">Posts</h2>
      ${userPosts.length === 0 ?
            '<div class="empty-state"><div class="empty-state-icon">📝</div><p>No posts yet</p></div>' :
            userPosts.map(post => {
                const isLiked = post.likes.includes(currentUser.id);
                const postComments = getPostComments(post.id);
                const contentWithHashtags = highlightHashtags(post.content);

                return `
            <div class="card post-card">
              <div class="card-body">
                <div class="post-header">
                  <img class="post-avatar" src="${user.avatar}" alt="${user.fullName}">
                  <div class="post-author">
                    <div class="post-author-name">${user.fullName}</div>
                    <div class="post-author-username">@${user.username}</div>
                  </div>
                  <div class="post-time">${formatDate(post.createdAt)}</div>
                </div>
                
                <div class="post-content">${contentWithHashtags}</div>
                
                ${post.image ? `<img class="post-image" src="${post.image}" alt="Post image">` : ''}
                
                <div class="post-actions">
                  <button class="post-action-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike('${post.id}'); renderProfile('${userId}')">
                    ${isLiked ? '❤️' : '🤍'} ${post.likes.length}
                  </button>
                  <button class="post-action-btn">
                    💬 ${postComments.length}
                  </button>
                </div>
              </div>
            </div>
          `;
            }).join('')
        }
    </div>
  `;
}

function toggleFollow(userId) {
    const user = getUserById(userId);
    const index = user.followers.indexOf(currentUser.id);

    if (index > -1) {
        user.followers.splice(index, 1);
        currentUser.following = currentUser.following.filter(id => id !== userId);
        showToast(`Unfollowed ${user.fullName}`, 'success');
    } else {
        user.followers.push(currentUser.id);
        currentUser.following.push(userId);
        showToast(`Now following ${user.fullName}!`, 'success');
    }

    saveAllData();
    renderProfile(userId);
}

// ==================== MESSAGES ====================
function startConversation(userId) {
    if (userId === currentUser.id) return;

    currentConversation = userId;
    showMessages();
    selectConversation(userId);
}

function renderConversations() {
    const otherUsers = users.filter(u => u.id !== currentUser.id);
    const container = document.getElementById('conversationsList');

    if (!container) return;

    container.innerHTML = otherUsers.map(user => {
        const userMessages = messages.filter(m =>
            (m.senderId === currentUser.id && m.receiverId === user.id) ||
            (m.senderId === user.id && m.receiverId === currentUser.id)
        );

        const lastMessage = userMessages[userMessages.length - 1];
        const preview = lastMessage ? lastMessage.content.substring(0, 30) + '...' : 'Start a conversation';

        return `
      <div class="conversation-item ${currentConversation === user.id ? 'active' : ''}" 
           onclick="selectConversation('${user.id}')">
        <img class="conversation-avatar" src="${user.avatar}" alt="${user.fullName}">
        <div class="conversation-info">
          <div class="conversation-name">${user.fullName}</div>
          <div class="conversation-preview">${preview}</div>
        </div>
      </div>
    `;
    }).join('');

    if (currentConversation) {
        renderChat(currentConversation);
    } else if (otherUsers.length > 0) {
        selectConversation(otherUsers[0].id);
    }
}

function selectConversation(userId) {
    currentConversation = userId;
    renderConversations();
    renderChat(userId);
}

function renderChat(userId) {
    const user = getUserById(userId);
    const chatHeader = document.getElementById('chatHeader');
    const chatMessages = document.getElementById('chatMessages');

    if (!chatHeader || !chatMessages) return;

    chatHeader.innerHTML = `
    <img class="conversation-avatar" src="${user.avatar}" alt="${user.fullName}">
    <div>
      <div class="conversation-name">${user.fullName}</div>
      <div class="conversation-preview">@${user.username}</div>
    </div>
  `;

    const conversation = messages.filter(m =>
        (m.senderId === currentUser.id && m.receiverId === userId) ||
        (m.senderId === userId && m.receiverId === currentUser.id)
    );

    if (conversation.length === 0) {
        chatMessages.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">💬</div>
        <p>No messages yet. Start the conversation!</p>
      </div>
    `;
    } else {
        chatMessages.innerHTML = conversation.map(msg => {
            const isOwn = msg.senderId === currentUser.id;
            const sender = getUserById(msg.senderId);

            return `
        <div class="message ${isOwn ? 'own' : ''}">
          <img class="message-avatar" src="${sender.avatar}" alt="${sender.fullName}">
          <div class="message-bubble">
            <div class="message-text">${msg.content}</div>
            <div class="message-time">${formatDate(msg.createdAt)}</div>
          </div>
        </div>
      `;
        }).join('');

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const content = input.value.trim();

    if (!content || !currentConversation) return;

    const newMessage = {
        id: String(nextMessageId++),
        senderId: currentUser.id,
        receiverId: currentConversation,
        content,
        createdAt: new Date().toISOString()
    };

    messages.push(newMessage);
    saveAllData();
    input.value = '';
    renderChat(currentConversation);
    renderConversations();
}

document.getElementById('chatInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// ==================== INITIALIZATION ====================
window.addEventListener('DOMContentLoaded', () => {
    showLogin();
});
