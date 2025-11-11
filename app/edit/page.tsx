"use client";
import { useEffect, useState } from "react";
import { getTasks, addTask, updateTask, deleteTask } from "./actions/tasks";

interface Task {
  id: number;
  title: string;
  description?: string;
  status: "pendente" | "concluída";
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("todas");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTask() {
    if (!newTask.trim()) return;
    
    setLoading(true);
    try {
      await addTask({ title: newTask });
      setNewTask("");
      await loadTasks();
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(task: Task) {
    setLoading(true);
    try {
      const newStatus = task.status === "pendente" ? "concluída" : "pendente";
      await updateTask(task.id, { status: newStatus });
      await loadTasks();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    setLoading(true);
    try {
      await deleteTask(id);
      await loadTasks();
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(task: Task) {
    setEditingTask(task);
    setEditTitle(task.title);
  }

  async function saveEdit() {
    if (!editingTask || !editTitle.trim()) return;
    
    setLoading(true);
    try {
      await updateTask(editingTask.id, { title: editTitle });
      setEditingTask(null);
      setEditTitle("");
      await loadTasks();
    } catch (error) {
      console.error("Erro ao editar tarefa:", error);
    } finally {
      setLoading(false);
    }
  }

  function cancelEdit() {
    setEditingTask(null);
    setEditTitle("");
  }

  const filteredTasks = filter === "todas" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        
        {}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📝 Minhas Tarefas
          </h1>
          <p className="text-gray-600">Organize seu dia de forma simples</p>
        </div>

        {}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border">
          <div className="flex gap-3">
            <input
              placeholder="O que precisa fazer?"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button 
              onClick={handleAddTask}
              disabled={loading || !newTask.trim()}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? "..." : "➕"}
            </button>
          </div>
        </div>

        {}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-gray-700 font-medium">Filtrar:</span>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="todas">Todas</option>
            <option value="pendente">Pendentes</option>
            <option value="concluída">Concluídas</option>
          </select>
        </div>

        {}
        {loading && tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Carregando tarefas...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white rounded-xl shadow-sm p-4 border-2 transition-all ${
                  editingTask?.id === task.id ? 'border-blue-500' : 'border-white'
                } ${task.status === 'concluída' ? 'opacity-75' : ''}`}
              >
                {editingTask?.id === task.id ? (
                  // Edit Mode
                  <div className="flex items-center gap-3">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                    />
                    <button 
                      onClick={saveEdit}
                      className="bg-green-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-600"
                    >
                      ✓
                    </button>
                    <button 
                      onClick={cancelEdit}
                      className="bg-gray-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                 
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleToggleStatus(task)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-white ${
                          task.status === 'concluída' 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-gray-400 hover:border-green-500'
                        }`}
                      >
                        {task.status === 'concluída' && '✓'}
                      </button>
                      <div>
                        <span className={`text-lg ${task.status === 'concluída' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {task.title}
                        </span>
                        {task.description && (
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(task)}
                        className="text-blue-500 hover:text-blue-700 p-2"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {}
        {filteredTasks.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-600 text-lg">
              {filter === "todas" 
                ? "Nenhuma tarefa ainda. Adicione a primeira!" 
                : `Nenhuma tarefa ${filter === "pendente" ? "pendente" : "concluída"}.`
              }
            </p>
          </div>
        )}

        {}
        {tasks.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-600">
            {tasks.filter(t => t.status === 'concluída').length} de {tasks.length} tarefas concluídas
          </div>
        )}
      </div>
    </div>
  );
}