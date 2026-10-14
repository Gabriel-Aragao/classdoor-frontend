/**
 * Class Service — Classdoor
 * Integrado à API real (/api/classes) com fallback para testes.
 */

import { simulateDelay } from './mockProfessorService.js';
import { apiCall } from './api.js';

const STORAGE_KEY_CLASSES = 'classdoor_mock_classes';
const STORAGE_KEY_REVIEWS = 'classdoor_mock_reviews';
const isTestEnv = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';

export const mockClassService = {
  getAllClasses() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CLASSES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  async getClassesByProfessor(professorId) {
    if (!isTestEnv) {
      try {
        return await apiCall(`/api/professors/${professorId}/classes`);
      } catch {
        // fallback
      }
    }
    const classes = this.getAllClasses();
    return classes.filter(c => c.professorId === professorId);
  },

  async createClass({ courseId, newCourseData, semester, code, initialEmails = [] }) {
    if (!isTestEnv) {
      try {
        return await apiCall('/api/classes', {
          method: 'POST',
          body: JSON.stringify({ courseId, newCourseData, semester, code, initialEmails }),
        });
      } catch (err) {
        throw new Error(err.message || 'Erro ao criar turma na API.');
      }
    }

    await simulateDelay(150);
    const classes = this.getAllClasses();
    const newClass = {
      id: `cls-${Date.now()}`,
      courseId,
      courseName: newCourseData?.name || 'Disciplina não identificada',
      semester,
      code,
      enrolledStudents: [...new Set(initialEmails)],
      enrolledCount: [...new Set(initialEmails)].length,
      isEvaluationOpen: true,
      reviewsCount: 0
    };
    classes.push(newClass);
    localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(classes));
    return newClass;
  },

  async addStudentsBulk(classId, emailsList) {
    if (!isTestEnv) {
      try {
        return await apiCall(`/api/classes/${classId}/students`, {
          method: 'POST',
          body: JSON.stringify({ emailsList }),
        });
      } catch (err) {
        throw new Error(err.message || 'Erro ao matricular alunos em lote na API.');
      }
    }

    await simulateDelay(200);
    const classes = this.getAllClasses();
    const reviews = JSON.parse(localStorage.getItem(STORAGE_KEY_REVIEWS) || '[]');
    
    const classIdx = classes.findIndex(c => c.id === classId);
    if (classIdx === -1) throw new Error('Turma não encontrada.');

    const classReviews = reviews.filter(r => r.classId === classId);
    if (classReviews.length > 0) {
      throw new Error('Não é possível adicionar alunos: a turma já possui avaliações registradas.');
    }

    const targetClass = classes[classIdx];
    const newEmails = new Set([...targetClass.enrolledStudents, ...emailsList]);
    targetClass.enrolledStudents = Array.from(newEmails);
    targetClass.enrolledCount = targetClass.enrolledStudents.length;

    localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(classes));
    return targetClass;
  },

  async toggleEvaluationOpen(classId, isOpen) {
    if (!isTestEnv) {
      try {
        return await apiCall(`/api/classes/${classId}/evaluation-status`, {
          method: 'PATCH',
          body: JSON.stringify({ isOpen }),
        });
      } catch (err) {
        throw new Error(err.message || 'Erro ao alternar status de avaliação.');
      }
    }

    await simulateDelay(100);
    const classes = this.getAllClasses();
    const targetClass = classes.find(c => c.id === classId);
    if (!targetClass) throw new Error('Turma não encontrada.');
    
    targetClass.isEvaluationOpen = isOpen;
    localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(classes));
    return targetClass;
  }
};
