import React, { useState, useEffect } from 'react';
import { Plus, Check, RotateCcw, Trash2, Edit2, Calendar, AlertCircle } from 'lucide-react';

const API_URL = 'http://localhost:8080/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskText, setEditingTaskText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al cargar las tareas');
      const data = await response.json();
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('No se pudieron cargar las tareas. Verifica que el servidor esté ejecutándose.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (taskToUpdate) => {
    try {
      const response = await fetch(`${API_URL}/${taskToUpdate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskToUpdate),
      });
      if (!response.ok) throw new Error('Error al actualizar la tarea');
      const updatedTask = await response.json();
      setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Error al actualizar la tarea');
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    
    // Validate dates
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setError('La fecha de inicio no puede ser posterior a la fecha de fin');
      return;
    }
    
    try {
      setError('');
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: newTaskText, 
          startDate: startDate || new Date().toISOString().split('T')[0], 
          endDate, 
          status: 'todo' 
        }),
      });
      if (!response.ok) throw new Error('Error al crear la tarea');
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setNewTaskText('');
      setStartDate('');
      setEndDate('');
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Error al agregar la tarea');
    }
  };

  const deleteTask = async (id) => {
    try {
      setError('');
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar la tarea');
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Error al eliminar la tarea');
    }
  };
  
  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskText(task.text);
  };

  const finishEditing = (task) => {
    if (editingTaskText.trim()) {
      handleUpdateTask({ ...task, text: editingTaskText.trim() });
    }
    setEditingTaskId(null);
    setEditingTaskText('');
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingTaskText('');
  };

  const moveTask = (task, newStatus) => {
    const updatedTask = { ...task, status: newStatus };
    if (newStatus === 'done' && !task.endDate) {
      updatedTask.endDate = new Date().toISOString().split('T')[0];
    }
    handleUpdateTask(updatedTask);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isOverdue = (task) => {
    if (!task.endDate || task.status === 'done') return false;
    return new Date(task.endDate) < new Date();
  };

  const renderTask = (task) => (
    <div key={task.id} className={`bg-white rounded-lg shadow-sm border-l-4 p-4 mb-3 transition-all hover:shadow-md ${
      isOverdue(task) ? 'border-l-red-500 bg-red-50' : 
      task.status === 'done' ? 'border-l-green-500' : 'border-l-blue-500'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {editingTaskId === task.id ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editingTaskText}
                onChange={(e) => setEditingTaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') finishEditing(task);
                  if (e.key === 'Escape') cancelEditing();
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <div className="flex gap-2">
                <button 
                  onClick={() => finishEditing(task)}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Guardar
                </button>
                <button 
                  onClick={cancelEditing}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className={`font-medium text-gray-900 ${task.status === 'done' ? 'line-through text-gray-500' : ''}`}>
                  {task.text}
                </h3>
                {isOverdue(task) && (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Inicio: {formatDate(task.startDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span className={isOverdue(task) ? 'text-red-600 font-medium' : ''}>
                    Fin: {formatDate(task.endDate)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {editingTaskId !== task.id && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => startEditing(task)}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
              title="Editar tarea"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            
            {task.status === 'todo' ? (
              <button
                onClick={() => moveTask(task, 'done')}
                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                title="Marcar como completada"
              >
                <Check className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => moveTask(task, 'todo')}
                className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded"
                title="Mover a pendientes"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            
            <button
              onClick={() => deleteTask(task.id)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
              title="Eliminar tarea"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
  
  const todoTasks = tasks.filter(t => t.status === 'todo');
  const doneTasks = tasks.filter(t => t.status === 'done');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tareas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Mi Tablero de Tareas
          </h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="Nueva tarea..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button 
                type="submit" 
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Agregar Tarea
              </button>
            </div>
          </div>
        </header>
        
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Por Hacer</h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {todoTasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {todoTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>¡Genial! No tienes tareas pendientes</p>
                </div>
              ) : (
                todoTasks.map(renderTask)
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Completadas</h2>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {doneTasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {doneTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Aún no hay tareas completadas</p>
                </div>
              ) : (
                doneTasks.map(renderTask)
              )}
            </div>
          </div>
        </main>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Haz doble clic en una tarea para editarla • Las tareas vencidas aparecen resaltadas en rojo</p>
        </div>
      </div>
    </div>
  );
}

export default App;