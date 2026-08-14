import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { LoginForm } from './components/auth/LoginForm';
import { SignUpForm } from './components/auth/SignUpForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DashboardView } from './components/dashboard/DashboardView';
import { ToastNotification } from './components/common/ToastNotification';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProjectProvider>
          <BrowserRouter>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignUpForm />} />

              {/* Protected Dashboard Route */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardView />
                  </ProtectedRoute>
                }
              />

              {/* Default Redirect */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            <ToastNotification />
          </BrowserRouter>
        </ProjectProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
