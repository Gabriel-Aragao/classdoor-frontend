function EmptyState({
  title = 'Nenhum resultado encontrado',
  description = 'Não encontramos professores ou disciplinas correspondentes aos filtros selecionados.',
  onReset,
  resetLabel = 'Limpar Filtros & Busca',
}) {
  return (
    <div className="empty-state-container" role="status" aria-live="polite">
      <div className="empty-state-icon-wrapper">
        <i className="bi bi-search empty-state-icon" aria-hidden="true" />
      </div>

      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>

      {onReset && (
        <button
          type="button"
          className="empty-state-button"
          onClick={onReset}
        >
          <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />
          <span>{resetLabel}</span>
        </button>
      )}
    </div>
  );
}

export default EmptyState;
