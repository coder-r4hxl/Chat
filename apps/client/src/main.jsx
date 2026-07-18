import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './routes/App.jsx';
import './styles.css';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { ToastProvider } from './components/Toast.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);


