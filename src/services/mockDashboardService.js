/**
 * Dashboard Service — Classdoor
 * Integrado à API real (/api/analytics) com fallback para testes.
 */

import { simulateDelay } from './mockProfessorService.js';
import { mockReviewService } from './mockReviewService.js';
import { apiCall } from './api.js';

const isTestEnv = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';

export const mockDashboardService = {
  async getProfessorAnalytics(professorId) {
    if (!isTestEnv) {
      try {
        return await apiCall(`/api/professors/${professorId}/analytics`);
      } catch {
        // fallback
      }
    }

    await simulateDelay(300);
    const reviews = mockReviewService.getAllReviews().filter(r => r.professorId === professorId);
    const scorecard = mockReviewService.calculateScorecard(reviews);
    
    return {
      scorecard,
      series: {
        last2Semesters: [
          { semester: '2025.2', avg: 4.6 },
          { semester: '2026.1', avg: 4.8 }
        ]
      }
    };
  },

  async exportReport(professorId, format) {
    if (!isTestEnv) {
      try {
        const response = await apiCall(`/api/professors/${professorId}/export?format=${format}`);
        return response;
      } catch {
        // fallback
      }
    }

    await simulateDelay(500);
    const data = await this.getProfessorAnalytics(professorId);
    const filename = `relatorio_docente_${professorId}.${format.toLowerCase()}`;
    
    return {
      filename,
      dataUrl: `data:text/${format};base64,${btoa(JSON.stringify(data))}`
    };
  }
};
