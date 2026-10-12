import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage';
import ProfessorProfilePage from '../features/catalog/ProfessorProfilePage';
import CourseProfilePage from '../features/catalog/CourseProfilePage';
import HomePage from '../features/auth/HomePage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/professores/:id"
        element={
          <ProtectedRoute>
            <ProfessorProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/disciplinas/:id"
        element={
          <ProtectedRoute>
            <CourseProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
