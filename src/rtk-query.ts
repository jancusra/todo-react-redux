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
          ? [
              ...result.map(({ id }) => ({ type: 'Tasks' as const, id })),
              { type: 'Tasks', id: 'LIST' },
            ]
          : [{ type: 'Tasks', id: 'LIST' }]
    }),
    createTask: build.mutation<Task, Partial<Task>>({
      query: (create_task) => ({
        url: 'tasks',
        method: 'POST',
        body: create_task
      }),
      invalidatesTags: [{ type: 'Tasks', id: 'LIST' }]
    }),
    updateTask: build.mutation<Task, Partial<Task>>({
      query: (update_task) => ({
        url: `tasks/${update_task.id}`,
        method: 'POST',
        body: { "text": update_task.text }
      }),
      invalidatesTags: [{ type: 'Tasks', id: 'LIST' }]
    }),
    deleteTask: build.mutation<string, string>({
      query: (id) => ({
        url: `tasks/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Tasks', id: 'LIST' }]
    })
  })
})

export const {
  useGetAllTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation
} = todoListApi