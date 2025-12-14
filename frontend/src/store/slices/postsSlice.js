import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllPosts,
  getPostById,
  getPostsByCreator,
  createPost,
  updatePost,
  deletePost,
  uploadPostImage,
} from '../../services/creator/postsService.js';

// ============================================
// ASYNC THUNKS
// ============================================

/**
 * Async thunk for fetching all posts with pagination
 * @param {object} params - Query parameters (page, limit, accessType, isLocked, creatorId)
 */
export const fetchAllPosts = createAsyncThunk(
  'posts/fetchAllPosts',
  async (params = {}, { rejectWithValue }) => {
    const result = await getAllPosts(params);
    if (result.success) {
      return {
        posts: result.data,
        pagination: result.pagination,
      };
    } else {
      return rejectWithValue({ error: result.error });
    }
  }
);

/**
 * Async thunk for fetching a single post by ID
 * @param {string} postId - Post ID (MongoDB ObjectId)
 */
export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (postId, { rejectWithValue }) => {
    const result = await getPostById(postId);
    if (result.success) {
      return result.data;
    } else {
      return rejectWithValue({ error: result.error });
    }
  }
);

/**
 * Async thunk for fetching posts by creator ID
 * @param {object} payload - Object containing creatorId and optional params
 * @param {string} payload.creatorId - Creator user ID (MongoDB ObjectId)
 * @param {object} payload.params - Query parameters (page, limit, accessType, isLocked)
 */
export const fetchPostsByCreator = createAsyncThunk(
  'posts/fetchPostsByCreator',
  async ({ creatorId, params = {} }, { rejectWithValue }) => {
    const result = await getPostsByCreator(creatorId, params);
    if (result.success) {
      return {
        posts: result.data,
        pagination: result.pagination,
        creatorId,
      };
    } else {
      return rejectWithValue({ error: result.error });
    }
  }
);

/**
 * Async thunk for creating a new post
 * @param {object} postData - Post data (title, type, content, etc.)
 */
export const createNewPost = createAsyncThunk(
  'posts/createNewPost',
  async (postData, { rejectWithValue }) => {
    const result = await createPost(postData);
    if (result.success) {
      return result.data;
    } else {
      return rejectWithValue({
        error: result.error,
        errors: result.errors,
      });
    }
  }
);

/**
 * Async thunk for updating an existing post
 * @param {object} payload - Object containing postId and updateData
 * @param {string} payload.postId - Post ID (MongoDB ObjectId)
 * @param {object} payload.updateData - Post data to update
 */
export const updateExistingPost = createAsyncThunk(
  'posts/updateExistingPost',
  async ({ postId, updateData }, { rejectWithValue }) => {
    const result = await updatePost(postId, updateData);
    if (result.success) {
      return result.data;
    } else {
      return rejectWithValue({
        error: result.error,
        errors: result.errors,
      });
    }
  }
);

/**
 * Async thunk for deleting a post
 * @param {string} postId - Post ID (MongoDB ObjectId)
 */
export const deleteExistingPost = createAsyncThunk(
  'posts/deleteExistingPost',
  async (postId, { rejectWithValue }) => {
    const result = await deletePost(postId);
    if (result.success) {
      return postId; // Return postId to remove from state
    } else {
      return rejectWithValue({ error: result.error });
    }
  }
);

/**
 * Async thunk for uploading post image
 * @param {object} payload - Object containing postId and file
 * @param {string} payload.postId - Post ID (MongoDB ObjectId)
 * @param {File} payload.file - Image file
 */
export const uploadPostImageFile = createAsyncThunk(
  'posts/uploadPostImageFile',
  async ({ postId, file }, { rejectWithValue }) => {
    const result = await uploadPostImage(postId, file);
    if (result.success) {
      return result.data;
    } else {
      return rejectWithValue({ error: result.error });
    }
  }
);

// ============================================
// INITIAL STATE
// ============================================

const initialState = {
  // All posts (for general feed)
  allPosts: [],
  allPostsPagination: null,
  allPostsLoading: false,
  allPostsError: null,

  // Single post (for detail view)
  currentPost: null,
  currentPostLoading: false,
  currentPostError: null,

  // Creator posts (for creator's own posts or specific creator view)
  creatorPosts: [],
  creatorPostsPagination: null,
  creatorPostsLoading: false,
  creatorPostsError: null,
  currentCreatorId: null,

  // Create/Update/Delete operations
  operationLoading: false,
  operationError: null,
};

