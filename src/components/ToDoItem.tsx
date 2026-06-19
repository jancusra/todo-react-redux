import { useRef, useState } from 'react'
import { cj } from '../helpers'
import {
    useCompleteTaskMutation,
    useDeleteTaskMutation,
    useIncompleteTaskMutation,
    useUpdateTaskMutation
} from '../rtk-query'
import type { Task } from '../types'
import Button from './Button'

export type ToDoItemProps = {
    readonly task: Task,
    readonly editNameByDoubleClickEnabled?: boolean
}

/**
 * component for a single to-do item and its editing
 */
const ToDoItem: React.FC<ToDoItemProps> = ({
    task,
    editNameByDoubleClickEnabled
}) => {
    const [completeTaskMut, { isLoading: isCompleting }] = useCompleteTaskMutation()
    const [deleteTaskMut, { isLoading: isDeleting }] = useDeleteTaskMutation()
    const [incompleteTaskMut, { isLoading: isIncompleting }] = useIncompleteTaskMutation()
    const [updateTaskMut] = useUpdateTaskMutation()
    const [editMode, setEditMode] = useState<boolean>(false)
    const editInput = useRef<string | null>(null)

    function changeTaskState() {
        if (task.completed) {
            incompleteTaskMut(task.id)
        } else {
            completeTaskMut(task.id)
        }
    }

    function onEditChange(e: React.ChangeEvent<HTMLInputElement>) {
        editInput.current = e.target.value
    }

    // save only when the text actually changed and is not empty
    function commitEdit() {
        const next = editInput.current?.trim()

        if (next && next !== task.text) {
            updateTaskMut({ id: task.id, text: next })
        }

        editInput.current = null
        setEditMode(false)
    }

    function cancelEdit() {
        editInput.current = null
        setEditMode(false)
    }

    function onEditCancel(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        cancelEdit()
    }

    function onEditKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            e.preventDefault()
            commitEdit()
        } else if (e.key === "Escape") {
            e.preventDefault()
            cancelEdit()
        }
    }

    function editTask() {
        if (editNameByDoubleClickEnabled) {
            editInput.current = task.text
            setEditMode(true)
        }
    }

    function deleteTask() {
        deleteTaskMut(task.id)
    }

    return (
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
            <input
                className={cj("h-5 w-5 rounded border-gray-300 text-primary-light accent-primary-light focus:ring-primary-light",
                    "dark:text-primary-dark dark:focus:ring-primary-dark dark:accent-primary-dark")}
                type="checkbox"
                checked={task.completed}
                disabled={isCompleting || isIncompleting}
                aria-label={task.completed ? "Mark as not completed" : "Mark as completed"}
                onChange={changeTaskState} />
            {editMode ? (
                <>
                    <input
                        className='flex-1'
                        type="text"
                        aria-label="Edit task text"
                        defaultValue={task.text}
                        autoFocus={true}
                        onChange={onEditChange}
                        onBlur={commitEdit}
                        onKeyDown={onEditKeyDown}
                    />
                    <Button
                        type="button"
                        innerText="X"
                        className="bg-transparent font-bold"
                        onMouseDown={onEditCancel}
                    />
                </>
            ) : (
                <span className={cj("flex-1 cursor-text",
                    task.completed && "line-through opacity-70"
                )}
                    onDoubleClick={editTask}>
                    {task.text}
                </span>
            )
            }
            <Button
                type="button"
                aria-label="Delete task"
                disabled={isDeleting}
                className={cj("text-red-500 hover:text-red-700 dark:hover:text-red-400",
                    isDeleting && "opacity-50 cursor-not-allowed")}
                iconName="remove-bin"
                onClick={deleteTask} />
        </div >
    )
}

export default ToDoItem