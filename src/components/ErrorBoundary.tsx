// src/components/ErrorBoundary.tsx

import { Component, ErrorInfo, ReactNode } from "react";
import { FiRefreshCw, FiHome, FiAlertTriangle } from "react-icons/fi";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }

    // TODO: Send error to error tracking service (e.g., Sentry)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-8">
          <div className="card-elevated p-8 max-w-lg w-full text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
              <FiAlertTriangle className="w-8 h-8 text-red-400" />
            </div>

            <h1 className="text-2xl font-semibold text-primary mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-secondary mb-6">
              An unexpected error occurred. We've been notified and are working to fix it.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className="card p-4 mb-6 text-left overflow-auto max-h-48">
                <p className="text-xs font-mono text-red-400 mb-2">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <p className="text-xs font-mono text-muted">
                    {this.state.errorInfo.componentStack}
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-4 py-2 btn-primary rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
                aria-label="Try again to recover from error"
              >
                <FiRefreshCw className="w-4 h-4" aria-hidden="true" />
                <span>Try Again</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex items-center gap-2 px-4 py-2 btn-secondary rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
                aria-label="Go to home page"
              >
                <FiHome className="w-4 h-4" aria-hidden="true" />
                <span>Go Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
