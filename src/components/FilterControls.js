// FilterControls component allows users to filter todos by status and priority
// It takes an onFilterChange callback function as a prop to update filters in the parent component
function FilterControls({ onFilterChange }) {
  return (
    <div className="flex gap-2">
      <select 
        onChange={(e) => onFilterChange('status', e.target.value)}
        className="select select-bordered select-md w-[150px]"
        defaultValue="all"
      >
        <option value="all">Status...</option>
        <option value="pending">Pending</option>
        <option value="completed">Done</option>
      </select>

      <select 
        onChange={(e) => onFilterChange('priority', e.target.value)}
        className="select select-bordered select-md w-[150px]"
        defaultValue="all"
      >
        <option value="all">Priority...</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </div>
  );
}

export default FilterControls;