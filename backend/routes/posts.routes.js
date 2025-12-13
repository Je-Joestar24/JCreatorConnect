import express from 'express';
import { body } from 'express-validator';
import {
  createPostController,
  getPostsController,
  getPostByIdController,
  getPostsByCreatorController,
  updatePostController,
  deletePostController,
  uploadPostImageController,
} from '../controllers/posts.controller.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

/**
 * Validation rules for creating a post
 */
const createPostValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Post title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('type')
    .notEmpty()
    .withMessage('Post type is required')
    .isIn(['text', 'image', 'videoEmbed', 'link'])
    .withMessage('Post type must be one of: text, image, videoEmbed, link'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Post content is required')
    .isLength({ max: 5000 })
    .withMessage('Content cannot exceed 5000 characters'),
  body('mediaUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Media URL must be a valid URL'),
  body('videoEmbedUrl')
    .optional()
    .trim()
    .custom((value, { req }) => {
      if (req.body.type === 'videoEmbed' && !value) {
        throw new Error('Video embed URL is required for videoEmbed type');
      }
      if (value) {
        const urlPattern = /^https?:\/\/.+/;
        if (!urlPattern.test(value)) {
          throw new Error('Video embed URL must be a valid URL');
        }
        // Check if it's a YouTube or Vimeo URL
        const isYouTube =
          value.includes('youtube.com') || value.includes('youtu.be');
        const isVimeo = value.includes('vimeo.com');
        if (!isYouTube && !isVimeo) {
          throw new Error(
            'Video embed URL must be from YouTube or Vimeo'
          );
        }
      }
      return true;
    }),
  body('linkUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Link URL must be a valid URL'),
  body('isLocked')
    .optional()
    .isBoolean()
    .withMessage('isLocked must be a boolean'),
  body('accessType')
    .optional()
    .isIn(['free', 'supporter-only', 'membership-only'])
    .withMessage(
      'Access type must be one of: free, supporter-only, membership-only'
    ),
  body('membershipTierRequired')
    .optional()
    .isMongoId()
    .withMessage('Membership tier ID must be a valid MongoDB ObjectId')
    .custom((value, { req }) => {
      if (req.body.accessType === 'membership-only' && !value) {
        throw new Error(
          'Membership tier is required when access type is membership-only'
        );
      }
      return true;
    }),
];

/**
 * Validation rules for updating a post
 */
const updatePostValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('type')
    .optional()
    .isIn(['text', 'image', 'videoEmbed', 'link'])
    .withMessage('Post type must be one of: text, image, videoEmbed, link'),
  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Content cannot be empty')
    .isLength({ max: 5000 })
    .withMessage('Content cannot exceed 5000 characters'),
  body('mediaUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Media URL must be a valid URL'),
  body('videoEmbedUrl')
    .optional()
    .trim()
    .custom((value, { req }) => {
      if (value) {
        const urlPattern = /^https?:\/\/.+/;
        if (!urlPattern.test(value)) {
          throw new Error('Video embed URL must be a valid URL');
        }
        const isYouTube =
          value.includes('youtube.com') || value.includes('youtu.be');
        const isVimeo = value.includes('vimeo.com');
        if (!isYouTube && !isVimeo) {
          throw new Error(
            'Video embed URL must be from YouTube or Vimeo'
          );
        }
      }
      return true;
    }),
  body('linkUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Link URL must be a valid URL'),
  body('isLocked')
    .optional()
    .isBoolean()
    .withMessage('isLocked must be a boolean'),
  body('accessType')
    .optional()
    .isIn(['free', 'supporter-only', 'membership-only'])
    .withMessage(
      'Access type must be one of: free, supporter-only, membership-only'
    ),
  body('membershipTierRequired')
    .optional()
    .isMongoId()
    .withMessage('Membership tier ID must be a valid MongoDB ObjectId'),
];

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * @route   GET /api/posts
 * @desc    Get all posts with pagination
 * @access  Public
 * @query   {number} page - Page number (default: 1)
 * @query   {number} limit - Posts per page (default: 10)
 * @query   {string} accessType - Filter by access type
 * @query   {boolean} isLocked - Filter by locked status
 * @query   {string} creatorId - Filter by creator ID
 * @returns {object} Posts array with pagination metadata
 */
