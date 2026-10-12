import { useState } from 'react';
import { mockClassService } from '../../services/mockClassService';

function BulkStudentImport({ classId, currentCount }) {
  const [emails, setEmails] = useState('');
  const [error, setError] = useState(null);

  const handleImport = async () => {
    try {
      const emailList = emails.split(',').map(e => e.trim());
      await mockClassService.addStudentsBulk(classId, emailList);
      setEmails('');
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="card p-3">
      <h5>Matricular Alunos (Lote)</h5>
      {error && <p className="text-danger">{error}</p>}
      <textarea className="form-control mb-2" value={emails} onChange={e => setEmails(e.target.value)} placeholder="email1@exemplo.com, email2@exemplo.com" />
      <button className="btn btn-secondary" onClick={handleImport}>Importar</button>
      <p className="mt-2 text-muted">Total atual: {currentCount} alunos.</p>
    </div>
  );
}

export default BulkStudentImport;
