import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Link,
} from '@mui/material';
import {
  Lock,
  Image as ImageIcon,
  VideoLibrary,
  Link as LinkIcon,
  Article,
  MoreVert,
  Edit,
  Delete,
  Person,
} from '@mui/icons-material';
import { useAuth } from '../../../hooks/authHook';
import { usePosts } from '../../../hooks/postHook';
import { useDispatch } from 'react-redux';
import { showGlobalDialog } from '../../../store/slices/uiSlice';
import { displayNotification } from '../../../store/slices/uiSlice';
import CreatorPostModal from '../profile/CreatorPostModal';

/**
 * Posts Card Component
 * Reusable component for displaying individual post cards
 * Supports ownership indicators and edit/delete actions
 */
const PostsCards = ({ post, onPostUpdated, onPostDeleted }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { deletePost } = usePosts();

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Get creator info - handle both populated object and ID string
  const creatorIdValue = typeof post?.creatorId === 'object' ? post.creatorId._id : post?.creatorId;
  const creatorName = post?.creatorId?.name || post?.creatorId?.username || 'Unknown Creator';
  const creatorAvatar = post?.creatorId?.avatarUrl || post?.creatorId?.profilePicture;
  const creatorEmail = post?.creatorId?.email;

  // Check if current user owns this post
  const isOwner = user?._id === creatorIdValue;

  // Get post icon based on type
  const getPostIcon = (type) => {
    switch (type) {
      case 'image':
        return <ImageIcon sx={{ fontSize: 18 }} />;
      case 'videoEmbed':
        return <VideoLibrary sx={{ fontSize: 18 }} />;
      case 'link':
        return <LinkIcon sx={{ fontSize: 18 }} />;
      default:
        return <Article sx={{ fontSize: 18 }} />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setMenuAnchor(event.currentTarget);
    setSelectedPost(post);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEdit = (event) => {
    event.stopPropagation();
    setMenuAnchor(null);
    setEditModalOpen(true);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    setMenuAnchor(null);
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
            onPostDeleted?.();
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
    setTimeout(() => {
      setSelectedPost(null);
    }, 300);
  };

  const handleEditSuccess = () => {
    onPostUpdated?.();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          sx={{
            width: '100%',
            backgroundColor: 'var(--theme-bg-card)',
            border: '1px solid var(--theme-border)',
            borderRadius: '16px',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            position: 'relative',
            mb: 3,
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 'var(--theme-shadow-lg)',
              '& .post-menu-button': {
                opacity: 1,
              },
            },
          }}
        >
          {/* Header with creator info */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              pb: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
              <Avatar
                src={creatorAvatar}
                alt={creatorName}
                sx={{
                  width: 48,
                  height: 48,
                  border: '2px solid var(--theme-border)',
                }}
              >
                <Person />
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: 'var(--theme-text)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {creatorName}
                  </Typography>
                  {isOwner && (
                    <Chip
                      label="You"
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        backgroundColor: 'var(--theme-primary)',
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'var(--theme-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  {formatDate(post?.createdAt)}
                </Typography>
              </Box>
            </Box>

            {/* 3-dot menu (only for owner) */}
            {isOwner && (
              <IconButton
                className="post-menu-button"
                onClick={handleMenuOpen}
                sx={{
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  color: 'var(--theme-text-secondary)',
                  '&:hover': {
                    backgroundColor: 'var(--theme-bg-secondary)',
                  },
                }}
                aria-label="Post options"
              >
                <MoreVert />
              </IconButton>
            )}
          </Box>

          {/* Post Type Badge */}
          <Box sx={{ px: 2, pb: 1 }}>
            <Chip
              icon={getPostIcon(post?.type)}
              label={post?.type || 'text'}
              size="small"
              sx={{
                height: 24,
                fontSize: '0.75rem',
                backgroundColor: 'var(--theme-bg-secondary)',
                color: 'var(--theme-text-secondary)',
                border: '1px solid var(--theme-border)',
                '& .MuiChip-icon': {
                  color: 'var(--theme-primary)',
                },
              }}
            />
            {(post?.isLocked || post?.accessType !== 'free') && (
              <Chip
                icon={<Lock sx={{ fontSize: 14 }} />}
                label={
                  post?.accessType === 'supporter-only'
                    ? 'Supporter Only'
                    : post?.accessType === 'membership-only'
                    ? 'Membership Only'
                    : 'Locked'
                }
                size="small"
                sx={{
                  height: 24,
                  fontSize: '0.75rem',
                  ml: 1,
                  backgroundColor: 'rgba(124, 58, 237, 0.1)',
                  color: 'var(--theme-primary)',
                  border: '1px solid var(--theme-primary)',
                  '& .MuiChip-icon': {
                    color: 'var(--theme-primary)',
                  },
                }}
              />
            )}
          </Box>

          {/* Post Title */}
          <Box sx={{ px: 2, pb: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: 'var(--theme-text)',
                mb: 1,
                lineHeight: 1.4,
              }}
            >
              {post?.title}
            </Typography>
          </Box>

          {/* Post Media */}
          {post?.mediaUrl && post?.type === 'image' && (
            <CardMedia
              component="img"
              image={post.mediaUrl}
              alt={post.title}
              sx={{
                width: '100%',
                maxHeight: 500,
                objectFit: 'cover',
                backgroundColor: 'var(--theme-bg-secondary)',
              }}
            />
          )}

          {/* Video Embed */}
          {post?.videoEmbedUrl && post?.type === 'videoEmbed' && (
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%', // 16:9 aspect ratio
                backgroundColor: 'var(--theme-bg-secondary)',
              }}
            >
              <iframe
                src={post.videoEmbedUrl}
                title={post.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </Box>
          )}

          {/* Link Preview */}
          {post?.linkUrl && post?.type === 'link' && (
            <Box
              sx={{
                px: 2,
                py: 1.5,
                backgroundColor: 'var(--theme-bg-secondary)',
                borderTop: '1px solid var(--theme-border)',
                borderBottom: '1px solid var(--theme-border)',
              }}
            >
              <Link
                href={post.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'var(--theme-primary)',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                <LinkIcon sx={{ fontSize: 20 }} />
                <Typography
                  variant="body2"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                  }}
                >
                  {post.linkUrl}
                </Typography>
              </Link>
            </Box>
          )}

          {/* Post Content */}
          <CardContent sx={{ pt: 1.5 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'var(--theme-text-secondary)',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {post?.content}
            </Typography>
          </CardContent>

          {/* Footer */}
          <Box
            sx={{
              px: 2,
              pb: 2,
              pt: 1,
              borderTop: '1px solid var(--theme-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="caption" sx={{ color: 'var(--theme-text-muted)' }}>
              {post?.accessType === 'free' && !post?.isLocked
                ? 'Free Post'
                : post?.accessType === 'supporter-only'
                ? 'Supporter Only'
                : post?.accessType === 'membership-only'
                ? 'Membership Only'
                : 'Premium Content'}
            </Typography>
          </Box>
        </Card>
      </motion.div>

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
    </>
  );
};

export default PostsCards;

