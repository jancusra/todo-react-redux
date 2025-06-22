import Icons from './Icons'
import ThemeSwitch from './components/ThemeSwitch'
import ToDoList from './components/ToDoList'
import './App.css'

/**
 * basic application component
 */
function App() {
  return (
    <div className="container mx-auto px-2 py-8 max-w-md">
      <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-primary-light dark:text-primary-dark">ToDo App</h1>
          <ThemeSwitch darkAsDefault={true} />
      </header>

      <ToDoList 
          editNameByDoubleClickEnabled={true}
          showFilter={true}
          showCompleted={true}
          visibleCanBeMarkedAsCompleted={true}
          allCompletedCanBeCleared={true} />

      <Icons />
    </div>
  )
}

export default App