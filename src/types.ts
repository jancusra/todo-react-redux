// Common types & unions

export type Task = {
  readonly id: string;
  readonly text: string;
  readonly createdDate: number;
  readonly completedDate: number;
  completed: boolean;
}

export type CreateTask = {
  text: string;
}

export type FilterType = "All" | "Completed" | "NotCompleted"