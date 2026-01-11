import { create } from "zustand";

export interface Task {
  id: string;
  name: string;
  description: string;
  done: boolean;
  ddl: string;
  docs?: File[];
}

interface TasksState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

const useTaskStore = create<TasksState>((set) => ({
  tasks: [],
  setTasks: (tasks: Task[]) => {
    set(() => ({ tasks }));
    // todo api
  },
}));

export default useTaskStore;
