import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  IconButton,
  InputAdornment,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff, Home, AutoAwesome } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/authHook';
import '../../assets/css/home.css';

const LoginRightPanel = () => {
  const navigate = useNavigate();
  const { login, loading, error, clearErrors } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    if (error) {
      clearErrors();
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
    } catch (err) {
      // Error is handled by Redux state
    }
  };

  return (
    <Box
      className="login-right-panel"
      sx={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--theme-bg)',
        px: { xs: 3, md: 6 },
        overflow: 'hidden',
      }}
    >
      {/* Home Button - Upper Left */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          zIndex: 10,
        }}
      >
        <IconButton
          onClick={() => navigate('/')}
          sx={{
            color: 'var(--theme-text-secondary)',
            '&:hover': {
              color: 'var(--theme-primary)',
              background: 'rgba(124, 58, 237, 0.1)',
            },
          }}
        >
          <Home />
        </IconButton>
      </motion.div>

      {/* Minimal Decorative Elements */}
      <motion.div
        style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          zIndex: 0,
        }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: {
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          },
          scale: {
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      >
        <AutoAwesome
          sx={{
            fontSize: 40,
            color: 'var(--theme-primary)',
            opacity: 0.1,
          }}
        />
      </motion.div>

      <motion.div
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '8%',
          zIndex: 0,
        }}
        animate={{
          y: [0, -20, 0],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1), transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </motion.div>

      {/* Login Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: 450,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: 'var(--theme-text)',
              textAlign: 'center',
            }}
          >
            Sign In
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'var(--theme-text-secondary)',
              mb: 4,
              textAlign: 'center',
            }}
          >
            Enter your credentials to access your account
          </Typography>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Alert severity="error" sx={{ mb: 3 }} onClose={clearErrors}>
              {error}
            </Alert>
          </motion.div>
        )}

        {/* Email Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
            sx={{ mb: 3 }}
            autoComplete="email"
            autoFocus
          />
        </motion.div>

        {/* Password Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            error={!!formErrors.password}
            helperText={formErrors.password}
            sx={{ mb: 2 }}
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: 'var(--theme-text-secondary)' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </motion.div>

        {/* Forgot Password Link */}
        <Box sx={{ textAlign: 'right', mb: 3 }}>
          <Link
            component="button"
            type="button"
            variant="body2"
            sx={{
              color: 'var(--theme-primary)',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Forgot password?
          </Link>
        </Box>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.5,
              mb: 3,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 3,
              background: 'linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))',
              boxShadow: '0 6px 18px rgba(124, 58, 237, 0.35)',
              '&:hover': {
                background: 'linear-gradient(135deg, var(--theme-secondary), var(--theme-primary))',
                boxShadow: '0 10px 26px rgba(124, 58, 237, 0.45)',
              },
              '&:disabled': {
                opacity: 0.7,
              },
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </motion.div>

        {/* Sign Up Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              color: 'var(--theme-text-secondary)',
            }}
          >
            Don't have an account?{' '}
            <Link
              component="button"
              type="button"
              onClick={() => navigate('/signup')}
              sx={{
                color: 'var(--theme-primary)',
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Sign up
            </Link>
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );
};

export default LoginRightPanel;

