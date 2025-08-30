// Common types & unions

export type Task = {
  id: string;
  text: string;
  completed: boolean;
  createdDate: number;
  completedDate: number;
}

export type CreateTask = {
  text: string;
}

export type FilterType = "All" | "Completed" | "NotCompleted"