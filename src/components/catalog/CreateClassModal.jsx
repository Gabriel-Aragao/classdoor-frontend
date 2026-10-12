import { useState } from 'react';
import { mockClassService } from '../../services/mockClassService';

function CreateClassModal({ isOpen, onClose, onCreated }) {
  const [courseName, setCourseName] = useState('');
  const [code, setCode] = useState('');
  const [semester, setSemester] = useState('2026.2');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await mockClassService.createClass({ 
        courseId: `crs-${Date.now()}`, 
        newCourseData: { name: courseName }, 
        semester, 
        code 
    });
    onCreated();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Nova Turma</h3>
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" placeholder="Nome da Disciplina" value={courseName} onChange={e => setCourseName(e.target.value)} required />
          <input className="form-control mb-2" placeholder="Código (ex: CC101)" value={code} onChange={e => setCode(e.target.value)} required />
          <button type="submit" className="btn btn-primary">Criar</button>
        </form>
      </div>
    </div>
  );
}

export default CreateClassModal;
