import { describe, it, expect } from 'vitest'
import { cj, filterTasks } from './helpers'
import type { Task } from './types'

function makeTask(id: string, completed: boolean): Task {
    return { id, text: `task ${id}`, createdDate: 0, completedDate: 0, completed }
}

describe('cj', () => {
    it('joins truthy class names with a space', () => {
        expect(cj('a', 'b', 'c')).toBe('a b c')
    })

    it('drops falsy values', () => {
        expect(cj('a', false, null, undefined, '', 'b')).toBe('a b')
    })

    it('returns an empty string when nothing is truthy', () => {
        expect(cj(false, null, undefined)).toBe('')
    })
})

describe('filterTasks', () => {
    const tasks: Task[] = [
        makeTask('1', false),
        makeTask('2', true),
        makeTask('3', false)
    ]

    it('returns all tasks for the "All" filter', () => {
        expect(filterTasks(tasks, 'All')).toHaveLength(3)
    })

    it('returns only completed tasks for the "Completed" filter', () => {
        const result = filterTasks(tasks, 'Completed')
        expect(result.map((t) => t.id)).toEqual(['2'])
    })

    it('returns only not-completed tasks for the "NotCompleted" filter', () => {
        const result = filterTasks(tasks, 'NotCompleted')
        expect(result.map((t) => t.id)).toEqual(['1', '3'])
    })

    it('does not mutate the input array', () => {
        const copy = [...tasks]
        filterTasks(tasks, 'Completed')
        expect(tasks).toEqual(copy)
    })
})
