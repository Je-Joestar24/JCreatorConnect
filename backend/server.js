import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach((varName) => {
    console.error(`   - ${varName}`);
  });
  console.error('\n💡 Please create a .env file in the backend directory and set these variables.');
  console.error('   You can copy env.example to .env as a starting point.\n');
  process.exit(1);
}

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'JCreatorConnect API',
    version: '1.0.0',
    status: 'running',
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
import authRoutes from './routes/auth.routes.js';
// import creatorRoutes from './routes/creators.js';
// import postRoutes from './routes/posts.js';
// import paymentRoutes from './routes/payments.js';
// import aiRoutes from './routes/ai.js';
app.use('/api/auth', authRoutes);
// app.use('/api/creators', creatorRoutes);
// app.use('/api/posts', postRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/ai', aiRoutes);

// Error handling middleware (should be last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

