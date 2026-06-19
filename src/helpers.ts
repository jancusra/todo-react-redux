// Common helper methods

import type { FilterType, Task } from './types'

// method combines classes (some string of base classes and various conditions separated by commas)
export function cj(...classes: (string | false | null | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}

// returns the tasks visible under the given filter
export function filterTasks(tasks: readonly Task[], filterType: FilterType): readonly Task[] {
    switch (filterType) {
        case "Completed":
            return tasks.filter((task) => task.completed)
        case "NotCompleted":
            return tasks.filter((task) => !task.completed)
        default:
            return tasks
    }
}