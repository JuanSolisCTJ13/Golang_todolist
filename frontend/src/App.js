import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:8080/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskText, setEditingTaskText] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleUpdateTask = async (taskToUpdate) => {
    try {
      const response = await fetch(`${API_URL}/${taskToUpdate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskToUpdate),
      });
      const updatedTask = await response.json();
      setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTaskText, startDate, endDate, status: 'todo' }),
      });
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setNewTaskText('');
      setStartDate('');
      setEndDate('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  
  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskText(task.text);
  };

  const finishEditing = (task) => {
    handleUpdateTask({ ...task, text: editingTaskText });
    setEditingTaskId(null);
    setEditingTaskText('');
  };

  const moveTask = (task, newStatus) => {
    handleUpdateTask({ ...task, status: newStatus });
  };

  const renderTask = (task) => (
    <li key={task.id} className="task-card">
      <div className="task-content">
        {editingTaskId === task.id ? (
          <input
            type="text"
            value={editingTaskText}
            onChange={(e) => setEditingTaskText(e.target.value)}
            onBlur={() => finishEditing(task)}
            onKeyPress={(e) => e.key === 'Enter' && finishEditing(task)}
            autoFocus
          />
        ) : (
          <span onDoubleClick={() => startEditing(task)}>{task.text}</span>
        )}
        <div className="task-dates">
          <small>Inicio: {task.startDate}</small>
          <small>Fin: {task.endDate}</small>
        </div>
      </div>
      <div className="task-actions">
        {task.status === 'todo' && <button onClick={() => moveTask(task, 'done')}>✔</button>}
        {task.status === 'done' && <button onClick={() => moveTask(task, 'todo')}>↩</button>}
        <button onClick={() => deleteTask(task.id)} className="delete-btn">🗑️</button>
      </div>
    </li>
  );
  
  const todoTasks = tasks.filter(t => t.status === 'todo');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <div className="App">
      <header className="App-header">
        <h1>Mi Tablero de Tareas</h1>
        <form onSubmit={addTask} className="add-task-form">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Nueva tarea..."
          />
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <button type="submit">Agregar</button>
        </form>
      </header>
      <main className="board">
        <div className="column">
          <h2>Por Hacer</h2>
          <ul className="task-list">
            {todoTasks.map(renderTask)}
          </ul>
        </div>
        <div className="column">
          <h2>Hechas</h2>
          <ul className="task-list">
            {doneTasks.map(renderTask)}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
