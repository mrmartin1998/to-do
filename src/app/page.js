'use client';  // This tells Next.js this is a client component

import { useState } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import TodoItem from '@/components/TodoItem';

export default function Home() {
  // Use our custom hook to persist todos in localStorage
  const [todos, setTodos] = useLocalStorage('todos', []);
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState('medium');

  // Function to add a new todo
  const handleAddTodo = (e) => {
    e.preventDefault();
    
    if (!newTodo.trim()) return; // Don't add empty todos
    
    const todo = {
      id: Date.now().toString(), // Simple way to generate unique IDs
      title: newTodo,
      completed: false,
      priority: priority,
      createdAt: new Date()
    };

    setTodos([...todos, todo]);
    setNewTodo(''); // Clear input after adding
  };

  // Function to toggle todo completion
  const handleToggle = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Function to delete a todo
  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center my-8">Todo List</h1>
      
      {/* Todo Input Form */}
      <form onSubmit={handleAddTodo} className="flex gap-2 mb-8">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
          className="input input-bordered flex-1"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="select select-bordered"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit" className="btn btn-primary">
          Add Todo
        </button>
      </form>

      {/* Todo List */}
      <div className="space-y-4">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
