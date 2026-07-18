import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] ', error, info);
  }

  render() {
    const { hasError } = this.state;
    const { fallback = null } = this.props;

    if (hasError) {
      return (
        fallback ?? (
          <div className="min-h-screen grid place-items-center p-6">
            <div className="max-w-md text-center">
              <div className="text-2xl font-bold mb-2">Something went wrong</div>
              <div className="opacity-80 mb-4">We isolated the error so the rest of the app can keep running.</div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                Try again
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

