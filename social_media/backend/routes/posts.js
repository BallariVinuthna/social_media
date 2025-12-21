const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// @route   GET /api/posts
// @desc    Get all posts (with search and hashtag filtering)
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { search, hashtag, userId, page = 1, limit = 10 } = req.query;
        let query = {};

        if (search) {
            query.content = { $regex: search, $options: 'i' };
        }

        if (hashtag) {
            query.hashtags = hashtag.toLowerCase().replace('#', '');
        }

        if (userId) {
            query.author = userId;
        }

        const posts = await Post.find(query)
            .populate('author', 'username fullName avatar')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'username fullName avatar' },
                options: { sort: { createdAt: 1 } }
            })
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean(); // Use lean() for better performance

        // Set current user ID for is_liked virtual and convert to plain objects
        const postsWithLikes = posts.map(post => {
            const plainPost = post.toObject ? post.toObject() : { ...post };
            plainPost._currentUserId = req.user.id;
            // Calculate is_liked
            plainPost.is_liked = plainPost.likes && plainPost.likes.some(id => id.toString() === req.user.id);
            plainPost.likesCount = plainPost.likes ? plainPost.likes.length : 0;
            return plainPost;
        });

        const count = await Post.countDocuments(query);

        res.json({
            success: true,
            posts: postsWithLikes,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        console.error('Error in GET /posts:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/posts/trending
// @desc    Get trending hashtags
// @access  Private
router.get('/trending', protect, async (req, res) => {
    try {
        const trending = await Post.aggregate([
            { $unwind: '$hashtags' },
            { $group: { _id: '$hashtags', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            { $project: { tag: '$_id', count: 1, _id: 0 } }
        ]);

        res.json({
            success: true,
            trending
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', [
    protect,
    body('content').trim().notEmpty().withMessage('Post content is required')
        .isLength({ max: 5000 }).withMessage('Post content cannot exceed 5000 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { content, image } = req.body;

        const post = await Post.create({
            author: req.user.id,
            content,
            image
        });

        await post.populate('author', 'username fullName avatar');

        res.status(201).json({
            success: true,
            post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/posts/:id/like
// @desc    Like/unlike a post
// @access  Private
router.put('/:id/like', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const isLiked = post.likes.includes(req.user.id);

        if (isLiked) {
            post.likes = post.likes.filter(id => id.toString() !== req.user.id);
        } else {
            post.likes.push(req.user.id);
        }

        await post.save();

        res.json({
            success: true,
            message: isLiked ? 'Post unliked' : 'Post liked',
            isLiked: !isLiked,
            likesCount: post.likesCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this post'
            });
        }

        await post.deleteOne();
        await Comment.deleteMany({ post: req.params.id });

        res.json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
