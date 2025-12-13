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

// Import path utilities for static file serving
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions)); // Apply CORS first, before Helmet
app.use(helmet({
  // Configure Helmet to allow cross-origin images
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:", "http://localhost:5000", "http://localhost:3000"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve uploaded files statically with explicit CORS headers
app.use('/uploads', (req, res, next) => {
  // Set CORS headers explicitly for static files
  const origin = req.headers.origin;
  const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  if (origin === allowedOrigin || !origin) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
}, express.static(path.join(__dirname, 'uploads'), {
  // Additional static file options
  setHeaders: (res, path) => {
    // Ensure images are served with correct content type
    if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (path.endsWith('.gif')) {
      res.setHeader('Content-Type', 'image/gif');
    } else if (path.endsWith('.webp')) {
      res.setHeader('Content-Type', 'image/webp');
    }
  },
}));

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
import creatorProfileRoutes from './routes/creatorprofile.routes.js';
// import creatorRoutes from './routes/creators.js';
// import postRoutes from './routes/posts.js';
// import paymentRoutes from './routes/payments.js';
// import aiRoutes from './routes/ai.js';
app.use('/api/auth', authRoutes);
app.use('/api/creator-profile', creatorProfileRoutes);
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

