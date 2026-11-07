import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'calendar-kit/styles.css';
import './docs/docs.css';
import { App } from './docs/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
