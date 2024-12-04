// FilterControls component allows users to filter todos by status and priority
// It takes an onFilterChange callback function as a prop to update filters in the parent component
function FilterControls({ onFilterChange }) {
  return (
    // Container div with flex layout and gap between children
    <div className="flex gap-4">
      {/* Status filter dropdown */}
      <select 
        // Calls onFilterChange with 'status' type and selected value when changed
        onChange={(e) => onFilterChange('status', e.target.value)}
        // Tailwind classes for styling the select dropdown
        className="select select-bordered w-[200px]"
        // Initially shows "all" status
        defaultValue="all"
      >
        <option value="all">Filter by status...</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>

      {/* Priority filter dropdown */}
      <select 
        // Calls onFilterChange with 'priority' type and selected value when changed
        onChange={(e) => onFilterChange('priority', e.target.value)}
        // Tailwind classes for styling the select dropdown
        className="select select-bordered w-[200px]"
        // Initially shows "all" priorities
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