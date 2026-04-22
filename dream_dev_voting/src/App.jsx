import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import { ElectionProvider } from './context/ElectionContext';
import { VotingProvider } from './context/VotingContext';

import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import AdminGuard from './components/guards/AdminGuard';

import LandingPage from './pages/LandingPage';
import VoterRegistrationPage from './pages/VoterRegistrationPage';
import VotingPortalPage from './pages/VotingPortalPage';
import VoteConfirmationPage from './pages/VoteConfirmationPage';
import PublicResultsPage from './pages/PublicResultsPage';

import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminElectionsPage from './pages/admin/AdminElectionsPage';
import AdminCandidatesPage from './pages/admin/AdminCandidatesPage';
import AdminVotersPage from './pages/admin/AdminVotersPage';
import AdminElectoratesPage from './pages/admin/AdminElectoratesPage';
import AdminPermissionsPage from './pages/admin/AdminPermissionsPage';
import AdminVotesPage from './pages/admin/AdminVotesPage';

export default function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <ElectionProvider>
          <VotingProvider>
            <Routes>
              <Route element={<Layout />}>
                {/* Public */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<VoterRegistrationPage />} />
                <Route path="/vote" element={<VotingPortalPage />} />
                <Route path="/vote/confirm" element={<VoteConfirmationPage />} />
                <Route path="/results" element={<PublicResultsPage />} />

                {/* Admin login — no sidebar */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* Admin protected — with sidebar */}
                <Route element={<AdminGuard />}>
                  <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<AdminDashboardPage />} />
                    <Route path="/admin/elections" element={<AdminElectionsPage />} />
                    <Route path="/admin/candidates" element={<AdminCandidatesPage />} />
                    <Route path="/admin/voters" element={<AdminVotersPage />} />
                    <Route path="/admin/electorates" element={<AdminElectoratesPage />} />
                    <Route path="/admin/permissions" element={<AdminPermissionsPage />} />
                    <Route path="/admin/votes" element={<AdminVotesPage />} />
                  </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </VotingProvider>
        </ElectionProvider>
      </AdminProvider>
    </BrowserRouter>
  );
}
