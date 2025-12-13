import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Person,
  Logout,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { useAuth } from '../../../hooks/authHook';

/**
 * Creator Header Profile Component
 * Displays user profile with dropdown menu (Profile & Logout)
 */
const CreatorHeaderProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleClose();
    navigate('/creator/profile');
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Box
          component="button"
          onClick={handleClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            padding: '8px 12px',
            borderRadius: 3,
            border: 'none',
            backgroundColor: open ? 'var(--theme-bg-secondary)' : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'var(--theme-bg-secondary)',
            },
          }}
          aria-label="User menu"
          aria-controls={open ? 'creator-profile-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            src={user.avatarUrl || '/default-avatar.png'}
            alt={user.name || 'User'}
            sx={{
              width: 40,
              height: 40,
              border: '2px solid var(--theme-primary)',
              backgroundColor: !user.avatarUrl ? 'var(--theme-primary)' : 'transparent',
            }}
          >
            {!user.avatarUrl && (user.name?.charAt(0) || 'U').toUpperCase()}
          </Avatar>
          <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'left' }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: 'var(--theme-text)',
                lineHeight: 1.2,
              }}
            >
              {user.name || 'Creator'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'var(--theme-text-secondary)',
                fontSize: '0.75rem',
                lineHeight: 1.2,
              }}
            >
              {user.email || ''}
            </Typography>
          </Box>
          <KeyboardArrowDown
            sx={{
              color: 'var(--theme-text-secondary)',
              fontSize: 20,
              transition: 'transform 0.3s ease',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </Box>
      </motion.div>

      <Menu
        id="creator-profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 1.5,
            minWidth: 220,
            borderRadius: 2,
            backgroundColor: 'var(--theme-bg-card)',
            border: '1px solid var(--theme-border)',
            boxShadow: 'var(--theme-shadow-lg)',
            overflow: 'visible',
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'var(--theme-bg-card)',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
              borderLeft: '1px solid var(--theme-border)',
              borderTop: '1px solid var(--theme-border)',
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid var(--theme-border)' }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: 'var(--theme-text)',
            }}
          >
            {user.name || 'Creator'}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'var(--theme-text-secondary)',
              fontSize: '0.75rem',
            }}
          >
            {user.email || ''}
          </Typography>
        </Box>

        <MenuItem
          onClick={handleProfileClick}
          sx={{
            py: 1.5,
            px: 2,
            '&:hover': {
              backgroundColor: 'var(--theme-bg-secondary)',
            },
          }}
        >
          <ListItemIcon>
            <Person sx={{ fontSize: 20, color: 'var(--theme-primary)' }} />
          </ListItemIcon>
          <ListItemText
            primary="Profile"
            primaryTypographyProps={{
              sx: {
                fontWeight: 500,
                color: 'var(--theme-text)',
              },
            }}
          />
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.5,
            px: 2,
            '&:hover': {
              backgroundColor: 'var(--theme-error)',
              '& .MuiListItemIcon-root': {
                color: 'white',
              },
              '& .MuiListItemText-primary': {
                color: 'white',
              },
            },
          }}
        >
          <ListItemIcon>
            <Logout sx={{ fontSize: 20, color: 'var(--theme-error)' }} />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              sx: {
                fontWeight: 500,
                color: 'var(--theme-text)',
              },
            }}
          />
        </MenuItem>
      </Menu>
    </>
  );
};

export default CreatorHeaderProfile;

