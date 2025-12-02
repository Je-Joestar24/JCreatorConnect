import { motion } from 'framer-motion';
import { Box, Avatar, Typography } from '@mui/material';
/**
 * Creator Profile Header Component
 * Displays profile picture, name, username, and basic info
 */
const CreatorProfileHeader = ({ profile, isOwnProfile }) => {
  if (!profile?.user) return null;

  const { user } = profile;

  return (
    <motion.div
      className="creator-profile-header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Box className="profile-header-content">
        <motion.div
          className="profile-avatar-wrapper"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Avatar
            src={user.avatarUrl || '/default-avatar.png'}
            alt={`${user.name}'s profile picture`}
            className="profile-avatar"
            sx={{
              width: { xs: 80, sm: 100, md: 120 },
              height: { xs: 80, sm: 100, md: 120 },
              border: '4px solid var(--theme-bg)',
              boxShadow: 'var(--theme-shadow-lg)',
              backgroundColor: !user.avatarUrl ? 'var(--theme-primary)' : 'transparent',
            }}
          >
            {!user.avatarUrl && user.name?.charAt(0).toUpperCase()}
          </Avatar>
        </motion.div>

        <Box className="profile-info">
          <Typography
            variant="h4"
            component="h1"
            className="profile-name"
            sx={{
              fontWeight: 700,
              color: 'var(--theme-text)',
              mb: 0.5,
            }}
          >
            {user.name}
          </Typography>

          <Typography
            variant="body2"
            className="profile-username"
            sx={{
              color: 'var(--theme-text-secondary)',
              mb: 2,
            }}
          >
            @{user.username || user.email?.split('@')[0]}
          </Typography>

          {profile.stats && (
            <Box className="profile-stats">
              <motion.div
                className="stat-item"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Typography variant="h6" sx={{ color: 'var(--theme-primary)', fontWeight: 700 }}>
                  {profile.stats.supportersCount || 0}
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--theme-text-secondary)' }}>
                  Supporters
                </Typography>
              </motion.div>
            </Box>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

export default CreatorProfileHeader;

