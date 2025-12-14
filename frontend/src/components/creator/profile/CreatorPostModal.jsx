import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Avatar,
  TextField,
  Button,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  Close,
  Image as ImageIcon,
  VideoLibrary,
  InsertLink,
  Article as ArticleIcon,
  Lock,
  Public,
  Group,
  EmojiEmotions,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../../hooks/authHook';
import { usePosts } from '../../../hooks/postHook';
import { displayNotification } from '../../../store/slices/uiSlice';
import { setActiveModal } from '../../../store/slices/uiSlice';

/**
 * Creator Post Modal Component
 * Modal for creating and editing posts
 */
const CreatorPostModal = ({ open, postType = 'text', onClose, existingPost = null, onSuccess }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { createPost, updatePost, uploadImage, operationLoading } = usePosts();

  const [title, setTitle] = useState(existingPost?.title || '');
  const [content, setContent] = useState(existingPost?.content || '');
  const [type, setType] = useState(existingPost?.type || postType);
  const [mediaUrl, setMediaUrl] = useState(existingPost?.mediaUrl || '');
  const [videoEmbedUrl, setVideoEmbedUrl] = useState(existingPost?.videoEmbedUrl || '');
  const [linkUrl, setLinkUrl] = useState(existingPost?.linkUrl || '');
  const [accessType, setAccessType] = useState(existingPost?.accessType || 'free');
  const [isLocked, setIsLocked] = useState(existingPost?.isLocked || false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);
  const isEditMode = !!existingPost;

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open && !isEditMode) {
      setTitle('');
      setContent('');
      setType(postType);
      setMediaUrl('');
      setVideoEmbedUrl('');
      setLinkUrl('');
      setAccessType('free');
      setIsLocked(false);
      setImagePreview(null);
      setImageFile(null);
      setErrors({});
    } else if (open && isEditMode) {
      setTitle(existingPost.title || '');
      setContent(existingPost.content || '');
      setType(existingPost.type || 'text');
      setMediaUrl(existingPost.mediaUrl || '');
      setVideoEmbedUrl(existingPost.videoEmbedUrl || '');
      setLinkUrl(existingPost.linkUrl || '');
      setAccessType(existingPost.accessType || 'free');
      setIsLocked(existingPost.isLocked || false);
      setImagePreview(existingPost.mediaUrl || null);
      setImageFile(null);
      setErrors({});
    }
  }, [open, isEditMode, postType, existingPost]);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        dispatch(
          displayNotification({
            message: 'Image size must be less than 5MB',
            type: 'error',
          })
        );
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setMediaUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters';
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required';
    } else if (content.length > 5000) {
      newErrors.content = 'Content cannot exceed 5000 characters';
    }

    if (type === 'videoEmbed' && !videoEmbedUrl.trim()) {
      newErrors.videoEmbedUrl = 'Video embed URL is required';
    }

    if (type === 'link' && !linkUrl.trim()) {
      newErrors.linkUrl = 'Link URL is required';
    }

    if (type === 'image' && !imageFile && !mediaUrl && !existingPost) {
      newErrors.image = 'Image is required for image posts';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const postData = {
        title: title.trim(),
        content: content.trim(),
        type,
        accessType,
        isLocked,
      };

      if (type === 'videoEmbed') {
        postData.videoEmbedUrl = videoEmbedUrl.trim();
      }

      if (type === 'link') {
        postData.linkUrl = linkUrl.trim();
      }

      let createdPost;
      if (isEditMode) {
        createdPost = await updatePost(existingPost._id, postData);
      } else {
        createdPost = await createPost(postData);
      }

      // Upload image if a new image file was selected
      if (type === 'image' && imageFile && createdPost) {
        await uploadImage(createdPost._id, imageFile);
      }

      dispatch(
        displayNotification({
          message: isEditMode ? 'Post updated successfully!' : 'Post created successfully!',
          type: 'success',
        })
      );

      // Call onSuccess callback to refresh posts list
      if (onSuccess) {
        onSuccess();
      }

      handleClose();
    } catch (error) {
      console.error('Failed to save post:', error);
      dispatch(
        displayNotification({
          message: error?.error || error?.message || 'Failed to save post',
          type: 'error',
        })
      );
    }
  };

  const handleClose = () => {
    if (!operationLoading) {
      // Only clear activeModal if this modal was opened via activeModal
      // If onClose is provided, it means it's being controlled externally (like edit modal)
      if (!onClose) {
        dispatch(setActiveModal(''));
      }
      onClose?.();
    }
  };

  const getTypeIcon = (postType) => {
    switch (postType) {
      case 'image':
        return <ImageIcon sx={{ color: '#45bd62' }} />;
      case 'videoEmbed':
        return <VideoLibrary sx={{ color: '#e42645' }} />;
      case 'link':
        return <InsertLink sx={{ color: '#1877f2' }} />;
      default:
        return <ArticleIcon sx={{ color: 'var(--theme-primary)' }} />;
    }
  };

  const getAccessTypeIcon = (access) => {
    switch (access) {
      case 'free':
        return <Public fontSize="small" />;
      case 'supporter-only':
        return <Group fontSize="small" />;
      case 'membership-only':
        return <Lock fontSize="small" />;
      default:
        return <Public fontSize="small" />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'var(--theme-bg)',
          borderRadius: '16px',
          border: '1px solid var(--theme-border)',
          maxHeight: '90vh',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2,
          borderBottom: '1px solid var(--theme-border)',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--theme-text)' }}>
          {isEditMode ? 'Edit Post' : 'Create Post'}
        </Typography>
        <IconButton
          onClick={handleClose}
          disabled={operationLoading}
          sx={{
            color: 'var(--theme-text-secondary)',
            '&:hover': {
              backgroundColor: 'var(--theme-bg-secondary)',
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      {/* Loading Bar */}
      {operationLoading && (
        <LinearProgress
          sx={{
            backgroundColor: 'var(--theme-bg-secondary)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'var(--theme-primary)',
            },
          }}
        />
      )}

      {/* Content */}
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* User Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={user?.avatarUrl}
              alt={user?.name || 'Profile'}
              sx={{ width: 40, height: 40 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--theme-text)' }}>
                {user?.name || 'Creator'}
              </Typography>
              {!isEditMode && (<FormControl size="small" sx={{ minWidth: 150, mt: 0.5 }}>
                <Select
                  value={accessType}
                  onChange={(e) => setAccessType(e.target.value)}
                  sx={{
                    color: 'var(--theme-text-secondary)',
                    fontSize: '0.875rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--theme-border)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--theme-primary)',
                    },
                  }}
                >
                  <MenuItem value="free">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Public fontSize="small" />
                      <span>Free</span>
                    </Box>
                  </MenuItem>
                  <MenuItem value="supporter-only">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Group fontSize="small" />
                      <span>Supporter Only</span>
                    </Box>
                  </MenuItem>
                  <MenuItem value="membership-only">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Lock fontSize="small" />
                      <span>Membership Only</span>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>)}
            </Box>
          </Box>

          {/* Post Type Selection (only for new posts) */}
          {!isEditMode && (
            <Box>
              <Typography variant="body2" sx={{ color: 'var(--theme-text-secondary)', mb: 1 }}>
                Post Type
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['text', 'image', 'videoEmbed', 'link'].map((postTypeOption) => (
                  <Chip
                    key={postTypeOption}
                    icon={getTypeIcon(postTypeOption)}
                    label={postTypeOption === 'videoEmbed' ? 'Video' : postTypeOption.charAt(0).toUpperCase() + postTypeOption.slice(1)}
                    onClick={() => setType(postTypeOption)}
                    color={type === postTypeOption ? 'primary' : 'default'}
                    sx={{
                      backgroundColor:
                        type === postTypeOption
                          ? 'var(--theme-primary)'
                          : 'var(--theme-bg-secondary)',
                      color:
                        type === postTypeOption
                          ? 'white'
                          : 'var(--theme-text-secondary)',
                      '&:hover': {
                        backgroundColor:
                          type === postTypeOption
                            ? 'var(--theme-secondary)'
                            : 'var(--theme-bg-tertiary)',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Title */}
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            required
            inputProps={{ maxLength: 200 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'var(--theme-bg-secondary)',
                '& fieldset': {
                  borderColor: 'var(--theme-border)',
                },
                '&:hover fieldset': {
                  borderColor: 'var(--theme-primary)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--theme-primary)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'var(--theme-text-secondary)',
              },
              '& .MuiInputBase-input': {
                color: 'var(--theme-text)',
              },
            }}
          />

          {/* Content */}
          <TextField
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            error={!!errors.content}
            helperText={errors.content}
            fullWidth
            required
            multiline
            rows={6}
            inputProps={{ maxLength: 5000 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'var(--theme-bg-secondary)',
                '& fieldset': {
                  borderColor: 'var(--theme-border)',
                },
                '&:hover fieldset': {
                  borderColor: 'var(--theme-primary)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--theme-primary)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'var(--theme-text-secondary)',
              },
              '& .MuiInputBase-input': {
                color: 'var(--theme-text)',
              },
            }}
          />

          {/* Image Upload */}
          {type === 'image' && (
            <Box>
              <Typography variant="body2" sx={{ color: 'var(--theme-text-secondary)', mb: 1 }}>
                Image {!isEditMode && '(Required)'}
              </Typography>
              {imagePreview ? (
                <Box sx={{ position: 'relative', mt: 1 }}>
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Preview"
                    sx={{
                      width: '100%',
                      maxHeight: 400,
                      objectFit: 'contain',
                      borderRadius: '8px',
                      border: '1px solid var(--theme-border)',
                    }}
                  />
                  <IconButton
                    onClick={handleRemoveImage}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      },
                    }}
                  >
                    <Close />
                  </IconButton>
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<ImageIcon />}
                  sx={{
                    borderColor: 'var(--theme-border)',
                    color: 'var(--theme-text-secondary)',
                    '&:hover': {
                      borderColor: 'var(--theme-primary)',
                      backgroundColor: 'var(--theme-bg-secondary)',
                    },
                  }}
                >
                  Choose Image
                  <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageSelect}
                  />
                </Button>
              )}
              {errors.image && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                  {errors.image}
                </Typography>
              )}
            </Box>
          )}

          {/* Video Embed URL */}
          {type === 'videoEmbed' && (
            <TextField
              label="Video Embed URL (YouTube or Vimeo)"
              value={videoEmbedUrl}
              onChange={(e) => setVideoEmbedUrl(e.target.value)}
              error={!!errors.videoEmbedUrl}
              helperText={errors.videoEmbedUrl || 'Paste YouTube or Vimeo URL'}
              fullWidth
              required
              placeholder="https://www.youtube.com/watch?v=..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'var(--theme-bg-secondary)',
                  '& fieldset': {
                    borderColor: 'var(--theme-border)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'var(--theme-primary)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--theme-primary)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'var(--theme-text-secondary)',
                },
                '& .MuiInputBase-input': {
                  color: 'var(--theme-text)',
                },
              }}
            />
          )}

          {/* Link URL */}
          {type === 'link' && (
            <TextField
              label="Link URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              error={!!errors.linkUrl}
              helperText={errors.linkUrl}
              fullWidth
              required
              placeholder="https://example.com"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'var(--theme-bg-secondary)',
                  '& fieldset': {
                    borderColor: 'var(--theme-border)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'var(--theme-primary)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--theme-primary)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'var(--theme-text-secondary)',
                },
                '& .MuiInputBase-input': {
                  color: 'var(--theme-text)',
                },
              }}
            />
          )}
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid var(--theme-border)',
        }}
      >
        <Button
          onClick={handleClose}
          disabled={operationLoading}
          sx={{
            color: 'var(--theme-text-secondary)',
            '&:hover': {
              backgroundColor: 'var(--theme-bg-secondary)',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={operationLoading}
          variant="contained"
          sx={{
            backgroundColor: 'var(--theme-primary)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'var(--theme-secondary)',
            },
            '&:disabled': {
              backgroundColor: 'var(--theme-bg-secondary)',
            },
          }}
        >
          {operationLoading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            isEditMode ? 'Update' : 'Post'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatorPostModal;