// ============================================
// SLICE
// ============================================

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    /**
     * Clear all posts state
     */
    clearAllPosts: (state) => {
      state.allPosts = [];
      state.allPostsPagination = null;
      state.allPostsError = null;
    },

    /**
     * Clear current post state
     */
    clearCurrentPost: (state) => {
      state.currentPost = null;
      state.currentPostError = null;
    },

    /**
     * Clear creator posts state
     */
    clearCreatorPosts: (state) => {
      state.creatorPosts = [];
      state.creatorPostsPagination = null;
      state.creatorPostsError = null;
      state.currentCreatorId = null;
    },

    /**
     * Clear all errors
     */
    clearErrors: (state) => {
      state.allPostsError = null;
      state.currentPostError = null;
      state.creatorPostsError = null;
      state.operationError = null;
    },

    /**
     * Clear operation error
     */
    clearOperationError: (state) => {
      state.operationError = null;
    },

    /**
     * Reset all state to initial
     */
    resetPostsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // ============================================
      // FETCH ALL POSTS
      // ============================================
      .addCase(fetchAllPosts.pending, (state) => {
        state.allPostsLoading = true;
        state.allPostsError = null;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.allPostsLoading = false;
        state.allPosts = action.payload.posts;
        state.allPostsPagination = action.payload.pagination;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.allPostsLoading = false;
        state.allPostsError = action.payload?.error || 'Failed to fetch posts';
      })

      // ============================================
      // FETCH POST BY ID
      // ============================================
      .addCase(fetchPostById.pending, (state) => {
        state.currentPostLoading = true;
        state.currentPostError = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.currentPostLoading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.currentPostLoading = false;
        state.currentPostError = action.payload?.error || 'Failed to fetch post';
      })

      // ============================================
      // FETCH POSTS BY CREATOR
      // ============================================
      .addCase(fetchPostsByCreator.pending, (state) => {
        state.creatorPostsLoading = true;
        state.creatorPostsError = null;
      })
      .addCase(fetchPostsByCreator.fulfilled, (state, action) => {
        state.creatorPostsLoading = false;
        state.creatorPosts = action.payload.posts;
        state.creatorPostsPagination = action.payload.pagination;
        state.currentCreatorId = action.payload.creatorId;
      })
      .addCase(fetchPostsByCreator.rejected, (state, action) => {
        state.creatorPostsLoading = false;
        state.creatorPostsError = action.payload?.error || 'Failed to fetch creator posts';
      })

      // ============================================
      // CREATE POST
      // ============================================
      .addCase(createNewPost.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(createNewPost.fulfilled, (state, action) => {
        state.operationLoading = false;
        // Add new post to creator posts if viewing own posts
        if (state.currentCreatorId && action.payload.creatorId?.toString() === state.currentCreatorId) {
          state.creatorPosts.unshift(action.payload);
        }
        // Also add to all posts
        state.allPosts.unshift(action.payload);
      })
      .addCase(createNewPost.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload?.error || 'Failed to create post';
      })

      // ============================================
      // UPDATE POST
      // ============================================
      .addCase(updateExistingPost.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(updateExistingPost.fulfilled, (state, action) => {
        state.operationLoading = false;
        const updatedPost = action.payload;

        // Update in current post if it's the same
        if (state.currentPost?._id === updatedPost._id) {
          state.currentPost = updatedPost;
        }

        // Update in all posts
        const allPostsIndex = state.allPosts.findIndex((p) => p._id === updatedPost._id);
        if (allPostsIndex !== -1) {
          state.allPosts[allPostsIndex] = updatedPost;
        }

        // Update in creator posts
        const creatorPostsIndex = state.creatorPosts.findIndex((p) => p._id === updatedPost._id);
        if (creatorPostsIndex !== -1) {
          state.creatorPosts[creatorPostsIndex] = updatedPost;
        }
      })
      .addCase(updateExistingPost.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload?.error || 'Failed to update post';
      })

      // ============================================
      // DELETE POST
      // ============================================
      .addCase(deleteExistingPost.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(deleteExistingPost.fulfilled, (state, action) => {
        state.operationLoading = false;
        const deletedPostId = action.payload;

        // Remove from current post if it's the same
        if (state.currentPost?._id === deletedPostId) {
          state.currentPost = null;
        }

        // Remove from all posts
        state.allPosts = state.allPosts.filter((p) => p._id !== deletedPostId);

        // Remove from creator posts
        state.creatorPosts = state.creatorPosts.filter((p) => p._id !== deletedPostId);
      })
      .addCase(deleteExistingPost.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload?.error || 'Failed to delete post';
      })

      // ============================================
      // UPLOAD POST IMAGE
      // ============================================
      .addCase(uploadPostImageFile.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(uploadPostImageFile.fulfilled, (state, action) => {
        state.operationLoading = false;
        const updatedPost = action.payload;

        // Update in current post if it's the same
        if (state.currentPost?._id === updatedPost._id) {
          state.currentPost = updatedPost;
        }

        // Update in all posts
        const allPostsIndex = state.allPosts.findIndex((p) => p._id === updatedPost._id);
        if (allPostsIndex !== -1) {
          state.allPosts[allPostsIndex] = updatedPost;
        }

        // Update in creator posts
        const creatorPostsIndex = state.creatorPosts.findIndex((p) => p._id === updatedPost._id);
        if (creatorPostsIndex !== -1) {
          state.creatorPosts[creatorPostsIndex] = updatedPost;
        }
      })
      .addCase(uploadPostImageFile.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload?.error || 'Failed to upload post image';
      });
  },
});

// ============================================
// EXPORTS
// ============================================

export const {
  clearAllPosts,
  clearCurrentPost,
  clearCreatorPosts,
  clearErrors,
  clearOperationError,
  resetPostsState,
} = postsSlice.actions;

export default postsSlice.reducer;

