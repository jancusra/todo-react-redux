import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import { store } from './store'

// should prevent double rendering in development mode
const container = document.getElementById('root')

if (container) {
  const root = createRoot(container)

  root.render(
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}