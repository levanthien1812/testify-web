import React from "react";

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: JSX.Element;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error(error, info);
        this.setState({ hasError: true });
    }

    render(): React.ReactNode {
        if (this.state.hasError) {
            return <h1>Something went wrong.</h1>;
        }

        if (this.props.fallback) {
            return this.props.fallback;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
