import { useState, useEffect } from 'react';
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
  MenuItem,
} from '@mui/material';
import { Visibility, VisibilityOff, Home, AutoAwesome, ArrowBack, PersonAdd, Support } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/authHook';

const SignupRightPanel = ({ role: initialRole }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { register, loading, error, signupErrors, clearErrors } = useAuth();

  const role = initialRole || searchParams.get('role');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: role || '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Update role when URL param changes
  useEffect(() => {
    if (role) {
      setFormData((prev) => ({ ...prev, role }));
    }
  }, [role]);

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
    if (error || signupErrors) {
      clearErrors();
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      errors.role = 'Please select a role';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });
    } catch (err) {
      // Error is handled by Redux state
    }
  };

  const handleBackToRoleSelection = () => {
    setSearchParams({});
    setFormData((prev) => ({ ...prev, role: '' }));
  };

  const handleRoleSelect = (selectedRole) => {
    setSearchParams({ role: selectedRole });
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  return (
    <Box
      className="signup-right-panel"
      sx={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--theme-bg)',
        px: { xs: 3, md: 6 },
        overflow: 'auto',
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

      {/* Back to Role Selection Button (if role is selected) */}
      {role && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            position: 'absolute',
            top: 24,
            right: 24,
            zIndex: 10,
          }}
        >
          <IconButton
            onClick={handleBackToRoleSelection}
            sx={{
              color: 'var(--theme-text-secondary)',
              '&:hover': {
                color: 'var(--theme-primary)',
                background: 'rgba(124, 58, 237, 0.1)',
              },
            }}
          >
            <ArrowBack />
          </IconButton>
        </motion.div>
      )}

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

      {/* Role Selection or Signup Form */}
      {!role ? (
        // Role Selection View
        <Box
          sx={{
            width: '100%',
            maxWidth: 450,
            position: 'relative',
            zIndex: 1,
            py: 4,
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
              Choose Your Path
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'var(--theme-text-secondary)',
                mb: 4,
                textAlign: 'center',
              }}
            >
              Select how you want to join JCreatorConnect
            </Typography>
          </motion.div>

          {/* Role Selection Buttons */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              mt: 4,
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<PersonAdd />}
                onClick={() => handleRoleSelect('creator')}
                sx={{
                  py: 2.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))',
                  boxShadow: '0 6px 18px rgba(124, 58, 237, 0.35)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, var(--theme-secondary), var(--theme-primary))',
                    boxShadow: '0 10px 26px rgba(124, 58, 237, 0.45)',
                  },
                }}
              >
                Become a Creator
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<Support />}
                onClick={() => handleRoleSelect('supporter')}
                sx={{
                  py: 2.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 3,
                  borderWidth: 2,
                  borderColor: 'var(--theme-primary)',
                  color: 'var(--theme-primary)',
                  '&:hover': {
                    borderWidth: 2,
                    borderColor: 'var(--theme-secondary)',
                    background: 'rgba(124, 58, 237, 0.1)',
                  },
                }}
              >
                Support Creators
              </Button>
            </motion.div>
          </Box>

          {/* Login Link */}
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
                mt: 4,
              }}
            >
              Already have an account?{' '}
              <Link
                component="button"
                type="button"
                onClick={() => navigate('/login')}
                sx={{
                  color: 'var(--theme-primary)',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Sign in
              </Link>
            </Typography>
          </motion.div>
        </Box>
      ) : (
        // Signup Form
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            maxWidth: 450,
            position: 'relative',
            zIndex: 1,
            py: 4,
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
              Create Account
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'var(--theme-text-secondary)',
                mb: 4,
                textAlign: 'center',
              }}
            >
              Sign up as a {role === 'creator' ? 'Creator' : 'Supporter'}
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

        {/* Field-specific errors from backend */}
        {signupErrors && typeof signupErrors === 'object' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Alert severity="error" sx={{ mb: 3 }} onClose={clearErrors}>
              {Object.values(signupErrors).flat().join(', ')}
            </Alert>
          </motion.div>
        )}

        {/* Name Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            error={!!formErrors.name || !!(signupErrors?.name)}
            helperText={formErrors.name || (signupErrors?.name?.[0])}
            sx={{ mb: 3 }}
            autoComplete="name"
            autoFocus
          />
        </motion.div>

        {/* Email Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!formErrors.email || !!(signupErrors?.email)}
            helperText={formErrors.email || (signupErrors?.email?.[0])}
            sx={{ mb: 3 }}
            autoComplete="email"
          />
        </motion.div>

        {/* Password Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            error={!!formErrors.password || !!(signupErrors?.password)}
            helperText={formErrors.password || (signupErrors?.password?.[0])}
            sx={{ mb: 3 }}
            autoComplete="new-password"
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

        {/* Confirm Password Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!formErrors.confirmPassword}
            helperText={formErrors.confirmPassword}
            sx={{ mb: 3 }}
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    sx={{ color: 'var(--theme-text-secondary)' }}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
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
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </motion.div>

        {/* Login Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              color: 'var(--theme-text-secondary)',
            }}
          >
            Already have an account?{' '}
            <Link
              component="button"
              type="button"
              onClick={() => navigate('/login')}
              sx={{
                color: 'var(--theme-primary)',
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Sign in
            </Link>
          </Typography>
        </motion.div>
        </Box>
      )}
    </Box>
  );
};

export default SignupRightPanel;

