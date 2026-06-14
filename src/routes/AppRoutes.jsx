import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../layouts/DashboardLayout';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

// App Pages
import DashboardPage from '../pages/dashboard/DashboardPage';
import CustomersPage from '../pages/customers/CustomersPage';
import SegmentsPage from '../pages/segments/SegmentsPage';
import AISegmentBuilderPage from '../pages/segments/AISegmentBuilderPage';
import CampaignsPage from '../pages/campaigns/CampaignsPage';
import CreateCampaignPage from '../pages/campaigns/CreateCampaignPage';
import AICampaignAssistantPage from '../pages/campaigns/AICampaignAssistantPage';
import CampaignMonitoringPage from '../pages/campaigns/CampaignMonitoringPage';
import CommunicationTimelinePage from '../pages/campaigns/CommunicationTimelinePage';
import AnalyticsPage from '../pages/analytics/AnalyticsPage';
import SettingsPage from '../pages/settings/SettingsPage';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="segments" element={<SegmentsPage />} />
        <Route path="segments/ai-builder" element={<AISegmentBuilderPage />} />
        <Route path="campaigns" element={<CampaignsPage />} />
        <Route path="campaigns/create" element={<CreateCampaignPage />} />
        <Route path="campaigns/ai-assistant" element={<AICampaignAssistantPage />} />
        <Route path="campaigns/:id/monitoring" element={<CampaignMonitoringPage />} />
        <Route path="campaigns/:id/timeline" element={<CommunicationTimelinePage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
