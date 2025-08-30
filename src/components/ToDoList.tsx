import { useState } from 'react'
import { cj } from '../helpers'
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
    const [createTaskMut] = useCreateTaskMutation()
    const [deleteTaskMut] = useDeleteTaskMutation()
    const [filterType, setFilterType] = useState<FilterType>("All");

    function addTask(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const formData = new FormData(e.target as HTMLFormElement)
        const inputRaw = formData.get('todoin')

        if (typeof inputRaw === "string") {
            createTaskMut({ text: inputRaw })
        }
    }

    function changeFilter(filterType: string) {
        setFilterType(filterType as FilterType)
    }

    function markVisibleAsCompleted() {
        const confirmed = confirm("Do you want to complete all visible tasks?");

        if (confirmed && data) {
            data.forEach(entry => {
                if (filterType !== "Completed" && !entry.completed) {
                    completeTaskMut(entry.id)
                }
            })
        }
    }

    function clearCompleted() {
        const confirmed = confirm("Do you want to remove all completed tasks?");

        if (confirmed && data) {
            data.forEach(entry => {
                if (entry.completed) {
                    deleteTaskMut(entry.id)
                }
            })
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
                    innerText="Add"
                    className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:opacity-90 transition-opacity" />
            </form>

            {showFilter && <SelectBox
                items={[
                    { value: "All", text: "All" },
                    { value: "Completed", text: "Completed" },
                    { value: "NotCompleted", text: "Not completed" }
                ]}
                onChange={changeFilter} />
            }

            <div id="todo-list" className="space-y-2">
                {error ? (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No tasks yet. Add one above!
                    </div>
                ) : isLoading ? (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        Loading ...
                    </div>
                ) : data ? (
                    <>
                        {data.map(entry => {
                            if (filterType === "All" || (filterType === "Completed" && entry.completed) || (filterType === "NotCompleted" && !entry.completed))
                                return <ToDoItem
                                    key={entry.id}
                                    task={entry}
                                    editNameByDoubleClickEnabled={editNameByDoubleClickEnabled} />
                        })}
                    </>
                ) : null}
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
                            type={undefined}
                            innerText="Mark as completed"
                            className="hover:text-primary-light dark:hover:text-primary-dark"
                            onClick={markVisibleAsCompleted} />
                    }
                    {allCompletedCanBeCleared &&
                        <Button
                            type={undefined}
                            innerText="Clear completed"
                            className="hover:text-primary-light dark:hover:text-primary-dark"
                            onClick={clearCompleted} />
                    }
                </div>
            }
        </>
    )
}

export default ToDoList