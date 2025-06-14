import { useRef } from 'react'
import { useCreateTaskMutation, useGetAllTasksQuery } from './rtk-query'
import './App.css'

function App() {
  const { data, error, isLoading } = useGetAllTasksQuery()
  const [ createTask ] = useCreateTaskMutation()
  const addInput = useRef<string | null>(null)

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    addInput.current = e.target.value
  }

  function onAdd() {
    if (addInput.current) {
      createTask({ text: addInput.current })
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
            <li key={entry.id} className="checked">{entry.text}</li>
          ))}
        </ul>
      ) : null}
    </>
  )
}

export default App
