// ==================== API CONFIGURATION ====================
const API_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('authToken');
let currentUser = null;
let searchQuery = '';
let currentConversation = null;

// ==================== API HELPER FUNCTIONS ====================
async function apiCall(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Convert a File to data URL (base64) for simple image upload
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ==================== UTILITY FUNCTIONS ====================
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

function highlightHashtags(text) {
    return text.replace(/#([\w]+)/g, '<span class="hashtag" onclick="searchByHashtag(\'#$1\')">#$1</span>');
}

function searchByHashtag(hashtag) {
    searchQuery = hashtag;
    document.getElementById('searchInput').value = hashtag;
    loadPosts();
    showToast(`Showing posts with ${hashtag}`, 'success');
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
    loadPosts();
    loadTrending();
}

function showProfile(userId = currentUser.id) {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('registerPage').classList.add('hidden');
    document.getElementById('feedPage').classList.add('hidden');
    document.getElementById('profilePage').classList.remove('hidden');
    document.getElementById('messagesPage').classList.add('hidden');
    document.getElementById('header').classList.remove('hidden');

    setActiveNav('');
    loadProfile(userId);
}

function showMessages() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('registerPage').classList.add('hidden');
    document.getElementById('feedPage').classList.add('hidden');
    document.getElementById('profilePage').classList.add('hidden');
    document.getElementById('messagesPage').classList.remove('hidden');
    document.getElementById('header').classList.remove('hidden');

    setActiveNav('navMessages');
    loadConversations();
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
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    showToast('Logged out successfully', 'success');
    showLogin();
}

function updateNavbar() {
    document.getElementById('navAvatar').src = currentUser.avatar;
    document.getElementById('navUsername').textContent = `@${currentUser.username}`;
    document.getElementById('createPostAvatar').src = currentUser.avatar;
}

// ==================== AUTHENTICATION ====================
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const data = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        authToken = data.token;
        currentUser = data.user;
        localStorage.setItem('authToken', authToken);
        updateNavbar();
        showToast(`Welcome back, ${currentUser.fullName}!`, 'success');
        showFeed();
    } catch (error) {
        showAlert('loginError', error.message || 'Invalid email or password');
    }
});

document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('regFullName').value;
    const username = document.getElementById('regUsername').value.toLowerCase();
    const email = document.getElementById('regEmail').value.toLowerCase();
    const password = document.getElementById('regPassword').value;

    try {
        const data = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password, fullName })
        });

        authToken = data.token;
        currentUser = data.user;
        localStorage.setItem('authToken', authToken);
        updateNavbar();
        showToast(`Account created! Welcome, ${fullName}!`, 'success');
        showFeed();
    } catch (error) {
        showAlert('registerError', error.message || 'Registration failed');
    }
});

// ==================== SEARCH ====================
document.getElementById('searchInput')?.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    if (document.getElementById('feedPage').classList.contains('hidden') === false) {
        loadPosts();
    }
});

// ==================== POSTS ====================
document.getElementById('createPostForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const content = document.getElementById('postContent').value;
  const imageUrlInput = document.getElementById('postImage').value || null;
  const fileInput = document.getElementById('postImageFile');

  let image = null;

  try {
    if (fileInput && fileInput.files && fileInput.files[0]) {
      // convert file to data URL
      image = await fileToDataUrl(fileInput.files[0]);
    } else if (imageUrlInput) {
      image = imageUrlInput;
    }

    await apiCall('/posts', {
      method: 'POST',
      body: JSON.stringify({ content, image })
    });

    // reset inputs and preview
    document.getElementById('postContent').value = '';
    document.getElementById('postImage').value = '';
    if (fileInput) fileInput.value = '';
    const preview = document.getElementById('postImagePreview');
    if (preview) { preview.innerHTML = ''; preview.classList.add('hidden'); }

    showToast('Post created successfully!', 'success');
    loadPosts();
    loadTrending();
  } catch (error) {
    showToast(error.message || 'Failed to create post', 'error');
  }
});

