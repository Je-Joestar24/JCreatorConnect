import {
  createPost,
  getPosts,
  getPostById,
  getPostsByCreator,
  updatePost,
  deletePost,
  uploadPostImage,
} from '../services/posts.service.js';

/**
 * @route   POST /api/posts
 * @desc    Create a new post
 * @access  Private (Creator only)
 * 
 * Creates a new post for the authenticated creator.
 * 
 * @param   {object} req - Express request object
 * @param   {object} req.user - Authenticated user (from protect middleware)
 * @param   {string} req.user._id - User ID
 * @param   {object} req.body - Post data
 * @param   {string} req.body.title - Post title
 * @param   {string} req.body.type - Post type (text, image, videoEmbed, link)
 * @param   {string} req.body.content - Post content
 * @param   {string} [req.body.mediaUrl] - Media URL (for image type)
 * @param   {string} [req.body.videoEmbedUrl] - Video embed URL (for videoEmbed type)
 * @param   {string} [req.body.linkUrl] - Link URL (for link type)
 * @param   {boolean} [req.body.isLocked] - Whether post is locked
 * @param   {string} [req.body.accessType] - Access type (free, supporter-only, membership-only)
 * @param   {string} [req.body.membershipTierRequired] - Required membership tier ID
 * @param   {object} res - Express response object
 * @param   {function} next - Express next middleware
 */
export const createPostController = async (req, res, next) => {
  try {
    const creatorId = req.user._id;
    const postData = req.body;

    // Create post
    const post = await createPost(creatorId, postData);

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/posts
 * @desc    Get all posts with pagination
 * @access  Public
 * 
 * Retrieves all posts with optional filtering and pagination.
 * Supports lazy loading for infinite scroll.
 * 
 * @param   {object} req - Express request object
 * @param   {object} req.query - Query parameters
 * @param   {number} [req.query.page=1] - Page number
 * @param   {number} [req.query.limit=10] - Posts per page
 * @param   {string} [req.query.accessType] - Filter by access type
 * @param   {boolean} [req.query.isLocked] - Filter by locked status
 * @param   {string} [req.query.creatorId] - Filter by creator ID
 * @param   {object} res - Express response object
 * @param   {function} next - Express next middleware
 */
export const getPostsController = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      accessType,
      isLocked,
      creatorId,
    } = req.query;

    // Parse boolean if provided
    const isLockedBool =
      isLocked !== undefined ? isLocked === 'true' : undefined;

    // Get posts with pagination
    const result = await getPosts({
      page: parseInt(page),
      limit: parseInt(limit),
      accessType,
      isLocked: isLockedBool,
      creatorId,
    });

    res.status(200).json({
      success: true,
      data: result.posts,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/posts/:id
 * @desc    Get a single post by ID
 * @access  Public
 * 
 * Retrieves a single post by its ID with populated creator information.
 * 
 * @param   {object} req - Express request object
 * @param   {string} req.params.id - Post ID
 * @param   {object} res - Express response object
 * @param   {function} next - Express next middleware
 */
export const getPostByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || null;

    // Get post
    const post = await getPostById(id, userId);

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/posts/creator/:creatorId
 * @desc    Get posts by creator ID with pagination
 * @access  Public
 * 
 * Retrieves all posts created by a specific creator with pagination.
 * Supports lazy loading for infinite scroll.
 * 
 * @param   {object} req - Express request object
 * @param   {string} req.params.creatorId - Creator user ID
 * @param   {object} req.query - Query parameters
 * @param   {number} [req.query.page=1] - Page number
 * @param   {number} [req.query.limit=10] - Posts per page
 * @param   {string} [req.query.accessType] - Filter by access type
 * @param   {boolean} [req.query.isLocked] - Filter by locked status
 * @param   {object} res - Express response object
 * @param   {function} next - Express next middleware
 */
export const getPostsByCreatorController = async (req, res, next) => {
  try {
    const { creatorId } = req.params;
    const {
      page = 1,
      limit = 10,
      accessType,
      isLocked,
    } = req.query;

    // Parse boolean if provided
    const isLockedBool =
      isLocked !== undefined ? isLocked === 'true' : undefined;

    // Get posts by creator with pagination
    const result = await getPostsByCreator(creatorId, {
      page: parseInt(page),
      limit: parseInt(limit),
      accessType,
      isLocked: isLockedBool,
    });

    res.status(200).json({
      success: true,
      data: result.posts,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/posts/:id
 * @desc    Update a post
 * @access  Private (Creator only, owner only)
 * 
 * Updates a post. Only the post owner can update their own posts.
 * 
 * @param   {object} req - Express request object
 * @param   {object} req.user - Authenticated user (from protect middleware)
 * @param   {string} req.user._id - User ID
 * @param   {string} req.params.id - Post ID
 * @param   {object} req.body - Post data to update
 * @param   {string} [req.body.title] - Post title
 * @param   {string} [req.body.type] - Post type
 * @param   {string} [req.body.content] - Post content
 * @param   {string} [req.body.mediaUrl] - Media URL
 * @param   {string} [req.body.videoEmbedUrl] - Video embed URL
 * @param   {string} [req.body.linkUrl] - Link URL
 * @param   {boolean} [req.body.isLocked] - Whether post is locked
 * @param   {string} [req.body.accessType] - Access type
 * @param   {string} [req.body.membershipTierRequired] - Required membership tier ID
 * @param   {object} res - Express response object
 * @param   {function} next - Express next middleware
 */
export const updatePostController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updateData = req.body;

    // Update post
    const post = await updatePost(id, userId, updateData);

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/posts/:id
 * @desc    Delete a post
 * @access  Private (Creator only, owner only)
 * 
 * Deletes a post. Only the post owner can delete their own posts.
 * Also deletes associated image files from local storage if they exist.
 * 
 * @param   {object} req - Express request object
 * @param   {object} req.user - Authenticated user (from protect middleware)
 * @param   {string} req.user._id - User ID
 * @param   {string} req.params.id - Post ID
 * @param   {object} res - Express response object
 * @param   {function} next - Express next middleware
 */
export const deletePostController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Delete post
    await deletePost(id, userId);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/posts/:id/image
 * @desc    Upload image for a post
 * @access  Private (Creator only, owner only)
 * 
 * Uploads an image for a post. Only works for posts with type 'image'.
 * Only the post owner can upload images to their posts.
 * 
 * @param   {object} req - Express request object
 * @param   {object} req.user - Authenticated user (from protect middleware)
 * @param   {string} req.user._id - User ID
 * @param   {string} req.params.id - Post ID
 * @param   {object} req.file - Uploaded file (from multer middleware)
 * @param   {Buffer} req.file.buffer - File buffer
 * @param   {string} req.file.mimetype - File MIME type
 * @param   {object} res - Express response object
 * @param   {function} next - Express next middleware
 */
export const uploadPostImageController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
    }

    // Upload image and update post
    const post = await uploadPostImage(id, userId, req.file);

    res.status(200).json({
      success: true,
      message: 'Post image uploaded successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

