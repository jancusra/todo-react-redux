import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryApi, BaseQueryExtraOptions, BaseQueryFn, FetchArgs, RetryOptions } from '@reduxjs/toolkit/query/react'
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
        // optimistically add a new task with a temporary ID
        const tempId = `temp-${Date.now()}`

        dispatch(
          todoListApi.util.updateQueryData('getAllTasks', undefined, (draft) => {
            draft.push({
              // fields you already know from the form:
              ...arg,
              // temporary values:
              id: tempId,
              completed: false
            } as Task)
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
          dispatch(todoListApi.util.invalidateTags(['Tasks']))
        }
      }
    }),
    // update a task
    updateTask: build.mutation<Task, Partial<Task>>({
      query: (updateTaskQuery) => ({
        url: `tasks/${updateTaskQuery.id}`,
        method: 'PUT',
        body: { text: updateTaskQuery.text }
      }),
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        dispatch(
          todoListApi.util.updateQueryData(
            'getAllTasks',
            undefined,
            (draft) => {
              const item = draft.find((task) => task.id === id)
              if (item) {
                Object.assign(item, patch)
              }
              return draft
            }
          )
        )

        try {
          await queryFulfilled
        } catch {
          dispatch(todoListApi.util.invalidateTags([{ type: 'Tasks', id }]))
        }
      }
    }),
    // delete a task & optimistic cache update
    deleteTask: build.mutation<string, string>({
      query: (id) => ({
        url: `tasks/${id}`,
        method: 'DELETE'
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        dispatch(
          todoListApi.util.updateQueryData(
            'getAllTasks',
            undefined,
            (draft) => {
              const i = draft.findIndex((task) => task.id === id)
              if (i !== -1) {
                draft.splice(i, 1)
              }
            }
          )
        )

        try {
          await queryFulfilled
        } catch {
          dispatch(todoListApi.util.invalidateTags(['Tasks']))
        }
      }
    }),
    // mark task as completed & optimistic cache update
    completeTask: build.mutation<Task, string>({
      query: (id) => ({
        url: `tasks/${id}/complete`,
        method: 'POST'
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        dispatch(
          todoListApi.util.updateQueryData(
            'getAllTasks',
            undefined,
            (draft) => {
              const item = draft.find((task) => task.id === id)
              if (item) {
                item.completed = true
              }
              return draft
            }
          )
        )

        try {
          await queryFulfilled
        } catch {
          dispatch(todoListApi.util.invalidateTags([{ type: 'Tasks', id }]))
        }
      }
    }),
    // mark task as incompleted & optimistic cache update
    incompleteTask: build.mutation<Task, string>({
      query: (id) => ({
        url: `tasks/${id}/incomplete`,
        method: 'POST'
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        dispatch(
          todoListApi.util.updateQueryData(
            'getAllTasks',
            undefined,
            (draft) => {
              const item = draft.find((task) => task.id === id)
              if (item) {
                item.completed = false
              }
              return draft
            }
          )
        )

        try {
          await queryFulfilled
        } catch {
          dispatch(todoListApi.util.invalidateTags([{ type: 'Tasks', id }]))
        }
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