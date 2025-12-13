import Post from '../models/Post.js';
import User from '../models/User.js';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} buffer - Image file buffer
 * @param {string} folder - Cloudinary folder path
 * @param {string} publicId - Public ID for the image (optional)
 * @returns {Promise<string>} - Cloudinary secure URL
 */
const uploadToCloudinary = async (buffer, folder, publicId = null) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        public_id: publicId,
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    // Convert buffer to stream
    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null);
    bufferStream.pipe(uploadStream);
  });
};

/**
 * Upload image to local storage (fallback when Cloudinary is not available)
 * @param {Buffer} buffer - Image file buffer
 * @param {string} postId - Post ID
 * @returns {Promise<string>} - Local file URL
 */
const uploadToLocal = async (buffer, postId) => {
  const uploadsDir = path.join(__dirname, '../uploads');
  const targetDir = path.join(uploadsDir, 'posts');

  // Ensure directory exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Generate filename
  const timestamp = Date.now();
  const filename = `${postId}_${timestamp}.jpg`;
  const filepath = path.join(targetDir, filename);

  // Write file
  fs.writeFileSync(filepath, buffer);

  // Return URL path (will be served by Express static middleware)
  const urlPath = `/uploads/posts/${filename}`;
  return urlPath;
};

/**
 * Upload image buffer to Cloudinary with local storage fallback
 * @param {Buffer} buffer - Image file buffer
 * @param {string} folder - Cloudinary folder path
 * @param {string} publicId - Public ID for the image (optional)
 * @param {string} postId - Post ID (for local fallback)
 * @returns {Promise<string>} - Image URL (Cloudinary or local)
 */
const uploadImage = async (buffer, folder, publicId = null, postId = null) => {
  // Check if Cloudinary is configured
  const isCloudinaryConfigured =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  // Try Cloudinary first if configured
  if (isCloudinaryConfigured) {
    try {
      return await uploadToCloudinary(buffer, folder, publicId);
    } catch (error) {
      console.warn(
        'Cloudinary upload failed, falling back to local storage:',
        error.message
      );
      // Fall through to local storage
    }
  }

  // Fallback to local storage
  if (!postId) {
    throw new Error('Post ID is required for local storage fallback');
  }

  console.log(
    'Using local storage for image upload (Cloudinary not available or failed)'
  );
  const localPath = await uploadToLocal(buffer, postId);
  // Construct full URL for local files
  const backendPort = process.env.PORT || 5000;
  const backendHost = process.env.BACKEND_URL
    ? process.env.BACKEND_URL.replace('/api', '')
    : `http://localhost:${backendPort}`;
  return `${backendHost}${localPath}`;
};

/**
 * Create a new post
 * @param {string} creatorId - Creator user ID
 * @param {object} postData - Post data
 * @param {string} postData.title - Post title
 * @param {string} postData.type - Post type (text, image, videoEmbed, link)
 * @param {string} postData.content - Post content
 * @param {string} [postData.mediaUrl] - Media URL (for image type)
 * @param {string} [postData.videoEmbedUrl] - Video embed URL (for videoEmbed type)
 * @param {string} [postData.linkUrl] - Link URL (for link type)
 * @param {boolean} [postData.isLocked] - Whether post is locked
 * @param {string} [postData.accessType] - Access type (free, supporter-only, membership-only)
 * @param {string} [postData.membershipTierRequired] - Required membership tier ID
 * @returns {Promise<object>} - Created post
 * @throws {Error} - If creator not found or validation fails
 */
export const createPost = async (creatorId, postData) => {
  // Verify user exists and is a creator
  const user = await User.findById(creatorId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.role !== 'creator') {
    const error = new Error('Only creators can create posts');
    error.statusCode = 403;
    throw error;
  }

  // Create post
  const post = new Post({
    creatorId,
    ...postData,
  });

  await post.save();

  // Populate creator info
  await post.populate('creatorId', 'name email avatarUrl');

  return post;
};

/**
 * Get all posts with pagination and optional filters
 * @param {object} options - Query options
 * @param {number} [options.page=1] - Page number
 * @param {number} [options.limit=10] - Posts per page
 * @param {string} [options.accessType] - Filter by access type
 * @param {boolean} [options.isLocked] - Filter by locked status
 * @param {string} [options.creatorId] - Filter by creator ID
 * @returns {Promise<object>} - Posts with pagination metadata
 */
