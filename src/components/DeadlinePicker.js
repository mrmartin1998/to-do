function DeadlinePicker({ deadline, onChange }) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        min={today}
        value={deadline || ''}
        onChange={(e) => onChange(e.target.value)}
        className="input input-bordered"
      />
      {deadline && (
        <button
          onClick={() => onChange(null)}
          className="btn btn-ghost btn-sm"
          type="button"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default DeadlinePicker; 