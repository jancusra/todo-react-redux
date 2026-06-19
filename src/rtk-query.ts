import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryApi, BaseQueryExtraOptions, BaseQueryFn, FetchArgs, RetryOptions } from '@reduxjs/toolkit/query/react'
import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit'
import type { CreateTask, Task } from './types'

// API base URL is configurable via the VITE_API_URL env var (see .env)
const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/'
const baseQuery = fetchBaseQuery({ baseUrl })

/**
 * mechanism for catching errors in the API and logging them; the error is
 * propagated through RTK Query state so components can render it in the UI
 */
const baseQueryWithErrorHandling = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: BaseQueryExtraOptions<BaseQueryFn> & RetryOptions) => {
  try {
    const result = await baseQuery(args, api, extraOptions)

    if (result.error) {
      console.error('API error:', result.error)
    }

    return result
  } catch (error) {
    console.error('FETCH error:', error)

    return {
      error: {
        status: 'FETCH_ERROR',
        error: String(error)
      }
    }
  }
}

// minimal shape of the lifecycle api we use inside onQueryStarted; kept loose
// so the shared helper stays decoupled from RTK Query's internal generics
type OptimisticLifecycle = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, any, UnknownAction>
  queryFulfilled: Promise<unknown>
}

/**
 * shared optimistic-update helper for the toggle/update/delete mutations:
 * applies `recipe` to the cached task list immediately and, on failure, rolls
 * the change back locally with `patchResult.undo()` (no refetch / no flash)
 */
function optimisticUpdate(recipe: (draft: Task[]) => void) {
  return async ({ dispatch, queryFulfilled }: OptimisticLifecycle) => {
    const patchResult = dispatch(
      todoListApi.util.updateQueryData('getAllTasks', undefined, recipe)
    )

    try {
      await queryFulfilled
    } catch {
      patchResult.undo()
    }
  }
}

/**
 * complete API definition for server communication, caching and optimistic updates
 */
export const todoListApi = createApi({
  reducerPath: 'todoListApi',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ['Tasks'],
  endpoints: (build) => ({
    // getting all tasks from the server and caching
    getAllTasks: build.query<Task[], void>({
      query: () => 'tasks',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Tasks' as const, id })), 'Tasks']
          : ['Tasks']
    }),
    // create a task
    createTask: build.mutation<Task, CreateTask>({
      query: (createTaskQuery) => ({
        url: 'tasks',
        method: 'POST',
        body: createTaskQuery
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        // optimistically add a new task with a collision-free temporary ID
        const tempId = `temp-${crypto.randomUUID()}`

        const patchResult = dispatch(
          todoListApi.util.updateQueryData('getAllTasks', undefined, (draft) => {
            const optimisticTask: Task = {
              // fields you already know from the form:
              ...arg,
              // temporary values, replaced by the server response on success:
              id: tempId,
              completed: false,
              createdDate: Date.now()
              // completedDate is left unset, matching the backend on creation
            }
            draft.push(optimisticTask)
          })
        )

        try {
          const { data } = await queryFulfilled;

          dispatch(
            todoListApi.util.updateQueryData('getAllTasks', undefined, (draft) => {
              const i = draft.findIndex((t) => t.id === tempId)
              if (i !== -1) {
                draft[i] = data // replace temporary with real data
              } else {
                draft.push(data) // fallback in case the temporary item disappeared
              }
            })
          )
        } catch {
          // remove the temporary item; no refetch needed
          patchResult.undo()
        }
      }
    }),
    // update a task
    updateTask: build.mutation<Task, Partial<Task>>({
      query: (updateTaskQuery) => ({
        // backend exposes text updates as POST /tasks/:id (no PUT handler)
        url: `tasks/${updateTaskQuery.id}`,
        method: 'POST',
        body: { text: updateTaskQuery.text }
      }),
      onQueryStarted({ id, ...patch }, api) {
        return optimisticUpdate((draft) => {
          const item = draft.find((task) => task.id === id)
          if (item) {
            Object.assign(item, patch)
          }
        })(api)
      }
    }),
    // delete a task & optimistic cache update
    deleteTask: build.mutation<string, string>({
      query: (id) => ({
        url: `tasks/${id}`,
        method: 'DELETE'
      }),
      onQueryStarted(id, api) {
        return optimisticUpdate((draft) => {
          const i = draft.findIndex((task) => task.id === id)
          if (i !== -1) {
            draft.splice(i, 1)
          }
        })(api)
      }
    }),
    // mark task as completed & optimistic cache update
    completeTask: build.mutation<Task, string>({
      query: (id) => ({
        url: `tasks/${id}/complete`,
        method: 'POST'
      }),
      onQueryStarted(id, api) {
        return optimisticUpdate((draft) => {
          const item = draft.find((task) => task.id === id)
          if (item) {
            item.completed = true
          }
        })(api)
      }
    }),
    // mark task as incompleted & optimistic cache update
    incompleteTask: build.mutation<Task, string>({
      query: (id) => ({
        url: `tasks/${id}/incomplete`,
        method: 'POST'
      }),
      onQueryStarted(id, api) {
        return optimisticUpdate((draft) => {
          const item = draft.find((task) => task.id === id)
          if (item) {
            item.completed = false
          }
        })(api)
      }
    })
  })
})

export const {
  useGetAllTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useCompleteTaskMutation,
  useIncompleteTaskMutation
} = todoListApi