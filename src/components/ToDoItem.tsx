import { useRef, useState } from 'react'
import { useCompleteTaskMutation, 
  useDeleteTaskMutation,
  useIncompleteTaskMutation, 
  useUpdateTaskMutation } from '../rtk-query'
import type { Task } from '../types'
import Button from './Button'

export type ToDoItemProps = {
    task: Task
}

const ToDoItem = (props: ToDoItemProps) => {
    const [ completeTaskMut ] = useCompleteTaskMutation()
    const [ deleteTaskMut ] = useDeleteTaskMutation()
    const [ incompleteTaskMut ] = useIncompleteTaskMutation()
    const [ updateTaskMut ] = useUpdateTaskMutation()
    const [ editMode, setEditMode ] = useState<boolean>(false)
    const editInput = useRef<string | null>(null)

    function changeTaskState() {
        if (props.task.completed) {
            incompleteTaskMut(props.task.id)
        } else {
            completeTaskMut(props.task.id)
        }
    }

    function onEditChange(e: React.ChangeEvent<HTMLInputElement>) {
        editInput.current = e.target.value
    }

    function onEditBlur() {
        if (editMode && editInput.current) {
            updateTaskMut({ id: props.task.id, text: editInput.current })
            setEditMode(false)
        }
    }

    function editTask() {
        editInput.current = props.task.text
        setEditMode(true)
    }

    function deleteTask() {
        deleteTaskMut(props.task.id)
    }

    return (
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
            <input
                className="h-5 w-5 rounded border-gray-300 text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark accent-primary-light dark:accent-primary-dark"
                type="checkbox"
                checked={props.task.completed}
                onChange={changeTaskState} />
            { editMode ? (
                <input
                    className='flex-1'
                    type="text"
                    defaultValue={props.task.text}
                    autoFocus={true}
                    onChange={onEditChange}
                    onBlur={onEditBlur}
                />
            ) : (
                <span className={`flex-1 cursor-text ${props.task.completed ? 'line-through opacity-70' : ''}`} onDoubleClick={editTask}>
                    {props.task.text}
                </span>
            )}
            <Button 
                type={undefined}
                className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                iconName="remove-bin"
                onClick={deleteTask} />
        </div>
    )
}

export default ToDoItem