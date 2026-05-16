import { createRoot } from 'react-dom/client'
import './index.css'
import Providers from './Providers.tsx'
import App from './App.tsx'
import ErrorBoundary from './components/feedback/ErrorBoundary.tsx'

console.log("Zentro React App is Running!");

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <ErrorBoundary>
      <Providers>
        <App />
      </Providers>
    </ErrorBoundary>
  );
}