export const getPosts = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    accessType,
    isLocked,
    creatorId,
  } = options;

  // Build query
  const query = {};

  if (accessType) {
    query.accessType = accessType;
  }

  if (typeof isLocked === 'boolean') {
    query.isLocked = isLocked;
  }

  if (creatorId) {
    query.creatorId = creatorId;
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Execute query with pagination
  const [posts, total] = await Promise.all([
    Post.find(query)
      .populate('creatorId', 'name email avatarUrl')
      .populate('membershipTierRequired', 'name price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Post.countDocuments(query),
  ]);

  return {
    posts,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };
};

/**
 * Get a single post by ID
 * @param {string} postId - Post ID
 * @param {string} [userId] - Optional user ID for access control
 * @returns {Promise<object>} - Post with populated creator info
 * @throws {Error} - If post not found
 */
export const getPostById = async (postId, userId = null) => {
  const post = await Post.findById(postId)
    .populate('creatorId', 'name email avatarUrl')
    .populate('membershipTierRequired', 'name price');

  if (!post) {
    const error = new Error('Post not found');
    error.statusCode = 404;
    throw error;
  }

  return post;
};

/**
 * Get posts by creator ID with pagination
 * @param {string} creatorId - Creator user ID
 * @param {object} options - Query options
 * @param {number} [options.page=1] - Page number
 * @param {number} [options.limit=10] - Posts per page
 * @param {string} [options.accessType] - Filter by access type
 * @param {boolean} [options.isLocked] - Filter by locked status
 * @returns {Promise<object>} - Posts with pagination metadata
 * @throws {Error} - If creator not found
 */
export const getPostsByCreator = async (creatorId, options = {}) => {
  // Verify creator exists
  const user = await User.findById(creatorId);
  if (!user) {
    const error = new Error('Creator not found');
    error.statusCode = 404;
    throw error;
  }

  return await getPosts({
    ...options,
    creatorId,
  });
};

/**
 * Update a post (only by owner)
 * @param {string} postId - Post ID
 * @param {string} userId - User ID (must be post owner)
 * @param {object} updateData - Data to update
 * @returns {Promise<object>} - Updated post
 * @throws {Error} - If post not found or user is not owner
 */
export const updatePost = async (postId, userId, updateData) => {
  // Find post
  const post = await Post.findById(postId);
  if (!post) {
    const error = new Error('Post not found');
    error.statusCode = 404;
    throw error;
  }

  // Verify ownership
  if (post.creatorId.toString() !== userId.toString()) {
    const error = new Error('Not authorized to update this post');
    error.statusCode = 403;
    throw error;
  }

  // Update post
  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      post[key] = updateData[key];
    }
  });

  await post.save();

  // Populate creator info
  await post.populate('creatorId', 'name email avatarUrl');
  await post.populate('membershipTierRequired', 'name price');

  return post;
};

/**
 * Delete a post (only by owner)
 * @param {string} postId - Post ID
 * @param {string} userId - User ID (must be post owner)
 * @returns {Promise<void>}
 * @throws {Error} - If post not found or user is not owner
 */
export const deletePost = async (postId, userId) => {
  // Find post
  const post = await Post.findById(postId);
  if (!post) {
    const error = new Error('Post not found');
    error.statusCode = 404;
    throw error;
  }

  // Verify ownership
  if (post.creatorId.toString() !== userId.toString()) {
    const error = new Error('Not authorized to delete this post');
    error.statusCode = 403;
    throw error;
  }

  // Delete associated image from local storage if exists
  if (post.mediaUrl && post.mediaUrl.includes('/uploads/posts/')) {
    try {
      const filename = post.mediaUrl.split('/uploads/posts/')[1];
      const filepath = path.join(__dirname, '../uploads/posts', filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    } catch (error) {
      console.warn('Failed to delete local image file:', error.message);
    }
  }

  // Delete post
  await Post.findByIdAndDelete(postId);
};

/**
 * Upload image for a post
 * @param {string} postId - Post ID
 * @param {string} userId - User ID (must be post owner)
 * @param {object} file - Multer file object
 * @param {Buffer} file.buffer - File buffer
 * @param {string} file.mimetype - File MIME type
 * @returns {Promise<object>} - Updated post with new image URL
 * @throws {Error} - If upload fails or user is not owner
 */
export const uploadPostImage = async (postId, userId, file) => {
  // Find post
  const post = await Post.findById(postId);
  if (!post) {
    const error = new Error('Post not found');
    error.statusCode = 404;
    throw error;
  }

  // Verify ownership
  if (post.creatorId.toString() !== userId.toString()) {
    const error = new Error('Not authorized to update this post');
    error.statusCode = 403;
    throw error;
  }

  // Verify post type is 'image'
  if (post.type !== 'image') {
    const error = new Error('Post type must be "image" to upload an image');
    error.statusCode = 400;
    throw error;
  }

  try {
    // Delete old image if exists
    if (post.mediaUrl && post.mediaUrl.includes('/uploads/posts/')) {
      try {
        const filename = post.mediaUrl.split('/uploads/posts/')[1];
        const filepath = path.join(__dirname, '../uploads/posts', filename);
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
      } catch (error) {
        console.warn('Failed to delete old local image file:', error.message);
      }
    }

    // Upload image (tries Cloudinary first, falls back to local storage)
    const mediaUrl = await uploadImage(
      file.buffer,
      'jcreatorconnect/posts',
      `post_${postId}`,
      postId.toString()
    );

    // Update post
    post.mediaUrl = mediaUrl;
    await post.save();

    // Populate creator info
    await post.populate('creatorId', 'name email avatarUrl');
    await post.populate('membershipTierRequired', 'name price');

    return post;
  } catch (error) {
    // Preserve original error message for better debugging
    const errorMessage = error.message || 'Failed to upload post image';
    const uploadError = new Error(errorMessage);
    uploadError.statusCode = error.statusCode || 500;
    uploadError.originalError = error;
    console.error('Post image upload error:', error);
    throw uploadError;
  }
};

