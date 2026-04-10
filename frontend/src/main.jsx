import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="auth-wrap">
          <div className="card">
            <h2>ShieldPay</h2>
            <p>The app hit a runtime error. Refresh the page to recover.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
rootElement.innerHTML = '<div style="padding:20px;color:#e8e8ee;background:#0f0f1a;min-height:100vh;">Loading ShieldPay...</div>';

createRoot(rootElement).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RootErrorBoundary>
  </React.StrictMode>
);