async function loadPosts() {
    const container = document.getElementById('postsContainer');
    container.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading posts...</p></div>';

    try {
        let endpoint = '/posts?limit=50';
        if (searchQuery) {
            if (searchQuery.startsWith('#')) {
                endpoint += `&hashtag=${searchQuery.substring(1)}`;
            } else {
                endpoint += `&search=${searchQuery}`;
            }
        }

        const data = await apiCall(endpoint);
        const posts = data?.posts || [];

        if (posts.length === 0) {
            container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <p>${searchQuery ? 'No posts found matching your search' : 'No posts yet. Be the first to share something! 🚀'}</p>
        </div>
      `;
            return;
        }

        container.innerHTML = posts.map(post => {
            const contentWithHashtags = highlightHashtags(post.content);

            return `
        <div class="card post-card">
          <div class="card-body">
            <div class="post-header">
              <img class="post-avatar" src="${post.author.avatar}" alt="${post.author.fullName}" onclick="showProfile('${post.author.id}')">
              <div class="post-author" onclick="showProfile('${post.author.id}')">
                <div class="post-author-name">${post.author.fullName}</div>
                <div class="post-author-username">@${post.author.username}</div>
              </div>
              <div class="post-time">${formatDate(post.createdAt)}</div>
            </div>
            
            <div class="post-content">${contentWithHashtags}</div>
            
            ${post.image ? `<img class="post-image" src="${post.image}" alt="Post image">` : ''}
            
            <div class="post-actions">
                <button id="like-btn-${post._id}" class="post-action-btn ${post.is_liked ? 'liked' : ''}" onclick="toggleLike('${post._id}')">
                <span id="like-icon-${post._id}">${post.is_liked ? '❤️' : '🤍'}</span>
                <span id="like-count-${post._id}">${post.likesCount}</span>
              </button>
              <button class="post-action-btn ${post.comments?.length > 0 ? 'active' : ''}" onclick="toggleComments('${post._id}')">
                💬 ${post.comments?.length || 0}
              </button>
              <button class="post-action-btn" onclick="startConversation('${post.author.id}')">
                ✉️ Message
              </button>
            </div>
          </div>
          
          <div class="comments-section" id="comments-${post._id}">
            <div id="comments-list-${post._id}">
              ${(post.comments || []).map(comment => `
                <div class="comment">
                  <img class="comment-avatar" src="${comment.author.avatar}" alt="${comment.author.fullName}">
                  <div class="comment-body">
                    <div class="comment-author">${comment.author.fullName}</div>
                    <div class="comment-text">${comment.content}</div>
                    <div class="comment-time">${formatDate(comment.createdAt)}</div>
                  </div>
                </div>
              `).join('')}
            </div>
            
            <div class="comment-form">
              <img class="comment-avatar" src="${currentUser.avatar}" alt="Your avatar">
              <input 
                type="text" 
                class="comment-input" 
                placeholder="Write a comment..."
                onkeypress="handleCommentSubmit(event, '${post._id}')"
              >
            </div>
          </div>
        </div>
      `;
        }).join('');
    } catch (error) {
        container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><p>Error loading posts: ${error.message}</p></div>`;
    }
}

async function toggleLike(postId) {
  const btn = document.getElementById(`like-btn-${postId}`);
  const icon = document.getElementById(`like-icon-${postId}`);
  const countEl = document.getElementById(`like-count-${postId}`);

  // If elements not found, fallback to reloading posts
  if (!btn || !countEl || !icon) {
    try {
      await apiCall(`/posts/${postId}/like`, { method: 'PUT' });
      loadPosts();
    } catch (error) {
      showToast(error.message || 'Failed to like post', 'error');
    }
    return;
  }

  const currentlyLiked = btn.classList.contains('liked');
  const currentCount = parseInt(countEl.textContent, 10) || 0;

  // optimistic UI
  if (currentlyLiked) {
    btn.classList.remove('liked');
    icon.textContent = '🤍';
    countEl.textContent = Math.max(0, currentCount - 1);
  } else {
    btn.classList.add('liked');
    icon.textContent = '❤️';
    countEl.textContent = currentCount + 1;
  }

  btn.disabled = true;
  try {
    await apiCall(`/posts/${postId}/like`, { method: 'PUT' });
    btn.disabled = false;
  } catch (error) {
    // revert on error
    if (currentlyLiked) {
      btn.classList.add('liked');
      icon.textContent = '❤️';
      countEl.textContent = currentCount;
    } else {
      btn.classList.remove('liked');
      icon.textContent = '🤍';
      countEl.textContent = currentCount;
    }
    btn.disabled = false;
    showToast(error.message || 'Failed to like post', 'error');
    throw error;
  }
}

function toggleComments(postId) {
  const section = document.getElementById(`comments-${postId}`);
  if (!section) return;
  section.classList.toggle('show');
}

async function handleCommentSubmit(event, postId) {
    if (event.key === 'Enter' && event.target.value.trim()) {
        const content = event.target.value.trim();

        try {
            await apiCall('/comments', {
                method: 'POST',
                body: JSON.stringify({ postId, content })
            });

            event.target.value = '';
            loadPosts();
            const section = document.getElementById(`comments-${postId}`);
            section.classList.add('show');
            showToast('Comment added!', 'success');
        } catch (error) {
            showToast(error.message || 'Failed to add comment', 'error');
        }
    }
}

// ==================== TRENDING ====================
async function loadTrending() {
    const container = document.getElementById('trendingContainer');
    if (!container) return;

    try {
        const data = await apiCall('/posts/trending');
    const trending = data?.trending || [];

    if (trending.length === 0) {
            container.innerHTML = '<p style="color: var(--text-light); font-size: 14px;">No trending hashtags yet</p>';
            return;
        }

        container.innerHTML = trending.map(({ tag, count }) => `
      <div class="trending-item" onclick="searchByHashtag('#${tag}')">
        <div class="hashtag">#${tag}</div>
        <div class="trending-count">${count} ${count === 1 ? 'post' : 'posts'}</div>
      </div>
    `).join('');
    } catch (error) {
        console.error('Error loading trending:', error);
    }
}

// ==================== PROFILE ====================
async function loadProfile(userId) {
    const container = document.getElementById('profileContent');
    container.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading profile...</p></div>';

    try {
        const userData = await apiCall(`/users/${userId}`);
        const user = userData.user;

        const postsData = await apiCall(`/posts?userId=${userId}&limit=50`);
        const userPosts = postsData?.posts || [];

        const isOwnProfile = userId === currentUser.id;
        const isFollowing = user.followers?.some(f => f.id === currentUser.id);

        container.innerHTML = `
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
            <span class="stat-number">${user.followersCount || 0}</span>
            <span class="stat-label">Followers</span>
          </div>
          <div class="stat">
            <span class="stat-number">${user.followingCount || 0}</span>
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
                    <button id="like-btn-${post._id}" class="post-action-btn ${post.is_liked ? 'liked' : ''}" onclick="toggleLike('${post._id}').then(()=>loadProfile('${userId}'))">
                      <span id="like-icon-${post._id}">${post.is_liked ? '❤️' : '🤍'}</span>
                      <span id="like-count-${post._id}">${post.likesCount}</span>
                    </button>
                    <button class="post-action-btn">
                      💬 ${post.comments?.length || 0}
                    </button>
                  </div>
                </div>
              </div>
            `;
                }).join('')
            }
      </div>
    `;
    } catch (error) {
        container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><p>Error loading profile: ${error.message}</p></div>`;
    }
}

