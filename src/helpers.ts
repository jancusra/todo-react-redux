// Common helper methods

import type { FilterType, Task } from './types'

// joins the given class names into a single string, dropping falsy values
// (so conditional classes can be passed inline)
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