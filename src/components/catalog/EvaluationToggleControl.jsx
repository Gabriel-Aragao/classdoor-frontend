import { useState } from 'react';
import { mockClassService } from '../../services/mockClassService';

function EvaluationToggleControl({ classItem }) {
  const [isOpen, setIsOpen] = useState(classItem.isEvaluationOpen);
  
  const handleToggle = async () => {
    const updated = await mockClassService.toggleEvaluationOpen(classItem.id, !isOpen);
    setIsOpen(updated.isEvaluationOpen);
  };

  return (
    <div className="form-check form-switch card p-3">
      <input className="form-check-input" type="checkbox" checked={isOpen} onChange={handleToggle} />
      <label className="form-check-label">
        {isOpen ? 'Avaliações Abertas' : 'Avaliações Fechadas'}
      </label>
      {classItem.enrolledCount < 5 && <p className="text-warning small">Quórum insuficiente ({classItem.enrolledCount}/5).</p>}
    </div>
  );
}

export default EvaluationToggleControl;
