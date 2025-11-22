import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useDispatch } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import { store } from './store/store';
import { theme } from './config/theme';
import { setTheme } from './store/slices/themeSlice';
import './index.css';

// Initialize theme on app load
const ThemeInitializer = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('themeMode') || 'light';
    dispatch(setTheme(savedTheme));
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, [dispatch]);

  return null;
};

const Root = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ThemeInitializer />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);

