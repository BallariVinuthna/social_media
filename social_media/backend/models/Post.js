const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: [true, 'Post content is required'],
        maxlength: [5000, 'Post content cannot exceed 5000 characters']
    },
    image: {
        type: String,
        default: null
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    hashtags: [{
        type: String,
        lowercase: true
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for likes count
postSchema.virtual('likesCount').get(function () {
    return this.likes ? this.likes.length : 0;
});

// Virtual for is_liked (set after query based on currentUserId)
postSchema.virtual('is_liked').get(function () {
    if (!this.likes || !this._currentUserId) return false;
    return this.likes.some(id => id.toString() === this._currentUserId);
});

// Virtual for comments (populated separately)
postSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post'
});

// Extract hashtags before saving
postSchema.pre('save', function (next) {
    const hashtagRegex = /#(\w+)/g;
    const matches = this.content.match(hashtagRegex);

    if (matches) {
        this.hashtags = matches.map(tag => tag.substring(1).toLowerCase());
    }

    next();
});

// Index for faster queries
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ hashtags: 1 });
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
