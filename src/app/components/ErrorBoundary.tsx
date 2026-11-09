import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { hasError: boolean }

/** Safety net for unexpected rendering failures, not a replacement for field/API validation. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Only development diagnostics. Do not expose tokens, forms, or user data here.
    if (import.meta.env.DEV) console.error('Unexpected render error', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <main className="app-error-boundary" role="alert">
        <h1>Something went wrong</h1>
        <p>The dashboard could not be rendered. Your locally saved tasks have not been deleted.</p>
        <button type="button" onClick={() => window.location.reload()}>Reload application</button>
      </main>;
    }
    return this.props.children;
  }
}
