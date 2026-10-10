function CatalogSkeleton({ count = 6 }) {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="catalog-grid-row" aria-busy="true" aria-label="Carregando catálogo">
      {items.map((index) => (
        <div key={index} className="catalog-grid-col">
          <div className="catalog-card skeleton-card placeholder-glow">
            <div className="skeleton-header">
              <div className="placeholder skeleton-avatar rounded-circle" />
              <div className="skeleton-header-text">
                <span className="placeholder col-4 skeleton-line-sm mb-1" />
                <span className="placeholder col-8 skeleton-line-lg mb-1" />
                <span className="placeholder col-6 skeleton-line-sm" />
              </div>
            </div>

            <div className="skeleton-metrics">
              <span className="placeholder col-5 skeleton-line-md mb-2" />
              <span className="placeholder col-12 skeleton-line-sm" />
            </div>

            <div className="skeleton-body">
              <span className="placeholder col-11 skeleton-line-sm mb-1" />
              <span className="placeholder col-8 skeleton-line-sm" />
            </div>

            <div className="skeleton-footer">
              <span className="placeholder col-12 skeleton-button" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CatalogSkeleton;
