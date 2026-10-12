import { useState } from 'react';
import { mockClassService } from '../../services/mockClassService';

function ProfessorClassesPanel({ professorId }) {
  const [classes] = useState(mockClassService.getClassesByProfessor(professorId));
  
  const semesters = [...new Set(classes.map(c => c.semester))].sort().reverse();

  return (
    <div className="professor-classes-panel">
      <h2>Minhas Turmas</h2>
      {semesters.map(semester => (
        <div key={semester} className="mb-4">
          <h4 className="text-primary">{semester}</h4>
          <table className="table">
            <thead>
              <tr>
                <th>Disciplina</th>
                <th>Código</th>
                <th>Alunos</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {classes.filter(c => c.semester === semester).map(c => (
                <tr key={c.id}>
                  <td>{c.courseName}</td>
                  <td>{c.code}</td>
                  <td>{c.enrolledCount}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary">Gerenciar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default ProfessorClassesPanel;
