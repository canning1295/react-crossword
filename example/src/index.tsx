import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

// Register service worker for PWA functionality
serviceWorkerRegistration.register();