router.get('/', getPostsController);

/**
 * @route   GET /api/posts/:id
 * @desc    Get a single post by ID
 * @access  Public
 * @param   {string} id - Post ID (MongoDB ObjectId)
 * @returns {object} Post object with populated creator info
 */
router.get('/:id', getPostByIdController);

/**
 * @route   GET /api/posts/creator/:creatorId
 * @desc    Get posts by creator ID with pagination
 * @access  Public
 * @param   {string} creatorId - Creator user ID (MongoDB ObjectId)
 * @query   {number} page - Page number (default: 1)
 * @query   {number} limit - Posts per page (default: 10)
 * @query   {string} accessType - Filter by access type
 * @query   {boolean} isLocked - Filter by locked status
 * @returns {object} Posts array with pagination metadata
 */
router.get('/creator/:creatorId', getPostsByCreatorController);

// ============================================
// PROTECTED ROUTES (Creator Only)
// ============================================

/**
 * @route   POST /api/posts
 * @desc    Create a new post
 * @access  Private (Creator only)
 * @body    {string} title - Post title (required, max 200 chars)
 * @body    {string} type - Post type: text, image, videoEmbed, link (required)
 * @body    {string} content - Post content (required, max 5000 chars)
 * @body    {string} [mediaUrl] - Media URL (for image type)
 * @body    {string} [videoEmbedUrl] - Video embed URL (for videoEmbed type, YouTube/Vimeo only)
 * @body    {string} [linkUrl] - Link URL (for link type)
 * @body    {boolean} [isLocked] - Whether post is locked (default: false)
 * @body    {string} [accessType] - Access type: free, supporter-only, membership-only (default: free)
 * @body    {string} [membershipTierRequired] - Required membership tier ID (required if accessType is membership-only)
 * @returns {object} Created post with populated creator info
 */
router.post(
  '/',
  protect,
  authorize('creator'),
  createPostValidation,
  handleValidationErrors,
  createPostController
);

/**
 * @route   PUT /api/posts/:id
 * @desc    Update a post
 * @access  Private (Creator only, owner only)
 * @param   {string} id - Post ID (MongoDB ObjectId)
 * @body    {string} [title] - Post title (max 200 chars)
 * @body    {string} [type] - Post type: text, image, videoEmbed, link
 * @body    {string} [content] - Post content (max 5000 chars)
 * @body    {string} [mediaUrl] - Media URL
 * @body    {string} [videoEmbedUrl] - Video embed URL (YouTube/Vimeo only)
 * @body    {string} [linkUrl] - Link URL
 * @body    {boolean} [isLocked] - Whether post is locked
 * @body    {string} [accessType] - Access type: free, supporter-only, membership-only
 * @body    {string} [membershipTierRequired] - Required membership tier ID
 * @returns {object} Updated post with populated creator info
 */
router.put(
  '/:id',
  protect,
  authorize('creator'),
  updatePostValidation,
  handleValidationErrors,
  updatePostController
);

/**
 * @route   DELETE /api/posts/:id
 * @desc    Delete a post
 * @access  Private (Creator only, owner only)
 * @param   {string} id - Post ID (MongoDB ObjectId)
 * @returns {object} Success message
 */
router.delete('/:id', protect, authorize('creator'), deletePostController);

/**
 * @route   POST /api/posts/:id/image
 * @desc    Upload image for a post
 * @access  Private (Creator only, owner only)
 * @param   {string} id - Post ID (MongoDB ObjectId)
 * @body    {file} image - Image file (multipart/form-data, max 5MB)
 * @returns {object} Updated post with new image URL
 * @note    Post type must be 'image' to upload an image
 */
router.post(
  '/:id/image',
  protect,
  authorize('creator'),
  uploadSingle,
  uploadPostImageController
);

export default router;

