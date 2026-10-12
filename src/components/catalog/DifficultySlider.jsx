function DifficultySlider({ value, onChange }) {
  return (
    <div className="difficulty-slider">
      <input
        type="range"
        className="form-range"
        min="1"
        max="5"
        step="0.5"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="d-flex justify-content-between text-muted small">
        <span>Muito Fácil</span>
        <span>Muito Difícil</span>
      </div>
    </div>
  );
}

export default DifficultySlider;
