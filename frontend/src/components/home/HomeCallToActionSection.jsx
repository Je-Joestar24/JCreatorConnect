import { motion } from 'framer-motion';
import { Box, Typography, Container, Button, Chip } from '@mui/material';
import { AutoAwesome, TrendingUp, Favorite } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/home.css';

const HomeCallToActionSection = () => {
    const navigate = useNavigate();

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
            },
        },
    };

    return (
        <Box 
            className="cta-section" 
            sx={{ 
                py: 10, 
                position: 'relative', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
            }}
        >
            {/* Background Decoration */}
            <Box className="cta-bg-decoration" />

            {/* Decorative Elements */}
            <motion.div
                className="cta-decorative-element decor-1"
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, -5, 0],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            >
                <AutoAwesome sx={{ fontSize: 40, color: 'var(--theme-primary)', opacity: 0.3 }} />
            </motion.div>

            <motion.div
                className="cta-decorative-element decor-2"
                animate={{
                    y: [0, 15, 0],
                    rotate: [0, -5, 5, 0],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1,
                }}
            >
                <TrendingUp sx={{ fontSize: 35, color: 'var(--theme-secondary)', opacity: 0.25 }} />
            </motion.div>

            <motion.div
                className="cta-decorative-element decor-3"
                animate={{
                    y: [0, -15, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.5,
                }}
            >
                <Favorite sx={{ fontSize: 30, color: 'var(--theme-accent)', opacity: 0.2 }} />
            </motion.div>

            {/* Decorative Circles */}
            <motion.div
                className="cta-circle circle-1"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
            <motion.div
                className="cta-circle circle-2"
                animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1,
                }}
            />
            <motion.div
                className="cta-circle circle-3"
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.25, 0.45, 0.25],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 2,
                }}
            />

            <Container 
                maxWidth="md"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    mx: 'auto',
                    px: { xs: 2, sm: 3, md: 4 },
                }}
            >
                <Box
                    component={motion.div}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    sx={{
                        width: '100%',
                        maxWidth: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                    }}
                >
                    {/* Badge */}
                    <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <Chip
                            label="Get Started"
                            icon={<AutoAwesome sx={{ fontSize: 16 }} />}
                            sx={{
                                px: 2,
                                py: 1.5,
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, var(--theme-primary)15 0%, var(--theme-secondary)15 100%)',
                                color: 'var(--theme-primary)',
                                border: '1px solid var(--theme-border-accent)',
                                '& .MuiChip-icon': {
                                    color: 'var(--theme-primary)',
                                },
                            }}
                        />
                    </motion.div>

                    {/* Main Headline */}
                    <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        <Typography
                            variant="h2"
                            component="h2"
                            className="cta-title"
                            sx={{
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                fontWeight: 700,
                                mb: 2,
                                color: 'var(--theme-text)',
                                lineHeight: 1.2,
                            }}
                        >
                            Ready to{' '}
                            <span className="gradient-text">Start Your Journey?</span>
                        </Typography>
                    </motion.div>

                    {/* Sub-headline */}
                    <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <Typography
                            variant="body1"
                            sx={{
                                fontSize: { xs: '1rem', md: '1.15rem' },
                                color: 'var(--theme-text-secondary)',
                                maxWidth: '600px',
                                mx: 'auto',
                                lineHeight: 1.7,
                            }}
                        >
                            Join thousands of creators and supporters building meaningful
                            connections. Start sharing your work or discover amazing creators
                            to support today.
                        </Typography>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        variants={itemVariants}
                        className="cta-buttons"
                        style={{
                            display: 'flex',
                            gap: '1.5rem',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                        }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate('/register?role=creator')}
                                className="cta-button-primary"
                                sx={{
                                    px: { xs: 4, md: 5 },
                                    py: 1.5,
                                    fontSize: { xs: '0.95rem', md: '1.05rem' },
                                    fontWeight: 700,
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    background: 'linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-secondary) 100%)',
                                    boxShadow: '0 8px 24px rgba(124, 58, 237, 0.3)',
                                    color: 'white',
                                    minWidth: { xs: '200px', md: '240px' },
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, var(--theme-secondary) 0%, var(--theme-primary) 100%)',
                                        boxShadow: '0 12px 32px rgba(124, 58, 237, 0.4)',
                                        transform: 'translateY(-2px)',
                                    },
                                }}
                            >
                                Become a Creator
                            </Button>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => navigate('/creators')}
                                className="cta-button-secondary"
                                sx={{
                                    px: { xs: 4, md: 5 },
                                    py: 1.5,
                                    fontSize: { xs: '0.95rem', md: '1.05rem' },
                                    fontWeight: 700,
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    borderWidth: 2,
                                    borderColor: 'var(--theme-primary)',
                                    color: 'var(--theme-primary)',
                                    minWidth: { xs: '200px', md: '240px' },
                                    transition: 'all 0.3s ease',
                                    background: 'transparent',
                                    '&:hover': {
                                        borderWidth: 2,
                                        borderColor: 'var(--theme-secondary)',
                                        backgroundColor: 'rgba(124, 58, 237, 0.05)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 20px rgba(124, 58, 237, 0.2)',
                                    },
                                }}
                            >
                                Support a Creator
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Additional Info */}
                    <motion.div
                        variants={itemVariants}
                        style={{ textAlign: 'center', marginTop: '2rem' }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                fontSize: '0.85rem',
                                color: 'var(--theme-text-muted)',
                                display: 'block',
                            }}
                        >
                            Free to join • No credit card required • Start in seconds
                        </Typography>
                    </motion.div>
                </Box>
            </Container>
        </Box>
    );
};

export default HomeCallToActionSection;

