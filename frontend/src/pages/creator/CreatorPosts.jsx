import { useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import useCreatorProfile from '../../hooks/creatorProfileHook';
import ProfileCompletionPrompt from '../../components/creator/profile/ProfileCompletionPrompt';

/**
 * Creator Posts Page
 * Shows creator's posts and profile completion prompt if needed
 */
const CreatorPosts = () => {
  const { profile, loading, getMyProfile } = useCreatorProfile();

  useEffect(() => {
    // Fetch profile to check completion status
    const fetchProfile = async () => {
      try {
        await getMyProfile();
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--theme-text)', mb: 3 }}>
          Creator Dashboard
        </Typography>

        {/* Profile Completion Prompt */}
        {profile && profile.completionStatus && (
          <ProfileCompletionPrompt
            profile={profile}
            completionStatus={profile.completionStatus}
          />
        )}

        {/* Posts Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'var(--theme-text)', mb: 2 }}>
            Your Posts
          </Typography>
          <Box
            sx={{
              p: 4,
              backgroundColor: 'var(--theme-bg-secondary)',
              borderRadius: 2,
              border: '1px dashed var(--theme-border)',
              textAlign: 'center',
            }}
          >
            <Typography variant="body1" sx={{ color: 'var(--theme-text-secondary)' }}>
              Your created posts will appear here.
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--theme-text-muted)', mt: 1 }}>
              Start creating content to engage with your supporters!
            </Typography>
          </Box>
        </Box>
      </motion.div>
    </Container>
  );
};

export default CreatorPosts;