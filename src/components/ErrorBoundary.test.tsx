import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorBoundary from './ErrorBoundary'

// a child that throws on demand
function Boom(): React.ReactNode {
    throw new Error('boom')
}

describe('ErrorBoundary', () => {
    beforeEach(() => {
        // React logs caught errors to console.error; silence it for clean output
        vi.spyOn(console, 'error').mockImplementation(() => { })
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renders children when there is no error', () => {
        render(
            <ErrorBoundary>
                <p>all good</p>
            </ErrorBoundary>
        )

        expect(screen.getByText('all good')).toBeInTheDocument()
    })

    it('renders the fallback when a child throws', () => {
        render(
            <ErrorBoundary>
                <Boom />
            </ErrorBoundary>
        )

        expect(screen.getByText('Something went wrong.')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument()
    })
})
