import api from '../../api/axios.js';

/**
 * Get all posts with pagination and optional filters
 * @param {object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Posts per page (default: 10)
 * @param {string} params.accessType - Filter by access type (free, supporter-only, membership-only)
 * @param {boolean} params.isLocked - Filter by locked status
 * @param {string} params.creatorId - Filter by creator ID
 * @returns {Promise<object>} - Response with posts array and pagination metadata
 */
export const getAllPosts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.accessType) queryParams.append('accessType', params.accessType);
    if (params.isLocked !== undefined) queryParams.append('isLocked', params.isLocked);
    if (params.creatorId) queryParams.append('creatorId', params.creatorId);

    const queryString = queryParams.toString();
    const url = `/posts${queryString ? `?${queryString}` : ''}`;

    const response = await api.get(url);
    return {
      success: true,
      data: response.data.data,
      pagination: response.data.pagination || null,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch posts',
    };
  }
};

/**
 * Get a single post by ID
 * @param {string} postId - Post ID (MongoDB ObjectId)
 * @returns {Promise<object>} - Response with post data
 */
export const getPostById = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch post',
    };
  }
};

/**
 * Get posts by creator ID with pagination and optional filters
 * @param {string} creatorId - Creator user ID (MongoDB ObjectId)
 * @param {object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Posts per page (default: 10)
 * @param {string} params.accessType - Filter by access type
 * @param {boolean} params.isLocked - Filter by locked status
 * @returns {Promise<object>} - Response with posts array and pagination metadata
 */
export const getPostsByCreator = async (creatorId, params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.accessType) queryParams.append('accessType', params.accessType);
    if (params.isLocked !== undefined) queryParams.append('isLocked', params.isLocked);

    const queryString = queryParams.toString();
    const url = `/posts/creator/${creatorId}${queryString ? `?${queryString}` : ''}`;

    const response = await api.get(url);
    return {
      success: true,
      data: response.data.data,
      pagination: response.data.pagination || null,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch creator posts',
    };
  }
};

/**
 * Create a new post
 * @param {object} postData - Post data
 * @param {string} postData.title - Post title (required, max 200 chars)
 * @param {string} postData.type - Post type: text, image, videoEmbed, link (required)
 * @param {string} postData.content - Post content (required, max 5000 chars)
 * @param {string} [postData.mediaUrl] - Media URL (for image type)
 * @param {string} [postData.videoEmbedUrl] - Video embed URL (for videoEmbed type, YouTube/Vimeo only)
 * @param {string} [postData.linkUrl] - Link URL (for link type)
 * @param {boolean} [postData.isLocked] - Whether post is locked (default: false)
 * @param {string} [postData.accessType] - Access type: free, supporter-only, membership-only (default: free)
 * @param {string} [postData.membershipTierRequired] - Required membership tier ID (required if accessType is membership-only)
 * @returns {Promise<object>} - Response with created post
 */
export const createPost = async (postData) => {
  try {
    const response = await api.post('/posts', postData);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Post created successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create post',
      errors: error.response?.data?.errors || null,
    };
  }
};

/**
 * Update an existing post
 * @param {string} postId - Post ID (MongoDB ObjectId)
 * @param {object} updateData - Post data to update (all fields optional)
 * @param {string} [updateData.title] - Post title (max 200 chars)
 * @param {string} [updateData.type] - Post type: text, image, videoEmbed, link
 * @param {string} [updateData.content] - Post content (max 5000 chars)
 * @param {string} [updateData.mediaUrl] - Media URL
 * @param {string} [updateData.videoEmbedUrl] - Video embed URL (YouTube/Vimeo only)
 * @param {string} [updateData.linkUrl] - Link URL
 * @param {boolean} [updateData.isLocked] - Whether post is locked
 * @param {string} [updateData.accessType] - Access type: free, supporter-only, membership-only
 * @param {string} [updateData.membershipTierRequired] - Required membership tier ID
 * @returns {Promise<object>} - Response with updated post
 */
export const updatePost = async (postId, updateData) => {
  try {
    const response = await api.put(`/posts/${postId}`, updateData);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Post updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update post',
      errors: error.response?.data?.errors || null,
    };
  }
};

/**
 * Delete a post
 * @param {string} postId - Post ID (MongoDB ObjectId)
 * @returns {Promise<object>} - Response with success message
 */
export const deletePost = async (postId) => {
  try {
    const response = await api.delete(`/posts/${postId}`);
    return {
      success: true,
      message: response.data.message || 'Post deleted successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete post',
    };
  }
};

/**
 * Upload image for a post
 * @param {string} postId - Post ID (MongoDB ObjectId)
 * @param {File} file - Image file (multipart/form-data, max 5MB)
 * @returns {Promise<object>} - Response with updated post containing new image URL
 * @note Post type must be 'image' to upload an image
 */
export const uploadPostImage = async (postId, file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post(`/posts/${postId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Post image uploaded successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to upload post image',
    };
  }
};

