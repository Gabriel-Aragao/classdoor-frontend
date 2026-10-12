import { useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import ScorecardOverview from '../../components/catalog/ScorecardOverview';
import RatingHistogram from '../../components/catalog/RatingHistogram';
import ReviewsList from '../../components/catalog/ReviewsList';
import { useReviews } from '../../hooks/useReviews';

function CourseProfilePage() {
  const { id } = useParams();
  const {
    reviews,
    scorecard,
    isLoading,
    sort,
    setSort,
    toggleUpvote,
  } = useReviews({ courseId: id });

  if (isLoading && !scorecard) return <div className="p-4">Carregando disciplina...</div>;

  return (
    <div className="profile-page">
      <Navbar />
      <main className="container py-4">
        <header className="mb-4">
          <h1>Perfil da Disciplina</h1>
          <p className="text-muted">Disciplina ID: {id}</p>
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
      </main>
    </div>
  );
}

export default CourseProfilePage;
