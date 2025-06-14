export type Task = {
  id: string;
  text: string;
  completed: boolean;
  createdDate: number;
  completedDate: number;
}

export type CreateUpdateTask = {
  text: string;
}