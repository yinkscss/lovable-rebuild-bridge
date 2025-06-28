import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import HomePage from './pages/HomePage';
import ApplyPage from './pages/ApplyPage';
import AboutUsPage from './pages/AboutUsPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ResourcesPage from './pages/ResourcesPage';
import ClientStoriesPage from './pages/ClientStoriesPage';
import BlogPage from './pages/BlogPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ApplicationsPage from './pages/admin/ApplicationsPage';
import AdminAccountDetailsPage from './pages/admin/AdminAccountDetailsPage';
import PaymentsPage from './pages/admin/PaymentsPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AuthPage from './pages/AuthPage';
import { useAuth } from './lib/auth';
import { Toaster } from 'react-hot-toast';
import NotFoundPage from './pages/NotFoundPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/admin/auth" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/apply/success" element={
            <PrivateRoute>
              <Navigate to="/dashboard" replace />
            </PrivateRoute>
          } />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/resources/:category" element={<ResourcesPage />} />
          <Route path="/client-stories" element={<ClientStoriesPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin/auth" element={<AuthPage />} />
          <Route path="/auth/callback" element={<Navigate to="/dashboard" replace />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          
          {/* Protected routes */}
          <Route path="/account" element={
            <PrivateRoute>
              <Navigate to="/dashboard" replace />
            </PrivateRoute>
          } />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <UserDashboardPage />
            </PrivateRoute>
          } />
          
          {/* Admin routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="account-details" element={<AdminAccountDetailsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;