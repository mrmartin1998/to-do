function TodoItem({ todo, onToggle, onDelete }) {
  // Function to format the deadline date
  const formatDeadline = (date) => {
    if (!date) return null;
    const deadlineDate = new Date(date);
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue!';
    if (diffDays === 0) return 'Due today!';
    if (diffDays === 1) return 'Due tomorrow';
    return `${diffDays} days left`;
  };

  return (
    <div className="card bg-base-100 shadow-xl mb-4">
      <div className="card-body p-4 flex-row items-center gap-4">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="checkbox checkbox-primary"
        />
        <div className="flex-1">
          <h3 className={`text-lg ${todo.completed ? 'line-through opacity-50' : ''}`}>
            {todo.title}
          </h3>
          {todo.deadline && (
            <p className="text-sm opacity-70">
              {formatDeadline(todo.deadline)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`badge ${
            todo.priority === 'high' ? 'badge-error' :
            todo.priority === 'medium' ? 'badge-warning' :
            'badge-info'
          }`}>
            {todo.priority}
          </span>
          <button
            onClick={() => onDelete(todo.id)}
            className="btn btn-ghost btn-sm"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoItem; 