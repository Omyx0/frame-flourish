import { useLocation } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { SavedProvider } from "@/context/SavedContext";
import { SiteHeader, SiteFooter, DesktopPreviewToggle } from "@/components/brand";
import { MobileTabBar, PageTransition } from "@/components/mobile";
import { Toaster } from "@/components/ui/sonner";
import AppRoutes from "@/routes/AppRoutes";

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <SiteHeader />
        <main className="pb-20 md:pb-0">
          <PageTransition>
            <AppRoutes />
          </PageTransition>
        </main>
      </div>

      {!isAdmin && <SiteFooter />}
      <MobileTabBar />
      <DesktopPreviewToggle />
      <Toaster position="bottom-right" richColors />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <SavedProvider>
        <AppContent />
      </SavedProvider>
    </AuthProvider>
  );
}

export default App;
