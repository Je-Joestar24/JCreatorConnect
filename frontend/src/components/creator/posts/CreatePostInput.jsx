import { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Avatar, TextField, Button } from '@mui/material';
import { 
  Image as ImageIcon, 
  VideoLibrary, 
  InsertLink,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveModal } from '../../../store/slices/uiSlice';
import { useAuth } from '../../../hooks/authHook';
import CreatorPostModal from '../profile/CreatorPostModal';

/**
 * Create Post Input Component
 * Reusable "What's on your mind?" input for creating posts
 */
const CreatePostInput = ({ onPostCreated }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const activeModal = useSelector((state) => state.ui.activeModal);
  const [isFocused, setIsFocused] = useState(false);

  const handleOpenModal = (type = 'text') => {
    dispatch(setActiveModal(`create-post-${type}`));
  };

  const handleInputClick = () => {
    handleOpenModal('text');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box
          sx={{
            backgroundColor: 'var(--theme-bg-card)',
            border: `1px solid ${isFocused ? 'var(--theme-primary)' : 'var(--theme-border)'}`,
            borderRadius: '16px',
            padding: '20px',
            mb: 3,
            transition: 'all 0.3s ease',
            boxShadow: isFocused ? 'var(--theme-shadow-md)' : 'var(--theme-shadow-sm)',
          }}
        >
          {/* Input Area */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'flex-start',
              mb: 2,
            }}
          >
            <Avatar
              src={user?.avatarUrl || user?.profilePicture}
              alt={user?.name || 'Profile'}
              sx={{
                width: 48,
                height: 48,
                cursor: 'pointer',
                border: '2px solid var(--theme-border)',
              }}
            />
            <Box
              sx={{
                flex: 1,
                position: 'relative',
              }}
            >
              <TextField
                fullWidth
                placeholder="What's on your mind?"
                variant="outlined"
                onClick={handleInputClick}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'var(--theme-bg-secondary)',
                    borderRadius: '24px',
                    cursor: 'pointer',
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: 'var(--theme-border)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'var(--theme-primary)',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'var(--theme-text)',
                    cursor: 'pointer',
                    padding: '12px 16px',
                    '&::placeholder': {
                      color: 'var(--theme-text-muted)',
                      opacity: 1,
                    },
                  },
                }}
                inputProps={{
                  readOnly: true,
                }}
              />
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              borderTop: '1px solid var(--theme-border)',
              pt: 1.5,
            }}
          >
            <Button
              startIcon={
                <ImageIcon sx={{ color: '#45bd62' }} />
              }
              onClick={() => handleOpenModal('image')}
              sx={{
                flex: 1,
                textTransform: 'none',
                color: 'var(--theme-text-secondary)',
                fontWeight: 600,
                borderRadius: '8px',
                py: 1,
                '&:hover': {
                  backgroundColor: 'var(--theme-bg-secondary)',
                },
              }}
            >
              Photo
            </Button>
            <Button
              startIcon={
                <VideoLibrary sx={{ color: '#e42645' }} />
              }
              onClick={() => handleOpenModal('videoEmbed')}
              sx={{
                flex: 1,
                textTransform: 'none',
                color: 'var(--theme-text-secondary)',
                fontWeight: 600,
                borderRadius: '8px',
                py: 1,
                '&:hover': {
                  backgroundColor: 'var(--theme-bg-secondary)',
                },
              }}
            >
              Video
            </Button>
            <Button
              startIcon={
                <InsertLink sx={{ color: '#1877f2' }} />
              }
              onClick={() => handleOpenModal('link')}
              sx={{
                flex: 1,
                textTransform: 'none',
                color: 'var(--theme-text-secondary)',
                fontWeight: 600,
                borderRadius: '8px',
                py: 1,
                '&:hover': {
                  backgroundColor: 'var(--theme-bg-secondary)',
                },
              }}
            >
              Link
            </Button>
          </Box>
        </Box>
      </motion.div>

      {/* Post Creation Modal */}
      <CreatorPostModal
        open={activeModal?.startsWith('create-post-')}
        postType={activeModal?.replace('create-post-', '') || 'text'}
        onClose={() => dispatch(setActiveModal(''))}
        onSuccess={onPostCreated}
      />
    </>
  );
};

export default CreatePostInput;

