function FilterControls({ onFilterChange }) {
  return (
    <div className="flex gap-4">
      <select 
        onChange={(e) => onFilterChange('status', e.target.value)}
        className="select select-bordered w-[200px]"
        defaultValue="all"
      >
        <option value="all">Filter by status...</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>

      <select 
        onChange={(e) => onFilterChange('priority', e.target.value)}
        className="select select-bordered w-[200px]"
        defaultValue="all"
      >
        <option value="all">Filter by priority...</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </div>
  );
}

export default FilterControls;