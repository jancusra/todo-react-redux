import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { CreateTask, Task } from './types'

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
    createTask: build.mutation<Task, CreateTask>({
      query: (create_task) => ({
        url: 'tasks',
        method: 'POST',
        body: create_task
      }),
      invalidatesTags: [{ type: 'Tasks', id: 'LIST' }]
    })
  })
})

export const {
  useCreateTaskMutation,
  useGetAllTasksQuery
} = todoListApi