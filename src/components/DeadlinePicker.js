function DeadlinePicker({ deadline, onChange, className = '' }) {
  return (
    <input
      type="date"
      value={deadline || ''}
      onChange={(e) => onChange(e.target.value)}
      className={`input input-bordered input-md ${className}`}
    />
  );
}

export default DeadlinePicker; 