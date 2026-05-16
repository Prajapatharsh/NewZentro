import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.group("🔥 REACT FATAL ERROR 🔥");
    console.error("Error Object:", error);
    console.error("Error Message:", error.message);
    console.error("Component Stack:", errorInfo.componentStack);
    console.groupEnd();
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '30px', background: '#450a0a', color: '#fecaca', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1 style={{ fontSize: '24px', borderBottom: '1px solid #991b1b', paddingBottom: '10px' }}>
            🚨 UI Runtime Crash Detected
          </h1>
          <div style={{ marginTop: '20px' }}>
            <p style={{ fontWeight: 'bold' }}>Error Message:</p>
            <pre style={{ background: '#000', padding: '15px', color: '#4ade80', borderRadius: '8px', overflowX: 'auto' }}>
              {this.state.error?.message || "Unknown Error"}
            </pre>
          </div>
          <div style={{ marginTop: '20px' }}>
            <p style={{ fontWeight: 'bold' }}>Likely Culprit:</p>
            <p>{this.state.error?.stack?.split('\n')[1]}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: '30px', padding: '12px 24px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Force Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
