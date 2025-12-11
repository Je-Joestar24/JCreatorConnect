import { motion } from 'framer-motion';
import { Box, Typography, Chip } from '@mui/material';

/**
 * Creator Profile Body Component
 * Displays categories and membership tiers (if any)
 * Most content moved to header for minimalist design
 */
const CreatorProfileBody = ({
  profile,
  isOwnProfile,
}) => {
  if (!profile) return null;

  const { profile: profileData, membershipTiers } = profile;

  return (
    <motion.div
      className="creator-profile-body"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Categories Section */}
      {profileData?.categories && profileData.categories.length > 0 && (
        <Box className="categories-section" sx={{ mb: 3 }}>
          <Box className="categories-list" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {profileData.categories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
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
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                />
              </motion.div>
            ))}
          </Box>
        </Box>
      )}

      {/* Membership Tiers Section */}
      {membershipTiers && membershipTiers.length > 0 && (
        <Box className="membership-tiers-section" sx={{ mt: 3 }}>
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
    </motion.div>
  );
};

export default CreatorProfileBody;
