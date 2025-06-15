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
  const [ editingId, setEditingId ] = useState<string | null>(null)
  const addInput = useRef<string | null>(null)
  const editInput = useRef<string | null>(null)

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

  return (
    <>
      <div id="myDIV" className="header">
        <h2>My To Do List</h2>
        <input type="text" id="myInput" placeholder="Title..." onChange={onInputChange} />
        <span className="addBtn" onClick={onAdd}>Add</span>
      </div>

      {error ? (
        <>Oh no, there was an error</>
      ) : isLoading ? (
        <>Loading...</>
      ) : data ? (
        <ul>
          {data.map(entry => (
            <li key={entry.id} className={(entry.completed ? 'checked' : '' )}>
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
          ))}
        </ul>
      ) : null}
    </>
  )
}

export default App
