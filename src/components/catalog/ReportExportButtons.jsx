import { mockDashboardService } from '../../services/mockDashboardService';

function ReportExportButtons({ professorId }) {
  const handleExport = async (format) => {
    const res = await mockDashboardService.exportReport(professorId, format);
    // Simula download
    const link = document.createElement('a');
    link.href = res.dataUrl;
    link.download = res.filename;
    link.click();
  };

  return (
    <div className="btn-group">
      <button className="btn btn-outline-secondary" onClick={() => handleExport('CSV')}>Exportar CSV</button>
      <button className="btn btn-outline-danger" onClick={() => handleExport('PDF')}>Exportar PDF</button>
    </div>
  );
}

export default ReportExportButtons;
