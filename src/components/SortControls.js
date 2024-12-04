function SortControls({ onSortChange }) {
  return (
    <select 
      onChange={(e) => onSortChange(e.target.value)}
      className="select select-bordered select-md w-[150px]"
      defaultValue=""
    >
      <option value="">Sort...</option>
      <option value="priority">Priority</option>
      <option value="deadline">Deadline</option>
      <option value="created">Created</option>
    </select>
  );
}

export default SortControls; 