import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../utils/logger';
import { AlertCircle, RefreshCcw, Home, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught error in component tree:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h1>
            <p className="text-slate-500 mb-8 leading-relaxed">
              We've encountered an unexpected error. This may be due to a transient network issue or a temporary service degradation.
            </p>
            
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-8 text-left">
              <p className="text-xs text-amber-800 font-medium flex items-center gap-2 mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Safety Protocol Active
              </p>
              <p className="text-[10px] text-amber-700 leading-relaxed">
                Your clinical data is safe. We've paused the current session to prevent data corruption. You can try refreshing or return to the dashboard.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
              >
                <RefreshCcw className="w-4 h-4" />
                Refresh Application
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full flex items-center justify-center gap-2 bg-white text-slate-600 border border-slate-200 py-3 px-4 rounded-xl font-bold hover:bg-slate-50 transition-all"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-8 p-4 bg-slate-50 rounded-xl text-left overflow-auto max-h-40 relative group">
                <button
                  onClick={() => navigator.clipboard.writeText(this.state.error?.toString() || '')}
                  className="absolute top-2 right-2 text-[10px] bg-slate-200 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Copy
                </button>
                <p className="text-xs font-mono text-red-600 whitespace-pre-wrap">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
