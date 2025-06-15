import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Task } from './types'

export const todoListApi = createApi({
  reducerPath: 'todoListApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/' }),
  tagTypes: ['Tasks'],
  endpoints: (build) => ({
    getAllTasks: build.query<Task[], void>({
      query: () => 'tasks',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Tasks' as const, id })), 'Tasks']
          : ['Tasks']
    }),
    createTask: build.mutation<Task, Partial<Task>>({
      query: (create_task) => ({
        url: 'tasks',
        method: 'POST',
        body: create_task
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const response = await queryFulfilled

          dispatch(
            todoListApi.util.updateQueryData(
              'getAllTasks',
              undefined,
              (draft) => {
                draft.push(response.data)
                return draft
              }
            )
          )
        } catch {
          dispatch(todoListApi.util.invalidateTags(['Tasks']))
        }
      }
    }),
    updateTask: build.mutation<Task, Partial<Task>>({
      query: (update_task) => ({
        url: `tasks/${update_task.id}`,
        method: 'POST',
        body: { "text": update_task.text }
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
              draft = draft.filter(function(item) {
                return item.id !== id
              })
              return draft
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