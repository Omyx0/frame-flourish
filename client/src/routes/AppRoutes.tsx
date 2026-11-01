import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import OpportunitiesPage from "@/pages/OpportunitiesPage";
import OpportunityDetailsPage from "@/pages/OpportunityDetailsPage";
import ApplicationSuccessPage from "@/pages/ApplicationSuccessPage";
import DomainsPage from "@/pages/DomainsPage";
import SavedPage from "@/pages/SavedPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminLayout from "@/pages/AdminLayout";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminApplicationsPage from "@/pages/AdminApplicationsPage";
import NotFoundPage from "@/pages/NotFoundPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/opportunities" element={<OpportunitiesPage />} />
      <Route path="/opportunities/:id" element={<OpportunityDetailsPage />} />
      <Route path="/application-success" element={<ApplicationSuccessPage />} />
      <Route path="/domains" element={<DomainsPage />} />
      <Route path="/saved" element={<SavedPage />} />
      <Route path="/admin-login" element={<AdminLoginPage />} />

      {/* Protected Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="applications" element={<AdminApplicationsPage />} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