async function toggleFollow(userId) {
    try {
        await apiCall(`/users/${userId}/follow`, { method: 'PUT' });
        loadProfile(userId);
    } catch (error) {
        showToast(error.message || 'Failed to follow user', 'error');
    }
}

// ==================== MESSAGES ====================
function startConversation(userId) {
    if (userId === currentUser.id) return;
    currentConversation = userId;
    showMessages();
    setTimeout(() => selectConversation(userId), 100);
}

async function loadConversations() {
    const container = document.getElementById('conversationsList');
    if (!container) return;

    container.innerHTML = '<h3 style="margin-bottom: 16px; color: var(--text);">Messages</h3><div class="loading"><div class="spinner"></div></div>';

    try {
        const data = await apiCall('/messages/conversations');
        const conversations = data?.conversations || [];

        if (conversations.length === 0) {
            container.innerHTML = '<h3 style="margin-bottom: 16px; color: var(--text);">Messages</h3><p style="color: var(--text-light); font-size: 14px; padding: 20px;">No conversations yet</p>';
            return;
        }

        container.innerHTML = '<h3 style="margin-bottom: 16px; color: var(--text);">Messages</h3>' + conversations.map(conv => {
            const user = conv._id;
            const lastMsg = conv.lastMessage;
            const preview = lastMsg.content.substring(0, 30) + '...';

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
            loadChat(currentConversation);
        }
    } catch (error) {
        console.error('Error loading conversations:', error);
    }
}

function selectConversation(userId) {
    currentConversation = userId;
    loadConversations();
    loadChat(userId);
}

async function loadChat(userId) {
    const chatHeader = document.getElementById('chatHeader');
    const chatMessages = document.getElementById('chatMessages');

    if (!chatHeader || !chatMessages) return;

    try {
        const userData = await apiCall(`/users/${userId}`);
        const user = userData.user;

        chatHeader.innerHTML = `
      <img class="conversation-avatar" src="${user.avatar}" alt="${user.fullName}">
      <div>
        <div class="conversation-name">${user.fullName}</div>
        <div class="conversation-preview">@${user.username}</div>
      </div>
    `;

        const messagesData = await apiCall(`/messages/${userId}`);
        const messages = messagesData?.messages || [];

        if (messages.length === 0) {
            chatMessages.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">💬</div>
          <p>No messages yet. Start the conversation!</p>
        </div>
      `;
        } else {
            chatMessages.innerHTML = messages.map(msg => {
                const isOwn = msg.sender._id === currentUser.id;

                return `
          <div class="message ${isOwn ? 'own' : ''}">
            <img class="message-avatar" src="${msg.sender.avatar}" alt="${msg.sender.fullName}">
            <div class="message-bubble">
              <div class="message-text">${msg.content}</div>
              <div class="message-time">${formatDate(msg.createdAt)}</div>
            </div>
          </div>
        `;
            }).join('');

            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    } catch (error) {
        console.error('Error loading chat:', error);
    }
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const content = input.value.trim();

    if (!content || !currentConversation) return;

    try {
        await apiCall('/messages', {
            method: 'POST',
            body: JSON.stringify({ receiverId: currentConversation, content })
        });

        input.value = '';
        loadChat(currentConversation);
        loadConversations();
    } catch (error) {
        showToast(error.message || 'Failed to send message', 'error');
    }
}

document.getElementById('chatInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// ==================== INITIALIZATION ====================
window.addEventListener('DOMContentLoaded', async () => {
    if (authToken) {
        try {
            const data = await apiCall('/auth/me');
            currentUser = data.user;
            updateNavbar();
            showFeed();
        } catch (error) {
            localStorage.removeItem('authToken');
            authToken = null;
            showLogin();
        }
    } else {
        showLogin();
    }
  // Attach image file preview handler for create post
  const fileInput = document.getElementById('postImageFile');
  const preview = document.getElementById('postImagePreview');
  if (fileInput && preview) {
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) {
        preview.innerHTML = '';
        preview.classList.add('hidden');
        return;
      }

      try {
        const dataUrl = await fileToDataUrl(file);
        preview.innerHTML = `<img src="${dataUrl}" alt="preview" style="max-width:100%; height:auto; border-radius:8px;"/>`;
        preview.classList.remove('hidden');
      } catch (err) {
        console.error('Preview error:', err);
        preview.innerHTML = '';
        preview.classList.add('hidden');
      }
    });
  }
});
