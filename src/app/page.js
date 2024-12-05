'use client';

import { useState, useEffect } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import TodoItem from '@/components/TodoItem';
import DeadlinePicker from '@/components/DeadlinePicker';
import useNotifications from '@/hooks/useNotifications';
import SortControls from '@/components/SortControls';
import FilterControls from '@/components/FilterControls';
import AnimatedList from '@/components/AnimatedList';

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

  const { testNotification, simpleTest } = useNotifications(todos);

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
      {/* Header */}
      <div className="flex justify-between items-center gap-2 mb-6">
        <h1 className="text-2xl font-bold">Todo List</h1>
        <div className="flex gap-2">
          <FilterControls onFilterChange={handleFilterChange} />
          <SortControls onSortChange={setSortBy} />
          
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
          className="input input-bordered input-md flex-1 text-sm bg-base-300"
        />
        <div className="flex gap-2">
          <DeadlinePicker
            deadline={deadline}
            onChange={setDeadline}
            className="bg-base-300"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="select select-bordered select-md min-w-[80px] text-sm bg-base-300"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button type="submit" className="btn btn-primary btn-md">
            Add
          </button>
        </div>
      </form>

      {/* Todo List */}
      <AnimatedList items={getSortedTodos()} renderItem={(todo) => (
        <TodoItem
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      )} />

      <button 
        onClick={simpleTest}
        className="btn btn-primary"
      >
        Test Simple Notification
      </button>
    </div>
  );
}
