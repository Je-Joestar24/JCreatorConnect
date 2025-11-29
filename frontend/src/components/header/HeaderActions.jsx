import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import HeaderNavigations from './HeaderNavigations';

const HeaderActions = () => {
  const navigate = useNavigate();

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      sx={{ ml: 'auto' }}
    >
      <HeaderNavigations />

      <motion.div whileHover={{ y: -1 }} transition={{ duration: 0.2 }}>
        <Button
          variant="text"
          onClick={() => {}}
          sx={{
            fontSize: '0.9rem',
            color: 'var(--theme-text-secondary)',
            textTransform: 'none',
          }}
        >
          Log in
        </Button>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          variant="contained"
          onClick={() => {}}
          sx={{
            fontSize: '0.9rem',
            fontWeight: 600,
            px: 3,
            py: 1,
            borderRadius: 999,
            textTransform: 'none',
            background:
              'linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))',
            boxShadow: '0 6px 18px rgba(124, 58, 237, 0.35)',
            '&:hover': {
              background:
                'linear-gradient(135deg, var(--theme-secondary), var(--theme-primary))',
              boxShadow: '0 10px 26px rgba(124, 58, 237, 0.45)',
            },
          }}
        >
          Sign up
        </Button>
      </motion.div>
    </Stack>
  );
};

export default HeaderActions;


