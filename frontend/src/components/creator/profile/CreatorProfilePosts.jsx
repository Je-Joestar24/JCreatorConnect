import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Lock,
  Image,
  VideoLibrary,
  Link as LinkIcon,
  Article,
  MoreVert,
  Edit,
  Delete,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { usePosts } from '../../../hooks/postHook';
import { showGlobalDialog } from '../../../store/slices/uiSlice';
import { displayNotification } from '../../../store/slices/uiSlice';
import { setActiveModal } from '../../../store/slices/uiSlice';
import CreatorPostModal from './CreatorPostModal';

/**
 * Creator Profile Posts Component
 * Displays free posts and locked posts preview
 * Loads posts from API using usePosts hook
 */
const CreatorProfilePosts = ({ creatorId, isOwnProfile, refreshTrigger }) => {
  const dispatch = useDispatch();
  const {
    creatorPosts,
    creatorPostsLoading,
    creatorPostsError,
    getPostsByCreator,
    deletePost,
  } = usePosts();

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Load posts when component mounts or creatorId changes
  useEffect(() => {
    if (creatorId) {
      getPostsByCreator(creatorId, { page: 1, limit: 50 });
    }
  }, [creatorId, refreshTrigger]); // eslint-disable-line react-hooks/exhaustive-deps

  // Separate free and locked posts
  const { free, locked } = useMemo(() => {
    if (!creatorPosts || creatorPosts.length === 0) {
      return { free: [], locked: [] };
    }

    const freePosts = creatorPosts.filter((post) => post.accessType === 'free' && !post.isLocked);
    const lockedPosts = creatorPosts.filter((post) => post.accessType !== 'free' || post.isLocked);

    return { free: freePosts, locked: lockedPosts };
  }, [creatorPosts]);

  const handleMenuOpen = (event, post) => {
    event.stopPropagation();
    event.preventDefault();
    setMenuAnchor(event.currentTarget);
    setSelectedPost(post);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    // Don't clear selectedPost here - we need it for the modal
  };

  const handleEdit = (event) => {
    event.stopPropagation();
    setMenuAnchor(null); // Close menu
    setEditModalOpen(true);
    // Keep selectedPost for the modal
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    setMenuAnchor(null); // Close menu
    if (!selectedPost) return;

    dispatch(
      showGlobalDialog({
        type: 'danger',
        title: 'Delete Post',
        message: `Are you sure you want to delete "${selectedPost.title}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        onConfirm: async () => {
          try {
            await deletePost(selectedPost._id);
            dispatch(
              displayNotification({
                message: 'Post deleted successfully!',
                type: 'success',
              })
            );
            // Refresh posts
            if (creatorId) {
              getPostsByCreator(creatorId, { page: 1, limit: 50 });
            }
          } catch (error) {
            dispatch(
              displayNotification({
                message: error?.error || error?.message || 'Failed to delete post',
                type: 'error',
              })
            );
          }
        },
      })
    );
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    // Clear selectedPost after a small delay to ensure modal closes properly
    setTimeout(() => {
      setSelectedPost(null);
    }, 300);
  };

  const handleEditSuccess = () => {
    // Refresh posts after edit
    if (creatorId) {
      getPostsByCreator(creatorId, { page: 1, limit: 50 });
    }
  };

  // Loading state
  if (creatorPostsLoading) {
    return (
      <motion.div
        className="creator-profile-posts"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Box className="posts-container">
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--theme-text)', mb: 3 }}>
            Posts
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: 'var(--theme-primary)' }} />
          </Box>
        </Box>
      </motion.div>
    );
  }

  // Error state
  if (creatorPostsError) {
    return (
      <motion.div
        className="creator-profile-posts"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Box className="posts-container">
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--theme-text)', mb: 3 }}>
            Posts
          </Typography>
          <Alert severity="error" sx={{ backgroundColor: 'var(--theme-bg-secondary)', color: 'var(--theme-error)' }}>
            {creatorPostsError}
          </Alert>
        </Box>
      </motion.div>
    );
  }

  const getPostIcon = (type) => {
    switch (type) {
      case 'image':
        return <Image />;
      case 'videoEmbed':
        return <VideoLibrary />;
      case 'link':
        return <LinkIcon />;
      default:
        return <Article />;
    }
  };

  return (
    <motion.div
      className="creator-profile-posts"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Box className="posts-container">
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--theme-text)', mb: 3 }}>
          Posts
        </Typography>

        {/* Free Posts */}
        {free.length > 0 && (
          <Box className="free-posts-section" sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--theme-text-secondary)', mb: 2 }}>
              Free Posts
            </Typography>
            <Box className="posts-grid" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
              {free.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="post-card"
                    sx={{
                      height: '100%',
                      backgroundColor: 'var(--theme-bg-card)',
                      border: '1px solid var(--theme-border)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 'var(--theme-shadow-lg)',
                        '& .post-menu-button': {
                          opacity: 1,
                        },
                      },
                    }}
                  >
                    {/* 3-dot menu button (only for own profile) */}
                    {isOwnProfile && (
                      <IconButton
                        className="post-menu-button"
                        onClick={(e) => handleMenuOpen(e, post)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          color: 'white',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          zIndex: 10,
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          },
                        }}
                        aria-label="Post options"
                      >
                        <MoreVert />
                      </IconButton>
                    )}
                    {post.mediaUrl && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={post.mediaUrl}
                        alt={post.title}
                        sx={{ objectFit: 'cover' }}
                      />
                    )}
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {getPostIcon(post.type)}
                        <Typography variant="caption" sx={{ color: 'var(--theme-text-muted)' }}>
                          {post.type}
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--theme-text)', mb: 1 }}>
                        {post.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'var(--theme-text-secondary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {post.content}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'var(--theme-text-muted)', mt: 1, display: 'block' }}>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </Box>
        )}

        {/* Locked Posts - Show full content if owner, preview if not */}
        {locked.length > 0 && (
          <Box className="locked-posts-section">
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--theme-text-secondary)', mb: 2 }}>
              {isOwnProfile ? 'Premium Posts' : 'Locked Posts'}
            </Typography>
            {isOwnProfile ? (
              // Show full content for owner
              <Box className="posts-grid" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                {locked.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className="post-card"
                      sx={{
                        height: '100%',
                        backgroundColor: 'var(--theme-bg-card)',
                        border: '1px solid var(--theme-border)',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 'var(--theme-shadow-lg)',
                          '& .post-menu-button': {
                            opacity: 1,
                          },
                        },
                      }}
                    >
                      {/* 3-dot menu button */}
                      <IconButton
                        className="post-menu-button"
                        onClick={(e) => handleMenuOpen(e, post)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          color: 'white',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          zIndex: 10,
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          },
                        }}
                        aria-label="Post options"
                      >
                        <MoreVert />
                      </IconButton>
                      {post.mediaUrl && (
                        <CardMedia
                          component="img"
                          height="200"
                          image={post.mediaUrl}
                          alt={post.title}
                          sx={{ objectFit: 'cover' }}
                        />
                      )}
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          {getPostIcon(post.type)}
                          <Typography variant="caption" sx={{ color: 'var(--theme-text-muted)' }}>
                            {post.type}
                          </Typography>
                          <Lock sx={{ color: 'var(--theme-primary)', fontSize: 16, ml: 'auto' }} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--theme-text)', mb: 1 }}>
                          {post.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'var(--theme-text-secondary)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {post.content}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'var(--theme-text-muted)', mt: 1, display: 'block' }}>
                          {post.accessType === 'supporter-only' ? 'Supporter Only' : 'Membership Only'} • {new Date(post.createdAt).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </Box>
            ) : (
              // Show preview for non-owners
              <Box className="locked-posts-list" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {locked.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className="locked-post-card"
                      sx={{
                        backgroundColor: 'var(--theme-bg-secondary)',
                        border: '1px solid var(--theme-border)',
                        opacity: 0.7,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                      }}
                    >
                      <Lock sx={{ color: 'var(--theme-primary)' }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--theme-text)' }}>
                          {post.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'var(--theme-text-muted)' }}>
                          {post.accessType === 'supporter-only' ? 'Supporter Only' : 'Membership Only'} • {new Date(post.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Card>
                  </motion.div>
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* Edit Modal */}
        <CreatorPostModal
          open={editModalOpen && !!selectedPost}
          existingPost={selectedPost}
          onClose={handleEditModalClose}
          onSuccess={handleEditSuccess}
        />

        {/* 3-dot Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          onClick={(e) => e.stopPropagation()}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              backgroundColor: 'var(--theme-bg)',
              border: '1px solid var(--theme-border)',
              borderRadius: '8px',
              minWidth: 150,
              boxShadow: 'var(--theme-shadow-lg)',
              mt: 0.5,
            },
          }}
        >
          <MenuItem
            onClick={handleEdit}
            sx={{
              color: 'var(--theme-text)',
              '&:hover': {
                backgroundColor: 'var(--theme-bg-secondary)',
              },
            }}
          >
            <ListItemIcon>
              <Edit fontSize="small" sx={{ color: 'var(--theme-primary)' }} />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={handleDelete}
            sx={{
              color: 'var(--theme-error)',
              '&:hover': {
                backgroundColor: 'var(--theme-bg-secondary)',
              },
            }}
          >
            <ListItemIcon>
              <Delete fontSize="small" sx={{ color: 'var(--theme-error)' }} />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>

        {/* Empty State */}
        {free.length === 0 && locked.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                textAlign: 'center',
                py: 6,
                px: 3,
                backgroundColor: 'var(--theme-bg-secondary)',
                borderRadius: 2,
                border: '1px dashed var(--theme-border)',
              }}
            >
              <Typography variant="h6" sx={{ color: 'var(--theme-text)', mb: 1, fontWeight: 600 }}>
                No posts yet
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--theme-text-secondary)' }}>
                Start creating content to engage with your supporters!
              </Typography>
            </Box>
          </motion.div>
        )}
      </Box>
    </motion.div>
  );
};

export default CreatorProfilePosts;

