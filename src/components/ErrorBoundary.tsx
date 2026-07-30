"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 mb-4">
            <svg className="h-8 w-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-sm text-slate-500 mb-1 max-w-md">
            มีข้อผิดพลาดบางอย่างเกิดขึ้น กรุณาลองใหม่อีกครั้ง
          </p>
          {this.state.error && (
            <p className="text-xs text-slate-400 mb-4 max-w-md font-mono bg-slate-50 rounded-lg px-3 py-2">
              {this.state.error.message}
            </p>
          )}
          <button
            onClick={this.handleReset}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-200/50 hover:shadow-xl transition-all active:scale-95"
          >
            ลองใหม่
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
