function SortControls({ onSortChange }) {
  return (
    <select 
      onChange={(e) => onSortChange(e.target.value)}
      className="select select-bordered w-[200px]"
      defaultValue=""
    >
      <option value="">Sort by...</option>
      <option value="priority">Priority</option>
      <option value="deadline">Deadline</option>
      <option value="created">Created Date</option>
    </select>
  );
}

export default SortControls; 