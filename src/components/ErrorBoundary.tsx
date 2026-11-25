import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Production-grade React Error Boundary with safe state recovery.
 * Catches unhandled runtime rendering errors and renders a resilient fallback UI.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('AERIS Application Error Boundary caught an exception:', error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div 
          className="min-h-screen bg-aeris-bg text-aeris-body flex items-center justify-center p-4 sm:p-6"
          role="alert"
          aria-live="assertive"
        >
          <div className="w-full max-w-md rounded-2xl bg-aeris-surface border border-aeris-border p-6 sm:p-8 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/60 text-rose-400 flex items-center justify-center mx-auto border border-rose-900/60">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h1 className="text-lg font-bold text-aeris-heading">
                AERIS Resilience System Notice
              </h1>
              <p className="text-xs text-aeris-muted leading-relaxed">
                A temporary rendering exception occurred. Your local configuration and telemetry data are preserved safely.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-aeris-bg border border-aeris-border text-left font-mono text-[11px] text-rose-300 max-h-24 overflow-y-auto">
                {this.state.error.message || 'Unknown runtime error'}
              </div>
            )}

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="px-4 py-2 rounded-xl bg-aeris-accent hover:bg-aeris-accent-dim text-aeris-bg font-semibold text-xs flex items-center gap-1.5 transition-all shadow"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Application</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.removeItem('aeris_household_profile');
                  } catch {}
                  window.location.reload();
                }}
                className="px-4 py-2 rounded-xl bg-aeris-surface-raised hover:bg-aeris-surface border border-aeris-border text-aeris-muted hover:text-aeris-heading text-xs transition-colors flex items-center gap-1.5"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Reset to Safe Defaults</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
