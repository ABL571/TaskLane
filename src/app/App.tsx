import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './layout/AppShell';
import { AuthProvider } from '../features/auth/context/AuthProvider';
import { ProtectedRoute } from './ProtectedRoute';
import { BoardPage } from '../features/tasks/pages/BoardPage';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { SettingsPage } from '../features/settings/pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/dashboard" element={<BoardPage />} />
              <Route path="/my-tasks" element={<BoardPage mine />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
