import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Toaster } from '../src/components/ui/sonner.tsx';
import { ProductProvider } from './libs/contexts/product.context.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProductProvider>
      <Toaster />
      <App />
    </ProductProvider>
  </StrictMode>
);
