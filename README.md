# ToDo List app by React, RTK Query & Tailwind CSS

[Here is the server API for this application](https://github.com/morosystems/todo-be)
###
The app has one page with a list of tasks. Any changes to the list are reflected on the backend, which can be found at https://github.com/morosystems/todo-be (see its readme file for instructions on how to get it running).
###
The app has the following features:
* Tasks can be added.
* Tasks can be removed and renamed.
* Tasks can be marked as completed.
* Tasks can be filtered into finished and unfinished.
* All visible tasks can be marked as done at once.
* All completed tasks can be deleted at once.
* The number of completed tasks is displayed.
###
Note the error handling for cases when the backend, for some reason, does not perform an operation. If you get bored, you can keep improving the application — optimistic updates, for example, are already in place.

## Getting started

### Prerequisites
* [Node.js](https://nodejs.org/) 18+ and npm.
* The [ToDo backend](https://github.com/morosystems/todo-be) running locally (the frontend expects it at `http://localhost:8080/` by default).

### Installation
```bash
npm install
```

### Configuration
The base URL of the backend API is configurable via the `VITE_API_URL` environment variable. Copy the example file and adjust it if your backend runs elsewhere:
```bash
cp .env.example .env
```
If `VITE_API_URL` is not set, the app falls back to `http://localhost:8080/`.

### Running the app
Start the Vite development server:
```bash
npm run dev
```
The app runs at **http://localhost:5173** (Vite's default dev port). Vite prints the exact URL in the terminal, and will pick the next free port if 5173 is already in use.

### Production build
```bash
npm run build      # type-checks and builds into dist/
npm run preview    # serves the production build at http://localhost:4173
```

## Testing
The project uses [Vitest](https://vitest.dev/) with [React Testing Library](https://testing-library.com/).
```bash
npm test           # run the test suite once
npm run test:watch # run the tests in watch mode
```

## Linting
```bash
npm run lint
```
