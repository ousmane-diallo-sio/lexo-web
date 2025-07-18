import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { UsersPage } from './pages/users/UsersPage';
import { PrivacyPage } from './pages/privacy/PrivacyPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import { EntityPage } from './pages/EntityPage';
import { Toaster } from './components/ui/sonner';

// Entity configs
import { userEntityConfig } from './config/entities/users';
import { childUserEntityConfig } from './config/entities/childUsers';
import { letterExerciseEntityConfig } from './config/entities/letterExercises';
import { animalExerciseEntityConfig } from './config/entities/animalExercises';
import { numberExerciseEntityConfig } from './config/entities/numberExercises';
import { colorExerciseEntityConfig } from './config/entities/colorExercises';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Toaster />
          <Routes>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Navigate to="/dashboard" replace />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <DashboardPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <UsersPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/entities/users"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <EntityPage config={userEntityConfig} />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/entities/child-users"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <EntityPage config={childUserEntityConfig} />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/entities/letter-exercises"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <EntityPage config={letterExerciseEntityConfig} />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/entities/animal-exercises"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <EntityPage config={animalExerciseEntityConfig} />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/entities/number-exercises"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <EntityPage config={numberExerciseEntityConfig} />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/entities/color-exercises"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <EntityPage config={colorExerciseEntityConfig} />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
