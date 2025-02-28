
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { validateComponents } from './utils/componentValidator';

// Force validation of components during initialization
try {
  console.log("Validating components before render...");
  validateComponents();
  console.log("Component validation successful!");
} catch (error) {
  console.error("Component validation failed:", error);
}

const root = createRoot(document.getElementById("root")!);

// Force rebuild by adding a comment to trigger change detection
// Rebuild timestamp: ${Date.now()}
root.render(<App />);
