# JCreatorConnect Frontend

React frontend for the JCreatorConnect platform built with Vite, Material UI, and Framer Motion.

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── axios.js          # Axios instance configuration
│   ├── components/
│   │   └── home/             # Home page components
│   ├── config/
│   │   └── theme.js         # Material UI theme configuration
│   ├── pages/
│   │   └── HomePage.jsx     # Home page
│   ├── router/
│   │   └── AppRouter.jsx    # Route configuration
│   ├── services/            # API service functions
│   ├── store/
│   │   ├── store.js         # Redux store configuration
│   │   └── slices/          # Redux slices
│   ├── util/                # Utility functions
│   ├── App.jsx              # Main App component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles with CSS variables
├── index.html
├── vite.config.js
└── package.json
```

## 🎨 Theme

The app uses a **violet theme** with both light and dark mode support. Theme colors are defined in CSS variables in `src/index.css` and Material UI theme in `src/config/theme.js`.

### CSS Variables

- `--theme-primary`: Main violet color
- `--theme-secondary`: Secondary violet color
- `--theme-accent`: Accent violet color
- `--theme-bg`: Background color
- `--theme-text`: Text color

### Dark Mode

Dark mode is supported and can be toggled via Redux. The theme mode is stored in localStorage.

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Material UI** - Component library
- **Framer Motion** - Animation library
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Axios** - HTTP client

## 📦 Key Dependencies

- `@mui/material` - Material UI components
- `@mui/icons-material` - Material UI icons
- `framer-motion` - Animations
- `react-redux` - Redux bindings
- `@reduxjs/toolkit` - Redux toolkit
- `react-router-dom` - Routing
- `axios` - HTTP client

## 🎯 Next Steps

1. Set up API connection in `src/api/axios.js`
2. Create Redux slices for state management
3. Build out pages and components
4. Implement routing
5. Add authentication flow

