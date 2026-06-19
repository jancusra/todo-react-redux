import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

export type ErrorBoundaryProps = {
    readonly children: ReactNode
}

type ErrorBoundaryState = {
    readonly hasError: boolean
}

/**
 * top-level error boundary; prevents a render error from crashing the whole
 * app into a blank page and shows a recoverable fallback instead
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true }
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('Uncaught render error:', error, info)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="container mx-auto px-2 py-8 max-w-md text-center">
                    <p className="mb-4 text-red-500 dark:text-red-400">
                        Something went wrong.
                    </p>
                    <button
                        type="button"
                        className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:opacity-90 transition-opacity"
                        onClick={() => window.location.reload()}>
                        Reload
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
