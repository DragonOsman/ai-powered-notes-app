export interface ITodo {
  task: string;
}

export interface INote {
  id: string;
  userId: string;
  title: string;
  content: string;
  summary?: string;
  archived: boolean;
  tags: string[];
  todos: ITodo[];
  createdAt: Date;
  updatedAt: Date;
}