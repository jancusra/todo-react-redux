import { useRef, useState } from 'react'
import { useCreateTaskMutation,
  useCompleteTaskMutation, 
  useDeleteTaskMutation,
  useGetAllTasksQuery,
  useIncompleteTaskMutation, 
  useUpdateTaskMutation } from './rtk-query'
import type { Task } from './types'
import Icons from "./Icons"
import Button from './components/Button'
import SelectBox from './components/SelectBox'
import TextBox from './components/TextBox'
import ThemeSwitch from './components/ThemeSwitch'
import './App.css'

function App() {
  const { data, error, isLoading } = useGetAllTasksQuery()
  const [ createTaskMut ] = useCreateTaskMutation()
  const [ completeTaskMut ] = useCompleteTaskMutation()
  const [ deleteTaskMut ] = useDeleteTaskMutation()
  const [ incompleteTaskMut ] = useIncompleteTaskMutation()
  const [ updateTaskMut ] = useUpdateTaskMutation()
  const [ onlyCompleted, setOnlyCompleted ] = useState<boolean | null>(null)
  const [ editingId, setEditingId ] = useState<string | null>(null)
  const editInput = useRef<string | null>(null)

  function addTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const input_text = formData.get('todoin') as string

    if (input_text) {
      createTaskMut({ text: input_text })
    }
  }

  function deleteTask(id: string) {
    if (id) {
      deleteTaskMut(id)
    }
  }

  function editById(task: Task) {
    editInput.current = task.text
    setEditingId(task.id)
  }

  function onEditChange(e: React.ChangeEvent<HTMLInputElement>) {
    editInput.current = e.target.value
  }

  function onEditBlur() {
    if (editingId && editInput.current) {
      updateTaskMut({ id: editingId, text: editInput.current })
      setEditingId(null)
    }
  }

  function changeTaskState(id: string, incomplete: boolean) {
    if (incomplete) {
      incompleteTaskMut(id)
    } else {
      completeTaskMut(id)
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
    <div className="container mx-auto px-2 py-8 max-w-md">
      <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-primary-light dark:text-primary-dark">Todo App</h1>
          <ThemeSwitch darkAsDefault={true} />
      </header>

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

      <SelectBox 
          items={[
            { value: "all", text: "All" },
            { value: "completed", text: "Completed" },
            { value: "not-completed", text: "Not completed" }
          ]}
          onChange={changeFilter} />

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
                return <div key={entry.id} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <input
                    className="h-5 w-5 rounded border-gray-300 text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark accent-primary-light dark:accent-primary-dark"
                    type="checkbox"
                    checked={entry.completed}
                    onChange={() => { 
                      changeTaskState(entry.id, entry.completed) 
                    }}
                  />
                  { editingId == entry.id ? (
                    <input
                      className='flex-1'
                      type="text"
                      defaultValue={entry.text}
                      autoFocus={true}
                      onChange={onEditChange}
                      onBlur={onEditBlur}
                    />
                  ) : (
                    <span className={`flex-1 cursor-text ${entry.completed ? 'line-through opacity-70' : ''}`} onDoubleClick={() => { editById(entry) }}>
                      {entry.text}
                    </span>
                  )}
                  <Button 
                    type={undefined}
                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                    iconName="remove-bin"
                    onClick={() => { deleteTask(entry.id) }} />
                </div>
              })}
          </>
        ) : null}
      </div>

      { data && 
        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 flex justify-between">
          Completed: { data.filter(item => item.completed).length }/{ data.length }

          <Button 
            type={undefined}
            innerText="Mark as completed"
            className="hover:text-primary-light dark:hover:text-primary-dark"
            onClick={markVisibleAsCompleted} />
          <Button 
            type={undefined}
            innerText="Clear completed"
            className="hover:text-primary-light dark:hover:text-primary-dark"
            onClick={clearCompleted} />
        </div>
      }

      <Icons />
    </div>
  )
}

export default App
