import { useState } from 'react'
import { useCreateTaskMutation,
  useCompleteTaskMutation, 
  useDeleteTaskMutation,
  useGetAllTasksQuery } from './rtk-query'
import Icons from "./Icons"
import Button from './components/Button'
import SelectBox from './components/SelectBox'
import TextBox from './components/TextBox'
import ThemeSwitch from './components/ThemeSwitch'
import ToDoItem from './components/ToDoItem'
import './App.css'

function App() {
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
                return <ToDoItem key={entry.id} task={entry} />
              }
            )}
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
