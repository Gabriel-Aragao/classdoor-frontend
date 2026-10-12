import { useEffect, useState } from 'react';
import { mockDashboardService } from '../../services/mockDashboardService';
import ScorecardOverview from '../catalog/ScorecardOverview';
import RatingHistogram from '../catalog/RatingHistogram';

function SemesterTrendChart({ series }) {
  if (!series || !series.last2Semesters) return null;
  return (
    <div className="card p-3">
      <h5>Evolução Semestral</h5>
      <div className="d-flex gap-3">
        {series.last2Semesters.map(item => (
            <div key={item.semester}>{item.semester}: {item.avg}</div>
        ))}
      </div>
    </div>
  );
}

function ProfessorAnalyticsDashboard({ professorId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    mockDashboardService.getProfessorAnalytics(professorId).then(setData);
  }, [professorId]);

  if (!data) return <div>Carregando dashboard...</div>;

  return (
    <div className="dashboard-container">
      <h2>Dashboard Analítico</h2>
      <ScorecardOverview scorecard={data.scorecard} />
      <div className="row mt-4">
        <div className="col-md-6"><SemesterTrendChart series={data.series} /></div>
        <div className="col-md-6"><RatingHistogram histogram={data.scorecard.starHistogram} /></div>
      </div>
    </div>
  );
}

export default ProfessorAnalyticsDashboard;
