function TimeSlot({ time, isSelected, onSelect }) {
  return (
    <button
      className={`time-slot ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(time)}
    >
      {time}
    </button>
  );
}

export default TimeSlot;