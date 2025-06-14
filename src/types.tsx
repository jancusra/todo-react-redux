export type Task = {
  id: string;
  text: string;
  completed: boolean;
  createdDate: number;
}

export type CreateTask = {
  text: string;
}