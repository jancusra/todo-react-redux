import { useState } from 'react'
import { useCreateTaskMutation,
  useCompleteTaskMutation, 
  useDeleteTaskMutation,
  useGetAllTasksQuery } from '../rtk-query'
import Button from './Button'
import SelectBox from './SelectBox'
import TextBox from './TextBox'
import ToDoItem from './ToDoItem'

export type ToDoListProps = {
    editNameByDoubleClickEnabled?: boolean,
    showFilter?: boolean,
    showCompleted?: boolean,
    visibleCanBeMarkedAsCompleted?: boolean,
    allCompletedCanBeCleared?: boolean
}

const ToDoList = (props: ToDoListProps) => {
    const { data, error, isLoading } = useGetAllTasksQuery()
    const [ completeTaskMut ] = useCompleteTaskMutation()
    const [ createTaskMut ] = useCreateTaskMutation()
    const [ deleteTaskMut ] = useDeleteTaskMutation()
    const [ onlyCompleted, setOnlyCompleted ] = useState<boolean | null>(null)

    function addTask(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const formData = new FormData(e.target as HTMLFormElement)
        const input_text = formData.get('todoin') as string

        if (input_text) {
            createTaskMut({ text: input_text })
        }
    }

    function changeFilter(filterState: string) {
        if (filterState === "completed") {
            setOnlyCompleted(true)
        } else if (filterState === "not-completed") {
            setOnlyCompleted(false)
        } else {
            setOnlyCompleted(null)
        }
    }

    function markVisibleAsCompleted() {
        if (data) {
            data.map(entry => {
                if ((onlyCompleted === null || onlyCompleted === false) && !entry.completed) {
                    completeTaskMut(entry.id)
                }
            })
        }
    }

    function clearCompleted() {
        if (data) {
            data.map(entry => {
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
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
                    placeholder="Add a new task ..."
                    required={true} />
                <Button 
                    type="submit"
                    innerText="Add"
                    className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:opacity-90 transition-opacity" />
            </form>

            { props.showFilter && <SelectBox 
                items={[
                    { value: "all", text: "All" },
                    { value: "completed", text: "Completed" },
                    { value: "not-completed", text: "Not completed" }
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
                            if (onlyCompleted === null || (onlyCompleted && entry.completed) || (!onlyCompleted && entry.completed === false))
                                return <ToDoItem 
                                            key={entry.id} 
                                            task={entry} 
                                            editNameByDoubleClickEnabled={props.editNameByDoubleClickEnabled} />
                                })
                        }
                    </>
                ) : null}
            </div>

            { (props.showCompleted || props.visibleCanBeMarkedAsCompleted || props.allCompletedCanBeCleared) && data && 
                <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 flex justify-between">
                    { props.showCompleted && 
                        <>
                            Completed: { data.filter(item => item.completed).length }/{ data.length }
                        </> 
                    }

                    { props.visibleCanBeMarkedAsCompleted && 
                        <Button 
                            type={undefined}
                            innerText="Mark as completed"
                            className="hover:text-primary-light dark:hover:text-primary-dark"
                            onClick={markVisibleAsCompleted} />
                    }
                    { props.allCompletedCanBeCleared &&  
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