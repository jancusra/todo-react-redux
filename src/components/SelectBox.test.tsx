import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SelectBox from './SelectBox'

const items = [
    { value: 'All', text: 'All' },
    { value: 'Completed', text: 'Completed' },
    { value: 'NotCompleted', text: 'Not completed' }
]

describe('SelectBox', () => {
    it('renders one tab button per item', () => {
        render(<SelectBox items={items} value="All" />)
        // tabs (desktop) render as buttons
        expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Completed' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Not completed' })).toBeInTheDocument()
    })

    it('marks the active tab via aria-pressed (controlled by value prop)', () => {
        render(<SelectBox items={items} value="Completed" />)
        expect(screen.getByRole('button', { name: 'Completed' })).toHaveAttribute('aria-pressed', 'true')
        expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false')
    })

    it('calls onChange with the selected value when a tab is clicked', async () => {
        const onChange = vi.fn()
        render(<SelectBox items={items} value="All" onChange={onChange} />)

        await userEvent.click(screen.getByRole('button', { name: 'Completed' }))

        expect(onChange).toHaveBeenCalledExactlyOnceWith('Completed')
    })
})
