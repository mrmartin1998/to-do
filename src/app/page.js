'use client';

import { useState, useEffect } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import TodoItem from '@/components/TodoItem';
import DeadlinePicker from '@/components/DeadlinePicker';
import useNotifications from '@/hooks/useNotifications';
import SortControls from '@/components/SortControls';
import FilterControls from '@/components/FilterControls';

export default function Home() {
  // Use our custom hook to persist todos in localStorage
  const [todos, setTodos] = useLocalStorage('todos', []);
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState('medium');
  const [deadline, setDeadline] = useState(null);
  const [sortBy, setSortBy] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [filters, setFilters] = useState({ status: 'all', priority: 'all' });

  // Only run on client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useNotifications(todos);

  // Function to add a new todo
  const handleAddTodo = (e) => {
    e.preventDefault();
    
    if (!newTodo.trim()) return;
    
    const todo = {
      id: Date.now().toString(),
      title: newTodo,
      completed: false,
      priority: priority,
      deadline: deadline,
      createdAt: new Date().toISOString() // Convert to string for consistency
    };

    setTodos([...todos, todo]);
    setNewTodo('');
    setDeadline(null);
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

  const getFilteredTodos = () => {
    return todos.filter(todo => {
      const statusMatch = 
        filters.status === 'all' ? true :
        filters.status === 'completed' ? todo.completed :
        !todo.completed;

      const priorityMatch = 
        filters.priority === 'all' ? true :
        todo.priority === filters.priority;

      return statusMatch && priorityMatch;
    });
  };

  const getSortedTodos = () => {
    const filteredTodos = getFilteredTodos();
    if (!sortBy) return filteredTodos;
    
    return [...filteredTodos].sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priority = { high: 3, medium: 2, low: 1 };
          return priority[b.priority] - priority[a.priority];
        case 'deadline':
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline) - new Date(b.deadline);
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });
  };

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  // Only render content on client-side
  if (!isClient) {
    return <div className="min-h-screen p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      {/* Header with title and sort controls */}
      <div className="flex justify-between items-center my-6">
        <h1 className="text-3xl font-bold">Todo List</h1>
        <div className="flex gap-4">
          <FilterControls onFilterChange={handleFilterChange} />
          <SortControls onSortChange={setSortBy} />
        </div>
      </div>
      
      {/* Todo Input Form */}
      <form onSubmit={handleAddTodo} className="flex gap-2 mb-8">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
          className="input input-bordered flex-1"
        />
        <DeadlinePicker
          deadline={deadline}
          onChange={setDeadline}
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
        {getSortedTodos().map(todo => (
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
