import ProfessorCard from './ProfessorCard';
import CourseCard from './CourseCard';
import EmptyState from './EmptyState';
import CatalogSkeleton from './CatalogSkeleton';

function CatalogGrid({
  professors = [],
  courses = [],
  type = 'ALL',
  isLoading = false,
  onResetFilters,
  onSelectProfessor,
  onSelectCourse,
}) {
  if (isLoading) {
    return <CatalogSkeleton count={6} />;
  }

  const showProfessors = type === 'ALL' || type === 'PROFESSORS';
  const showCourses = type === 'ALL' || type === 'COURSES';

  const totalCount =
    (showProfessors ? professors.length : 0) + (showCourses ? courses.length : 0);

  if (totalCount === 0) {
    return (
      <EmptyState
        title="Nenhum resultado encontrado"
        description="Não encontramos nenhum professor ou disciplina correspondente aos filtros e termos de busca aplicados."
        onReset={onResetFilters}
      />
    );
  }

  return (
    <div className="catalog-grid-wrapper">
      {/* Seção de Professores */}
      {showProfessors && professors.length > 0 && (
        <section className="catalog-group" aria-label="Professores Encontrados">
          {type === 'ALL' && (
            <div className="catalog-group-header">
              <h2 className="catalog-group-title">
                <i className="bi bi-person-fill text-primary" aria-hidden="true" />
                <span>Professores ({professors.length})</span>
              </h2>
            </div>
          )}

          <div className="catalog-grid-row">
            {professors.map((professor) => (
              <div key={professor.id} className="catalog-grid-col">
                <ProfessorCard
                  professor={professor}
                  onSelect={onSelectProfessor}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Seção de Disciplinas */}
      {showCourses && courses.length > 0 && (
        <section className="catalog-group" aria-label="Disciplinas Encontradas">
          {type === 'ALL' && (
            <div className="catalog-group-header">
              <h2 className="catalog-group-title">
                <i className="bi bi-journal-text text-primary" aria-hidden="true" />
                <span>Disciplinas ({courses.length})</span>
              </h2>
            </div>
          )}

          <div className="catalog-grid-row">
            {courses.map((course) => (
              <div key={course.id} className="catalog-grid-col">
                <CourseCard
                  course={course}
                  onSelect={onSelectCourse}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default CatalogGrid;
