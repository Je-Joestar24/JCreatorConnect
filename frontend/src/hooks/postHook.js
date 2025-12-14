import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllPosts,
  fetchPostById,
  fetchPostsByCreator,
  createNewPost,
  updateExistingPost,
  deleteExistingPost,
  uploadPostImageFile,
  clearAllPosts,
  clearCurrentPost,
  clearCreatorPosts,
  clearErrors,
  clearOperationError,
  resetPostsState,
} from '../store/slices/postsSlice.js';

/**
 * Custom hook for posts operations
 * Provides access to posts state and methods for CRUD operations
 * 
 * @returns {object} - Posts state and methods
 * 
 * @example
 * ```jsx
 * const {
 *   // State
 *   allPosts,
 *   allPostsPagination,
 *   allPostsLoading,
 *   currentPost,
 *   creatorPosts,
 *   operationLoading,
 * 
 *   // Methods
 *   getAllPosts,
 *   getPostById,
 *   getPostsByCreator,
 *   createPost,
 *   updatePost,
 *   deletePost,
 *   uploadImage,
 * } = usePosts();
 * ```
 */
export const usePosts = () => {
  const dispatch = useDispatch();
  const postsState = useSelector((state) => state.posts);

  // ============================================
  // FETCH METHODS
  // ============================================

  /**
   * Fetch all posts with pagination and optional filters
   * @param {object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Posts per page (default: 10)
   * @param {string} params.accessType - Filter by access type (free, supporter-only, membership-only)
   * @param {boolean} params.isLocked - Filter by locked status
   * @param {string} params.creatorId - Filter by creator ID
   * @returns {Promise<void>}
   * 
   * @example
   * ```jsx
   * await getAllPosts({ page: 1, limit: 10, accessType: 'free' });
   * ```
   */
  const getAllPosts = async (params = {}) => {
    try {
      await dispatch(fetchAllPosts(params)).unwrap();
    } catch (error) {
      console.error('Failed to fetch all posts:', error);
      const errorObj = {
        message: error?.error || error?.message || 'Failed to fetch posts',
        error: error?.error || error?.message,
        response: error?.response,
      };
      throw errorObj;
    }
  };

  /**
   * Fetch a single post by ID
   * @param {string} postId - Post ID (MongoDB ObjectId)
   * @returns {Promise<void>}
   * 
   * @example
   * ```jsx
   * await getPostById('507f1f77bcf86cd799439011');
   * ```
   */
  const getPostById = async (postId) => {
    try {
      await dispatch(fetchPostById(postId)).unwrap();
    } catch (error) {
      console.error('Failed to fetch post:', error);
      const errorObj = {
        message: error?.error || error?.message || 'Failed to fetch post',
        error: error?.error || error?.message,
        response: error?.response,
      };
      throw errorObj;
    }
  };

  /**
   * Fetch posts by creator ID with pagination and optional filters
   * @param {string} creatorId - Creator user ID (MongoDB ObjectId)
   * @param {object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Posts per page (default: 10)
   * @param {string} params.accessType - Filter by access type
   * @param {boolean} params.isLocked - Filter by locked status
   * @returns {Promise<void>}
   * 
   * @example
   * ```jsx
   * await getPostsByCreator('507f1f77bcf86cd799439011', { page: 1, limit: 20 });
   * ```
   */
  const getPostsByCreator = async (creatorId, params = {}) => {
    try {
      await dispatch(fetchPostsByCreator({ creatorId, params })).unwrap();
    } catch (error) {
      console.error('Failed to fetch creator posts:', error);
      const errorObj = {
        message: error?.error || error?.message || 'Failed to fetch creator posts',
        error: error?.error || error?.message,
        response: error?.response,
      };
      throw errorObj;
    }
  };

  // ============================================
  // CREATE/UPDATE/DELETE METHODS
  // ============================================

  /**
   * Create a new post
   * @param {object} postData - Post data
   * @param {string} postData.title - Post title (required, max 200 chars)
   * @param {string} postData.type - Post type: text, image, videoEmbed, link (required)
   * @param {string} postData.content - Post content (required, max 5000 chars)
   * @param {string} [postData.mediaUrl] - Media URL (for image type)
   * @param {string} [postData.videoEmbedUrl] - Video embed URL (for videoEmbed type)
   * @param {string} [postData.linkUrl] - Link URL (for link type)
   * @param {boolean} [postData.isLocked] - Whether post is locked (default: false)
   * @param {string} [postData.accessType] - Access type: free, supporter-only, membership-only (default: free)
   * @param {string} [postData.membershipTierRequired] - Required membership tier ID
   * @returns {Promise<object>} - Created post data
   * 
   * @example
   * ```jsx
   * const newPost = await createPost({
   *   title: 'My First Post',
   *   type: 'text',
   *   content: 'This is my first post content',
   *   accessType: 'free',
   * });
   * ```
   */
  const createPost = async (postData) => {
    try {
      const result = await dispatch(createNewPost(postData)).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
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
   * @param {string} [updateData.videoEmbedUrl] - Video embed URL
   * @param {string} [updateData.linkUrl] - Link URL
   * @param {boolean} [updateData.isLocked] - Whether post is locked
   * @param {string} [updateData.accessType] - Access type: free, supporter-only, membership-only
   * @param {string} [updateData.membershipTierRequired] - Required membership tier ID
   * @returns {Promise<object>} - Updated post data
   * 
   * @example
   * ```jsx
   * const updatedPost = await updatePost('507f1f77bcf86cd799439011', {
   *   title: 'Updated Title',
   *   content: 'Updated content',
   * });
   * ```
   */
  const updatePost = async (postId, updateData) => {
    try {
      const result = await dispatch(updateExistingPost({ postId, updateData })).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to update post:', error);
      throw error;
    }
  };

  /**
   * Delete a post
   * @param {string} postId - Post ID (MongoDB ObjectId)
   * @returns {Promise<void>}
   * 
   * @example
   * ```jsx
   * await deletePost('507f1f77bcf86cd799439011');
   * ```
   */
  const deletePost = async (postId) => {
    try {
      await dispatch(deleteExistingPost(postId)).unwrap();
    } catch (error) {
      console.error('Failed to delete post:', error);
      throw error;
    }
  };

  /**
   * Upload image for a post
   * @param {string} postId - Post ID (MongoDB ObjectId)
   * @param {File} file - Image file (multipart/form-data, max 5MB)
   * @returns {Promise<object>} - Updated post data with new image URL
   * @note Post type must be 'image' to upload an image
   * 
   * @example
   * ```jsx
   * const fileInput = document.querySelector('input[type="file"]');
   * const updatedPost = await uploadImage('507f1f77bcf86cd799439011', fileInput.files[0]);
   * ```
   */
  const uploadImage = async (postId, file) => {
    try {
      const result = await dispatch(uploadPostImageFile({ postId, file })).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to upload post image:', error);
      throw error;
    }
  };

  // ============================================
  // CLEAR METHODS
  // ============================================

  /**
   * Clear all posts state
   */
  const handleClearAllPosts = () => {
    dispatch(clearAllPosts());
  };

  /**
   * Clear current post state
   */
  const handleClearCurrentPost = () => {
    dispatch(clearCurrentPost());
  };

  /**
   * Clear creator posts state
   */
  const handleClearCreatorPosts = () => {
    dispatch(clearCreatorPosts());
  };

  /**
   * Clear all errors
   */
  const handleClearErrors = () => {
    dispatch(clearErrors());
  };

  /**
   * Clear operation error
   */
  const handleClearOperationError = () => {
    dispatch(clearOperationError());
  };

  /**
   * Reset all posts state to initial
   */
  const handleResetPostsState = () => {
    dispatch(resetPostsState());
  };

  // ============================================
  // RETURN
  // ============================================

  return {
    // ============================================
    // STATE - All Posts
    // ============================================
    allPosts: postsState.allPosts,
    allPostsPagination: postsState.allPostsPagination,
    allPostsLoading: postsState.allPostsLoading,
    allPostsError: postsState.allPostsError,

    // ============================================
    // STATE - Current Post
    // ============================================
    currentPost: postsState.currentPost,
    currentPostLoading: postsState.currentPostLoading,
    currentPostError: postsState.currentPostError,

    // ============================================
    // STATE - Creator Posts
    // ============================================
    creatorPosts: postsState.creatorPosts,
    creatorPostsPagination: postsState.creatorPostsPagination,
    creatorPostsLoading: postsState.creatorPostsLoading,
    creatorPostsError: postsState.creatorPostsError,
    currentCreatorId: postsState.currentCreatorId,

    // ============================================
    // STATE - Operations
    // ============================================
    operationLoading: postsState.operationLoading,
    operationError: postsState.operationError,

    // ============================================
    // METHODS - Fetch
    // ============================================
    getAllPosts,
    getPostById,
    getPostsByCreator,

    // ============================================
    // METHODS - Create/Update/Delete
    // ============================================
    createPost,
    updatePost,
    deletePost,
    uploadImage,

    // ============================================
    // METHODS - Clear
    // ============================================
    clearAllPosts: handleClearAllPosts,
    clearCurrentPost: handleClearCurrentPost,
    clearCreatorPosts: handleClearCreatorPosts,
    clearErrors: handleClearErrors,
    clearOperationError: handleClearOperationError,
    resetPostsState: handleResetPostsState,
  };
};

export default usePosts;

