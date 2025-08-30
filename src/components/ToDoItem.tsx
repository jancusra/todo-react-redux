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
 * component for one item of a scheduled task and its modification
 */
const ToDoItem: React.FC<ToDoItemProps> = ({
    task,
    editNameByDoubleClickEnabled
}) => {
    const [completeTaskMut] = useCompleteTaskMutation()
    const [deleteTaskMut] = useDeleteTaskMutation()
    const [incompleteTaskMut] = useIncompleteTaskMutation()
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

    function onEditBlur() {
        if (editMode && editInput.current) {
            updateTaskMut({ id: task.id, text: editInput.current })
            setEditMode(false)
        }
    }

    function onEditCancel(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()

        if (editMode) {
            editInput.current = null
            setEditMode(false)
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
                onChange={changeTaskState} />
            {editMode ? (
                <>
                    <input
                        className='flex-1'
                        type="text"
                        defaultValue={task.text}
                        autoFocus={true}
                        onChange={onEditChange}
                        onBlur={onEditBlur}
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
                type={undefined}
                className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                iconName="remove-bin"
                onClick={deleteTask} />
        </div >
    )
}

export default ToDoItem