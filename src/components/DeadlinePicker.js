function DeadlinePicker({ deadline, onChange, className = '' }) {
  // Convert the deadline to local timezone for display
  const localDeadline = deadline ? new Date(deadline).toISOString().slice(0, 16) : '';

  return (
    <input
      type="datetime-local"
      value={localDeadline}
      onChange={(e) => {
        // Convert local time to UTC when saving
        const date = new Date(e.target.value);
        onChange(date.toISOString());
      }}
      className={`input input-bordered input-md ${className}`}
    />
  );
}

export default DeadlinePicker; 