function AnonymityToggle({ isAnonymous, onChange }) {
  return (
    <div className="form-check form-switch card p-3 bg-light">
      <input
        className="form-check-input"
        type="checkbox"
        id="anonymitySwitch"
        checked={isAnonymous}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label className="form-check-label fw-bold" htmlFor="anonymitySwitch">
        {isAnonymous ? '🛡️ 100% Anônimo' : '👤 Avaliação Nominal'}
      </label>
      <small className="text-muted d-block mt-1">
        {isAnonymous
          ? 'Sua identidade será protegida permanentemente.'
          : 'Seu nome será exibido publicamente na avaliação.'}
      </small>
    </div>
  );
}

export default AnonymityToggle;
