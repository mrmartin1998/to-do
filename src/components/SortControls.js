function SortControls({ onSortChange }) {
  return (
    <div className="flex gap-2 mb-4">
      <select 
        onChange={(e) => onSortChange(e.target.value)}
        className="select select-bordered select-sm"
        defaultValue=""
      >
        <option value="">Sort by...</option>
        <option value="priority">Priority</option>
        <option value="deadline">Deadline</option>
        <option value="created">Created Date</option>
      </select>
    </div>
  );
}

export default SortControls; 