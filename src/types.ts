// Common types & unions

export type Task = {
  readonly id: string;
  readonly text: string;
  readonly createdDate: number;
  // optional: the backend omits it on creation and clears it on "incomplete"
  readonly completedDate?: number;
  completed: boolean;
}

export type CreateTask = {
  text: string;
}

export type FilterType = "All" | "Completed" | "NotCompleted"