import { useRef, useState } from 'react'
import { useCreateTaskMutation,
  useCompleteTaskMutation, 
  useDeleteTaskMutation,
  useGetAllTasksQuery,
  useIncompleteTaskMutation, 
  useUpdateTaskMutation } from './rtk-query'
import type { Task } from './types'
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

  function switchTheme() {
    const html = document.documentElement
    const themeIconLight = document.getElementById('theme-icon-light')
    const themeIconDark = document.getElementById('theme-icon-dark')
    html.classList.toggle('dark')
          
    if (html.classList.contains('dark')) {
      themeIconLight!.classList.add('hidden')
      themeIconDark!.classList.remove('hidden')
    } else {
      themeIconLight!.classList.remove('hidden')
      themeIconDark!.classList.add('hidden')
    }
  }

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
          <button id="theme-toggle" className="p-2 rounded-full bg-gray-200 dark:bg-gray-700" onClick={switchTheme}>
              <svg id="theme-icon-light" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hidden" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
              <svg id="theme-icon-dark" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
          </button>
      </header>

      <form id="todo-form" className="mb-4 flex gap-2" onSubmit={addTask}>
        <input 
          id="todo-input"
          name="todoin"
          type="text"
          placeholder="Add a new task..." 
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
          required />
        <button 
          type="submit" 
          className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:opacity-90 transition-opacity">
          Add
        </button>
      </form>

      <div className="sm:hidden pb-4">
        <label htmlFor="tabs" className="sr-only">Select option</label>
        <select id="tabs" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => { changeFilter(e.target.value) }}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="not-completed">Not completed</option>
        </select>
      </div>
      <ul className="hidden pb-4 text-sm font-medium text-center text-gray-500 rounded-lg shadow-sm sm:flex dark:divide-gray-700 dark:text-gray-400">
        <li className="w-full focus-within:z-10">
          <a href="#" className={`inline-block w-full p-2 border-r border-gray-200 dark:border-gray-700 focus:outline-none rounded-s-lg dark:bg-gray-800 ${onlyCompleted === null ? 'bg-primary-light text-white dark:bg-primary-dark text-gray-900 dark:bg-gray-700 dark:text-white active' : ''}`} onClick={() => { changeFilter("all") }}>All</a>
        </li>
        <li className="w-full focus-within:z-10">
          <a href="#" className={`inline-block w-full p-2 border-r border-gray-200 dark:border-gray-700 focus:outline-none dark:bg-gray-800 ${onlyCompleted ? 'bg-primary-light text-white dark:bg-primary-dark text-gray-900 dark:bg-gray-700 dark:text-white active' : ''}`} onClick={() => { changeFilter("completed") }}>Completed</a>
        </li>
        <li className="w-full focus-within:z-10">
          <a href="#" className={`inline-block w-full p-2 border-s-0 border-gray-200 dark:border-gray-700 focus:outline-none rounded-e-lg dark:bg-gray-800 ${onlyCompleted === false ? 'bg-primary-light text-white dark:bg-primary-dark text-gray-900 dark:bg-gray-700 dark:text-white active' : ''}`} onClick={() => { changeFilter("not-completed") }}>Not completed</a>
        </li>
      </ul>

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
                    className="h-5 w-5 rounded border-gray-300 text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark"
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
                  <button className="text-red-500 hover:text-red-700 dark:hover:text-red-400" onClick={() => { deleteTask(entry.id) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              })}
          </>
        ) : null}
      </div>

      { data && 
        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 flex justify-between">
          Completed: { data.filter(item => item.completed).length }/{ data.length }

          <button id="mark-as-completed" className="hover:text-primary-light dark:hover:text-primary-dark" onClick={markVisibleAsCompleted}>
            Mark as completed
          </button>
          <button id="clear-completed" className="hover:text-primary-light dark:hover:text-primary-dark" onClick={clearCompleted}>
            Clear completed
          </button>
        </div>
      }
    </div>
  )
}

export default App
