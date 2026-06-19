import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import { store } from './store'

// look up the root element up front so we can fail with a clear error if it is missing
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