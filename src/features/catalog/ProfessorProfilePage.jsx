import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import ScorecardOverview from '../../components/catalog/ScorecardOverview';
import RatingHistogram from '../../components/catalog/RatingHistogram';
import ReviewsList from '../../components/catalog/ReviewsList';
import ReviewModal from '../../components/catalog/ReviewModal';
import { useReviews } from '../../hooks/useReviews';

function ProfessorProfilePage() {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    reviews,
    scorecard,
    classes,
    isLoading,
    sort,
    setSort,
    toggleUpvote,
    refetch
  } = useReviews({ professorId: id });

  if (isLoading && !scorecard) return <div className="p-4">Carregando perfil...</div>;

  return (
    <div className="profile-page">
      <Navbar />
      <main className="container py-4">
        <header className="mb-4 d-flex justify-content-between align-items-center">
          <div>
            <h1>Perfil do Professor</h1>
            <p className="text-muted">Professor ID: {id}</p>
          </div>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            Avaliar Professor
          </button>
        </header>

        {scorecard && (
          <div className="row mb-5">
            <div className="col-lg-8">
              <ScorecardOverview scorecard={scorecard} />
            </div>
            <div className="col-lg-4">
              <RatingHistogram histogram={scorecard.starHistogram} />
            </div>
          </div>
        )}

        <ReviewsList
          reviews={reviews}
          onUpvote={toggleUpvote}
          onSortChange={setSort}
          currentSort={sort}
        />

        {isModalOpen && classes.length > 0 && (
          <ReviewModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            professorId={id}
            classId={classes[0].id} // Simula seleção da primeira turma válida
            onSubmitted={refetch}
          />
        )}
      </main>
    </div>
  );
}

export default ProfessorProfilePage;
