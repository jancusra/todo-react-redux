import { useState } from 'react'
import { cj, filterTasks } from '../helpers'
import {
    useCreateTaskMutation,
    useCompleteTaskMutation,
    useDeleteTaskMutation,
    useGetAllTasksQuery
} from '../rtk-query'
import type { FilterType } from '../types'
import Button from './Button'
import SelectBox from './SelectBox'
import TextBox from './TextBox'
import ToDoItem from './ToDoItem'

export type ToDoListProps = {
    readonly editNameByDoubleClickEnabled?: boolean,
    readonly showFilter?: boolean,
    readonly showCompleted?: boolean,
    readonly visibleCanBeMarkedAsCompleted?: boolean,
    readonly allCompletedCanBeCleared?: boolean
}

/**
 * component for a complete list of tasks and their management
 */
const ToDoList: React.FC<ToDoListProps> = ({
    editNameByDoubleClickEnabled,
    showFilter,
    showCompleted,
    visibleCanBeMarkedAsCompleted,
    allCompletedCanBeCleared
}) => {
    const { data, error, isLoading } = useGetAllTasksQuery()
    const [completeTaskMut] = useCompleteTaskMutation()
    const [createTaskMut, { isLoading: isCreating }] = useCreateTaskMutation()
    const [deleteTaskMut] = useDeleteTaskMutation()
    const [filterType, setFilterType] = useState<FilterType>("All");
    const [isMarkingAll, setIsMarkingAll] = useState(false)
    const [isClearing, setIsClearing] = useState(false)

    const visibleTasks = data ? filterTasks(data, filterType) : []
    const markableTasks = visibleTasks.filter(task => !task.completed)
    const completedTasks = data ? data.filter(task => task.completed) : []

    function addTask(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const form = e.currentTarget
        const formData = new FormData(form)
        const inputRaw = formData.get('todoin')

        if (typeof inputRaw === "string" && inputRaw.trim()) {
            createTaskMut({ text: inputRaw.trim() })
            form.reset()
        }
    }


    async function markVisibleAsCompleted() {
        if (!confirm("Do you want to complete all visible tasks?")) {
            return
        }

        setIsMarkingAll(true)
        try {
            await Promise.all(markableTasks.map(entry => completeTaskMut(entry.id).unwrap()))
        } finally {
            setIsMarkingAll(false)
        }
    }

    async function clearCompleted() {
        if (!confirm("Do you want to remove all completed tasks?")) {
            return
        }

        setIsClearing(true)
        try {
            await Promise.all(completedTasks.map(entry => deleteTaskMut(entry.id).unwrap()))
        } finally {
            setIsClearing(false)
        }
    }

    return (
        <>
            <form id="todo-form" className="mb-4 flex gap-2" onSubmit={addTask}>
                <TextBox
                    name="todoin"
                    className={cj("flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white",
                        "focus:outline-none focus:ring-2 focus:ring-primary-light",
                        "dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-primary-dark")}
                    placeholder="Add a new task ..."
                    required={true} />
                <Button
                    type="submit"
                    innerText={isCreating ? "Adding ..." : "Add"}
                    disabled={isCreating}
                    className={cj("px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg transition-opacity",
                        isCreating ? "opacity-60 cursor-not-allowed" : "hover:opacity-90")} />
            </form>

            {showFilter && <SelectBox<FilterType>
                items={[
                    { value: "All", text: "All" },
                    { value: "Completed", text: "Completed" },
                    { value: "NotCompleted", text: "Not completed" }
                ]}
                value={filterType}
                onChange={setFilterType} />
            }

            <div id="todo-list" className="space-y-2">
                {isLoading ? (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        Loading ...
                    </div>
                ) : error ? (
                    <div className="text-center py-4 text-red-500 dark:text-red-400">
                        Could not load tasks. Please try again later.
                    </div>
                ) : !data || data.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No tasks yet. Add one above!
                    </div>
                ) : visibleTasks.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No tasks match this filter.
                    </div>
                ) : (
                    visibleTasks.map(entry =>
                        <ToDoItem
                            key={entry.id}
                            task={entry}
                            editNameByDoubleClickEnabled={editNameByDoubleClickEnabled} />
                    )
                )}
            </div>

            {(showCompleted || visibleCanBeMarkedAsCompleted || allCompletedCanBeCleared) && data &&
                <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 flex justify-between">
                    {showCompleted &&
                        <>
                            Completed: {data.filter(item => item.completed).length}/{data.length}
                        </>
                    }

                    {visibleCanBeMarkedAsCompleted &&
                        <Button
                            type="button"
                            innerText={isMarkingAll ? "Marking ..." : "Mark as completed"}
                            disabled={isMarkingAll || markableTasks.length === 0}
                            className={cj("hover:text-primary-light dark:hover:text-primary-dark",
                                (isMarkingAll || markableTasks.length === 0) && "opacity-50 cursor-not-allowed")}
                            onClick={markVisibleAsCompleted} />
                    }
                    {allCompletedCanBeCleared &&
                        <Button
                            type="button"
                            innerText={isClearing ? "Clearing ..." : "Clear completed"}
                            disabled={isClearing || completedTasks.length === 0}
                            className={cj("hover:text-primary-light dark:hover:text-primary-dark",
                                (isClearing || completedTasks.length === 0) && "opacity-50 cursor-not-allowed")}
                            onClick={clearCompleted} />
                    }
                </div>
            }
        </>
    )
}

export default ToDoList