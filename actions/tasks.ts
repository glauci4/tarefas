'use server';

interface Task {
  id: number;
  title: string;
  description?: string;
  complete: boolean;
}

let tasks: Task[] = [];

export async function getTasks(): Promise<Task[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...tasks];
}

export async function addTask(taskData: { title: string; description?: string }): Promise<{ success: boolean; task?: Task }> {
  try {
    const newTask: Task = {
      id: Date.now(),
      ...taskData,
      complete: false
    };
    tasks.push(newTask);
    return { success: true, task: newTask };
  } catch (error) {
    console.error('Error adding task:', error);
    return { success: false };
  }
}

export async function updateTask(
  id: number, 
  updatedData: { title?: string; description?: string; complete?: boolean }
): Promise<{ success: boolean; task?: Task }> {
  try {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      tasks[taskIndex] = { ...tasks[taskIndex], ...updatedData };
      return { success: true, task: tasks[taskIndex] };
    }
    return { success: false };
  } catch (error) {
    console.error('Error updating task:', error);
    return { success: false };
  }
}

export async function deleteTask(id: number): Promise<{ success: boolean }> {
  try {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1);
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    console.error('Error deleting task:', error);
    return { success: false };
  }
}