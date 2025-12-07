import { motion } from 'framer-motion';
import { Box, Typography, Chip, Link, IconButton } from '@mui/material';
import {
  Instagram,
  YouTube,
  Twitter,
  Language,
  Edit,
} from '@mui/icons-material';

/**
 * Creator Profile Body Component
 * Displays bio, categories, social links, and support buttons
 */
const CreatorProfileBody = ({
  profile,
  isOwnProfile,
  onEditClick,
}) => {
  if (!profile) return null;

  const { profile: profileData, membershipTiers } = profile;
  const socials = profileData?.socials || {};

  const socialIcons = {
    instagram: Instagram,
    youtube: YouTube,
    twitter: Twitter,
    website: Language,
  };

  // Check if profile is incomplete
  const isIncomplete = profile.completionStatus && !profile.completionStatus.isComplete;

  return (
    <motion.div
      className="creator-profile-body"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Box className="profile-body-content">
        {/* Bio Section */}
        <Box className="bio-section">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--theme-text)' }}>
              About
            </Typography>
            {isOwnProfile && (
              <IconButton
                size="small"
                onClick={onEditClick}
                sx={{
                  color: 'var(--theme-primary)',
                  '&:hover': { backgroundColor: 'var(--theme-bg-secondary)' },
                }}
                aria-label="Edit bio"
              >
                <Edit fontSize="small" />
              </IconButton>
            )}
          </Box>
          {profileData?.bio ? (
            <Typography
              variant="body1"
              className="profile-bio"
              sx={{
                color: 'var(--theme-text-secondary)',
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
              }}
            >
              {profileData.bio}
            </Typography>
          ) : isOwnProfile ? (
            <Typography
              variant="body2"
              sx={{
                color: 'var(--theme-text-muted)',
                fontStyle: 'italic',
                opacity: 0.7,
              }}
            >
              Add a bio to tell your supporters about yourself! Click the edit button above to get started.
            </Typography>
          ) : null}
        </Box>

        {/* Categories Section */}
        {profileData?.categories && profileData.categories.length > 0 && (
          <Box className="categories-section" sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--theme-text)', mb: 1.5 }}>
              Categories
            </Typography>
            <Box className="categories-list" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {profileData.categories.map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Chip
                    label={category}
                    className="category-chip"
                    sx={{
                      backgroundColor: 'var(--theme-primary)',
                      color: 'white',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'var(--theme-secondary)',
                      },
                    }}
                  />
                </motion.div>
              ))}
            </Box>
          </Box>
        )}

        {/* Social Links Section */}
        {(socials.instagram || socials.youtube || socials.twitter || socials.website) && (
          <Box className="social-links-section" sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--theme-text)', mb: 1.5 }}>
              Connect
            </Typography>
            <Box className="social-links-list" sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {Object.entries(socials).map(([platform, url]) => {
                if (!url) return null;
                const Icon = socialIcons[platform];
                if (!Icon) return null;

                return (
                  <motion.a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <IconButton
                      sx={{
                        color: 'var(--theme-primary)',
                        backgroundColor: 'var(--theme-bg-secondary)',
                        '&:hover': {
                          backgroundColor: 'var(--theme-primary)',
                          color: 'white',
                        },
                      }}
                      aria-label={`Visit ${platform} profile`}
                    >
                      <Icon />
                    </IconButton>
                  </motion.a>
                );
              })}
            </Box>
          </Box>
        )}

        {/* Support Buttons Section */}
        <Box className="support-section" sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--theme-text)', mb: 2 }}>
            Support {profile.user?.name}
          </Typography>
          <Box className="support-buttons" sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {[5, 10, 25].map((amount) => (
              <motion.button
                key={amount}
                className="support-button"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400 }}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: '2px solid var(--theme-primary)',
                  backgroundColor: 'transparent',
                  color: 'var(--theme-primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                }}
                onHoverStart={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--theme-primary)';
                  e.currentTarget.style.color = 'white';
                }}
                onHoverEnd={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--theme-primary)';
                }}
              >
                ${amount}
              </motion.button>
            ))}
            <motion.button
              className="support-button custom"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400 }}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: '2px solid var(--theme-primary)',
                backgroundColor: 'var(--theme-primary)',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Custom Amount
            </motion.button>
          </Box>
        </Box>

        {/* Membership Tiers Section */}
        {membershipTiers && membershipTiers.length > 0 && (
          <Box className="membership-tiers-section" sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--theme-text)', mb: 2 }}>
              Membership Tiers
            </Typography>
            <Box className="tiers-list" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {membershipTiers.map((tier, index) => (
                <motion.div
                  key={tier._id}
                  className="tier-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--theme-bg-secondary)',
                    border: '1px solid var(--theme-border)',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--theme-text)' }}>
                    {tier.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--theme-text-secondary)', mt: 0.5 }}>
                    ${tier.price}/month
                  </Typography>
                  {tier.description && (
                    <Typography variant="body2" sx={{ color: 'var(--theme-text-secondary)', mt: 1 }}>
                      {tier.description}
                    </Typography>
                  )}
                </motion.div>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </motion.div>
  );
};

export default CreatorProfileBody;

