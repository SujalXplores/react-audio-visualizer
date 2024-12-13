import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Playground from './Playground';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

root.render(
  <StrictMode>
    <Playground />
  </StrictMode>
); 