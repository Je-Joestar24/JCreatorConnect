# JCreatorConnect Backend API

Express.js + MongoDB backend for the JCreatorConnect platform.

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/             # Route controllers
├── middleware/
│   ├── auth.js             # Authentication middleware
│   └── upload.js           # File upload middleware
├── models/                  # Mongoose models
│   ├── User.js
│   ├── CreatorProfile.js
│   ├── Post.js
│   ├── Support.js
│   ├── MembershipTier.js
│   ├── Subscription.js
│   ├── Transaction.js
│   ├── PostUnlock.js
│   ├── AILog.js
│   └── Notification.js
├── routes/                  # API routes
├── utils/
│   ├── groqClient.js       # Groq AI integration
│   └── generateToken.js    # JWT token utilities
├── .env                    # Environment variables (create this)
├── .gitignore
├── package.json
└── server.js               # Main server file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/jcreatorconnect
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
GROQ_API_KEY=your_groq_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
FRONTEND_URL=http://localhost:3000
```

### 3. Start MongoDB

Make sure MongoDB is running locally or use MongoDB Atlas.

### 4. Run the Server

**Development mode (with nodemon):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📊 Database Models

### 1. User
- Authentication and basic user info
- Roles: `creator` or `supporter`

### 2. CreatorProfile
- Extended profile for creators
- 1-to-1 relationship with User

### 3. Post
- Content posts by creators
- Types: text, image, videoEmbed, link
- Access types: free, supporter-only, membership-only

### 4. Support
- One-time support/tips from supporters

### 5. MembershipTier
- Subscription tier definitions
- Linked to creators

### 6. Subscription
- Active membership subscriptions
- Links supporters to creators via tiers

### 7. Transaction
- All financial transactions
- Types: support, membership, tip

### 8. PostUnlock
- Tracks which posts supporters have access to

### 9. AILog
- Logs AI-generated content for analytics

### 10. Notification
- User notifications

## 🔐 Authentication

JWT-based authentication with refresh tokens.

- Access tokens: Short-lived (7 days default)
- Refresh tokens: Long-lived (30 days default)

## 🤖 AI Integration

Groq API integration for:
- Post idea generation
- Text summarization
- Title generation
- Text rewriting
- Tag generation
- AI-powered search

## 📝 API Endpoints

Endpoints will be added in the `routes/` folder:
- `/api/auth` - Authentication
- `/api/creators` - Creator profiles
- `/api/posts` - Posts CRUD
- `/api/payments` - Payment processing
- `/api/ai` - AI features

## 🛠️ Development

- **nodemon** is configured for auto-restart during development
- Use `npm run dev` for development
- Use `npm start` for production

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **groq-sdk** - Groq AI integration
- **stripe** - Payment processing
- **cloudinary** - Image storage
- **multer** - File uploads
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing

