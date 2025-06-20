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
  const addInput = useRef<string | null>(null)
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

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    addInput.current = e.target.value
  }

  function onAdd() {
    if (addInput.current) {
      createTaskMut({ text: addInput.current })
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

  function changeFilter(onlyCompleted: boolean | null) {
    setOnlyCompleted(onlyCompleted)
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

  function deleteAllCompleted() {
    if (data) {
      data.map(entry => {
        if (entry.completed) {
          deleteTaskMut(entry.id)
        }
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
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

      <form id="todo-form" className="mb-6 flex gap-2">
        <input 
          type="text" 
          id="todo-input" 
          placeholder="Add a new task..." 
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
          required />
        <button 
          type="submit" 
          className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:opacity-90 transition-opacity">
          Add
        </button>
      </form>

      {/*<div id="myDIV" className="header">
        <h2>My To Do List</h2>
        <input type="text" id="myInput" placeholder="Title..." onChange={onInputChange} />
        <button className="p-2 rounded-full bg-gray-200 dark:bg-gray-700" onClick={onAdd}>Add</button>
      </div>
      <div className="header2">
        <button className={`common-button ${onlyCompleted === null ? 'selected' : ''}`} onClick={() => { changeFilter(null) }}>
          All
        </button>
        <button className={`common-button ${onlyCompleted ? 'selected' : ''}`} onClick={() => { changeFilter(true) }}>
          Completed
        </button>
        <button className={`common-button ${onlyCompleted === false ? 'selected' : ''}`} onClick={() => { changeFilter(false) }}>
          Not completed
        </button>
        <div className='gap'></div>
        <button className={"common-button"} onClick={markVisibleAsCompleted}>
          Mark all visible as completed
        </button>
        <div className='gap'></div>
        <button className={"common-button"} onClick={deleteAllCompleted}>
          Delete all completed
        </button>
      </div>
      <div className="header3">
        { data && 
          <>
            Completed tasks: 
            <div className='gap2'></div>
            { data.filter(item => item.completed).length }/{ data.length }
          </>
        }
      </div>

      {error ? (
        <>Oh no, there was an error</>
      ) : isLoading ? (
        <>Loading...</>
      ) : data ? (
        <ul>
          {data.map(entry => {
            if (onlyCompleted === null || (onlyCompleted && entry.completed) || (!onlyCompleted && entry.completed === false))
              return <li key={entry.id} className={(entry.completed ? 'checked' : '' )}>
                <div className='check-area' onClick={() => { changeTaskState(entry.id, entry.completed) }}></div>
                { editingId == entry.id ? (
                  <input
                    type="text"
                    defaultValue={entry.text}
                    onChange={onEditChange}
                    onBlur={onEditBlur}
                  />
                ) : (
                  <span onDoubleClick={() => { editById(entry) }}>{entry.text}</span>
                )}
                <button className="delete-task" onClick={() => { deleteTask(entry.id) }}>
                  <span>X</span>
                </button>
              </li>
          })}
        </ul>
      ) : null}*/}
    </div>
  )
}

export default App
