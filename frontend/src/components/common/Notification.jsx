import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import { clearNotification } from '../../store/slices/uiSlice';

/**
 * Global Notification Component
 * Displays notifications from uiSlice
 */
const Notification = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.ui?.notification);

  const handleClose = () => {
    dispatch(clearNotification());
  };

  // Auto-close after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  if (!notification) return null;

  const severityMap = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info',
  };

  return (
    <Snackbar
      open={!!notification}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{
        position: 'fixed',
        zIndex: 9999,
        top: '20px !important',
        right: '20px !important',
        left: 'auto !important',
        transform: 'none !important',
        maxWidth: '400px',
      }}
    >
      <Alert
        onClose={handleClose}
        severity={severityMap[notification.type] || 'info'}
        variant="filled"
        sx={{
          width: '100%',
          boxShadow: 'var(--theme-shadow-lg)',
          minWidth: '300px',
        }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;

