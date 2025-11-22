# 🚀 JCreatorConnect – Creator Support Platform

<div align="center">

**A modern micro-support platform where creators share content and supporters fund their work through simple one-time or monthly contributions.**

*Powered by the MERN stack with AI-enhanced features via Groq API*

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=for-the-badge&logo=javascript&logoColor=white)](https://www.mongodb.com/)
[![AI Powered](https://img.shields.io/badge/AI-Groq-00A67E?style=for-the-badge)](https://groq.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [🧩 Core Purpose](#-core-purpose-of-the-application)
- [✨ Features](#-features)
- [👥 User Roles](#-user-roles)
- [🏗️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🏠 Page Structure](#-page-structure)
- [🤖 AI Integration](#-ai-integration)
- [🚀 Getting Started](#-getting-started)
- [⚙️ Environment Variables](#️-environment-variables)
- [📡 API Endpoints](#-api-endpoints)
- [🎨 Key Highlights](#-key-highlights)
- [👤 Author](#-author)
- [📄 License](#-license)

---

## 🎯 Project Overview

**JCreatorConnect** is a full-stack MERN application designed to help creators build a community around their work and receive financial support through micro-payments and memberships.

The platform allows creators to publish posts, images, and links, while supporters can browse creator pages, unlock exclusive content, and contribute directly.

With seamless authentication, secure payments, AI-powered content generation, and a clear modern UI, JCreatorConnect demonstrates a wide range of real-world development skills sought by clients in the US, UK, and global markets.

---

## 🧩 Core Purpose of the Application

To empower creators by giving them a simple platform to share content and receive financial support — similar to BuyMeACoffee, Patreon, or Ko-fi, but built using modern MERN technologies paired with AI enhancements.

> **It's not a social network.**  
> **It's not a streaming site.**  
> **It's a support hub where creators maintain a professional profile and supporters directly fund them.**

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with refresh tokens
- Role-based access control (Creator/Supporter)
- Secure password hashing
- Protected API routes

### 💰 Payment Integration
- One-time tips ($1–$10 or custom amounts)
- Monthly membership subscriptions
- Secure payment processing (Stripe/PayPal)
- Payment history tracking

### 📝 Content Management
- Create, edit, and delete posts
- Support for text, images, embedded videos, and links
- Free and locked (paid) content
- Membership-only content tiers

### 🤖 AI-Powered Features (Groq API)
- **Creator Tools:**
  - Generate post descriptions
  - Suggest content ideas
  - Rewrite text in specific tones
  - Generate banner taglines
- **Supporter Tools:**
  - Smart search engine
  - AI recommendations based on browsing patterns
- **Platform Features:**
  - AI-generated landing page text
  - AI-generated category tags for posts

### 📊 Analytics & Dashboard
- Creator dashboard with earnings overview
- Supporter analytics
- Total supporters and subscriptions tracking
- Last 30 days activity metrics

### 🎨 Modern UI/UX
- Responsive design
- Clean, professional interface
- Smooth animations and transitions
- Accessible components

---

## 👥 User Roles

### 1. 👨‍🎨 Creator Account

Creators can:
- ✅ Set up a professional creator profile
- ✅ Post content: text, images, embedded videos, or links
- ✅ Publish free or locked (paid) posts
- ✅ Receive support ($1–$10 tips or custom amounts)
- ✅ Enable optional monthly membership plans
- ✅ Access a creator dashboard with analytics
- ✅ Use AI to generate post ideas, descriptions, or summaries (Groq API)

### 2. 💝 Supporter Account

Supporters can:
- ✅ Explore creator profiles
- ✅ View free content
- ✅ Unlock exclusive posts by supporting
- ✅ Subscribe to monthly creator memberships
- ✅ Leave support messages
- ✅ Manage payments and subscriptions
- ✅ Discover creators using AI-powered search filters

---

## 🏗️ Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling framework
- **Context API / Redux** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### AI & External Services
- **Groq API** - AI content generation
- **Stripe / PayPal** - Payment processing
- **Cloudinary / AWS S3** - Image storage (optional)

### Development Tools
- **Git** - Version control
- **Postman / Insomnia** - API testing
- **VS Code** - IDE

---

## 📁 Project Structure

```
JCreatorConnect/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── creatorController.js
│   │   ├── postController.js
│   │   ├── paymentController.js
│   │   └── aiController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Creator.js
│   │   ├── Post.js
│   │   └── Payment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── creators.js
│   │   ├── posts.js
│   │   ├── payments.js
│   │   └── ai.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── utils/
│   │   └── groqClient.js
│   ├── .env
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.js
│   ├── package.json
│   └── .env
└── readme.md
```

---

## 🏠 Page Structure

### 1. 🏡 Landing Page
- Modern hero section introducing the platform
- "Become a Creator" + "Support a Creator" buttons
- Examples of creator pages
- **AI-powered search bar:** "Find creators by category or style…" (Groq API suggests creators or categories)
- Login / Register in navbar
- Minimalistic, clean professional UI

### 2. 👤 Creator Profile Page
The public-facing page supporters see.

**Sections:**
- Profile photo + banner
- Bio, social links, tags
- Support button (tip)
- Membership tiers (optional)
- Posts feed:
  - Free posts
  - Blurred locked posts
  - AI-generated welcome message (optional)

**Creators can publish:**
- Text posts
- Images
- Embedded YouTube/Vimeo links
- External links (portfolio, socials)
- Supporter-only content
- Membership-only content

### 3. 📊 Creator Dashboard
Creators manage everything here.

**Features:**
- Edit profile
- Create / edit / delete posts
- Manage locked content
- View supporters and earnings
- Analytics: total supporters, subscriptions, last 30 days
- **AI writing tools:**
  - "Generate post title"
  - "Summarize my long text"
  - "Give me 10 content ideas"

### 4. 💝 Supporter Experience
Supporters get:
- Personalized supporter profile
- History of creators they supported
- List of unlocked posts
- Manage subscriptions
- **AI recommendation engine:** "Creators you may like…" powered by Groq

### 5. 🔌 Backend API Structure (Express + MongoDB)
High-level overview:
- Auth (JWT, refresh tokens)
- Creator profiles
- Posts (CRUD)
- Payment intents (Stripe or PayPal)
- Membership subscriptions
- Support unlocks
- AI endpoints using Groq API
- Admin endpoints (optional)

---

## 🤖 AI Integration

### Creator Tools
- Generate post descriptions
- Suggest content ideas
- Rewrite text in a specific tone
- Generate a banner tagline

### Supporter Tools
- Smart search engine
- AI recommendations based on browsing patterns

### Platform Features
- AI-generated landing page text
- AI-generated category tags for posts

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- Groq API key
- Stripe/PayPal account (for payments)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Je-Joestar24/JCreatorConnect.git
cd JCreatorConnect
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Set up environment variables**

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_token_secret
GROQ_API_KEY=your_groq_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

Create a `.env` file in the `frontend` directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

5. **Run the application**

Start the backend server:
```bash
cd backend
npm run dev
```

Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

---

## ⚙️ Environment Variables

### Backend (.env)
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens |
| `GROQ_API_KEY` | Groq API key for AI features |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Frontend (.env)
| Variable | Description |
|----------|-------------|
| `REACT_APP_API_URL` | Backend API URL |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Creators
- `GET /api/creators` - Get all creators
- `GET /api/creators/:id` - Get creator profile
- `PUT /api/creators/:id` - Update creator profile
- `POST /api/creators/:id/support` - Support a creator

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Payments
- `POST /api/payments/tip` - Process tip payment
- `POST /api/payments/subscribe` - Subscribe to membership
- `GET /api/payments/history` - Get payment history

### AI
- `POST /api/ai/generate-ideas` - Generate content ideas
- `POST /api/ai/summarize` - Summarize text
- `POST /api/ai/search` - AI-powered search

---

## 🎨 Key Highlights

- ✅ Full MERN implementation
- ✅ Secure authentication + roles
- ✅ Payments (tip + subscription)
- ✅ Creator dashboards
- ✅ AI integration via Groq
- ✅ Media upload system
- ✅ Modern UI/UX
- ✅ Modular backend architecture
- ✅ Real-world business use case
- ✅ Scalable code structure
- ✅ Portfolio-ready branding

---

## 🌟 Short Description (for GitHub / Portfolio)

**JCreatorConnect** is a MERN-based creator support platform where creators can share updates and receive tips or membership payments. Features include creator dashboards, supporter accounts, secure payments, AI-powered content generation, and personalized discovery powered by Groq API.

---

## 👤 Author

**Jejomar Parrilla**

- 📧 Email: jpar1252003@gmail.com
- 📱 WhatsApp: 09073010472
- 🔗 GitHub: [@Je-Joestar24](https://github.com/Je-Joestar24)
- 📍 Location: Ormoc City, Philippines

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Groq for AI API services
- Stripe/PayPal for payment processing
- MongoDB for database services
- All the creators and supporters who will use this platform

---

<div align="center">

**Built with ❤️ by Jejomar Parrilla**

⭐ Star this repo if you find it helpful!

</div>

