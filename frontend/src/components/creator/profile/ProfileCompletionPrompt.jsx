import { motion } from 'framer-motion';
import { Box, Card, CardContent, Typography, Button, LinearProgress, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { CheckCircle, Circle, Edit, PhotoCamera, Description, Link as LinkIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

/**
 * Profile Completion Prompt Component
 * Shows what needs to be completed in the creator profile
 */
const ProfileCompletionPrompt = ({ profile, completionStatus }) => {
  const navigate = useNavigate();

  if (!completionStatus || completionStatus.isComplete) {
    return null;
  }

  const { missingFields, completionPercentage } = completionStatus;

  const fieldIcons = {
    bio: <Description />,
    avatarUrl: <PhotoCamera />,
    bannerUrl: <PhotoCamera />,
    socials: <LinkIcon />,
  };

  const fieldLabels = {
    bio: 'Add a bio',
    avatarUrl: 'Upload profile picture',
    bannerUrl: 'Upload banner image',
    socials: 'Add social media links',
  };

  const handleCompleteProfile = () => {
    navigate('/creator/profile');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          mb: 3,
          background: `linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-secondary) 100%)`,
          color: 'white',
          border: 'none',
          boxShadow: 'var(--theme-shadow-lg)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
              Complete Your Profile
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
              {completionPercentage}%
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={completionPercentage}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              mb: 2,
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'white',
              },
            }}
          />

          <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
            Complete your profile to attract more supporters! Add the following details:
          </Typography>

          <List sx={{ mb: 2 }}>
            {missingFields.map((field, index) => (
              <motion.div
                key={field}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ListItem
                  sx={{
                    py: 0.5,
                    px: 0,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 1,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: 'white' }}>
                    <Circle fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={fieldLabels[field] || field}
                    primaryTypographyProps={{
                      sx: { color: 'white', fontWeight: 500 },
                    }}
                  />
                </ListItem>
              </motion.div>
            ))}
          </List>

          <Button
            variant="contained"
            fullWidth
            onClick={handleCompleteProfile}
            sx={{
              backgroundColor: 'white',
              color: 'var(--theme-primary)',
              fontWeight: 600,
              py: 1.5,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                transform: 'translateY(-2px)',
              },
            }}
            startIcon={<Edit />}
          >
            Complete Profile Now
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileCompletionPrompt;

