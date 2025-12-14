import { useSelector, useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import {
  Close,
  Warning,
  Error,
  CheckCircle,
  Info,
  Delete,
} from '@mui/icons-material';
import { hideGlobalDialog, clearGlobalDialog } from '../../store/slices/uiSlice';

/**
 * Global Dialog Box Component
 * Displays confirmation dialogs from uiSlice
 * Supports different types: info, success, warning, danger
 */
const GlobalDialogBox = () => {
  const dispatch = useDispatch();
  const globalDialog = useSelector((state) => state.ui?.globalDialog);

  if (!globalDialog || !globalDialog.open) return null;

  const handleClose = () => {
    if (globalDialog.onCancel) {
      globalDialog.onCancel();
    }
    dispatch(hideGlobalDialog());
  };

  const handleConfirm = () => {
    if (globalDialog.onConfirm) {
      globalDialog.onConfirm();
    }
    dispatch(clearGlobalDialog());
  };

  const getIcon = () => {
    if (globalDialog.icon) {
      return globalDialog.icon;
    }

    switch (globalDialog.type) {
      case 'danger':
      case 'error':
        return <Error sx={{ color: 'var(--theme-error)', fontSize: 40 }} />;
      case 'warning':
        return <Warning sx={{ color: 'var(--theme-warning)', fontSize: 40 }} />;
      case 'success':
        return <CheckCircle sx={{ color: 'var(--theme-success)', fontSize: 40 }} />;
      default:
        return <Info sx={{ color: 'var(--theme-primary)', fontSize: 40 }} />;
    }
  };

  const getConfirmButtonColor = () => {
    switch (globalDialog.type) {
      case 'danger':
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      default:
        return 'primary';
    }
  };

  return (
    <Dialog
      open={globalDialog.open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'var(--theme-bg)',
          borderRadius: '16px',
          border: '1px solid var(--theme-border)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2,
          borderBottom: '1px solid var(--theme-border)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {getIcon()}
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--theme-text)' }}>
            {globalDialog.title || 'Confirm Action'}
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{
            color: 'var(--theme-text-secondary)',
            '&:hover': {
              backgroundColor: 'var(--theme-bg-secondary)',
            },
          }}
          aria-label="Close"
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Typography variant="body1" sx={{ color: 'var(--theme-text-secondary)', lineHeight: 1.6 }}>
          {globalDialog.message}
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 2,
          borderTop: '1px solid var(--theme-border)',
          gap: 1,
        }}
      >
        <Button
          onClick={handleClose}
          sx={{
            color: 'var(--theme-text-secondary)',
            '&:hover': {
              backgroundColor: 'var(--theme-bg-secondary)',
            },
          }}
        >
          {globalDialog.cancelText || 'Cancel'}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={getConfirmButtonColor()}
          sx={{
            backgroundColor:
              globalDialog.type === 'danger' || globalDialog.type === 'error'
                ? 'var(--theme-error)'
                : globalDialog.type === 'warning'
                ? 'var(--theme-warning)'
                : globalDialog.type === 'success'
                ? 'var(--theme-success)'
                : 'var(--theme-primary)',
            color: 'white',
            '&:hover': {
              backgroundColor:
                globalDialog.type === 'danger' || globalDialog.type === 'error'
                  ? '#dc2626'
                  : globalDialog.type === 'warning'
                  ? '#d97706'
                  : globalDialog.type === 'success'
                  ? '#059669'
                  : 'var(--theme-secondary)',
            },
          }}
        >
          {globalDialog.confirmText || 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GlobalDialogBox;

