import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { ProvidersProvider } from "./providers/context";
import { ADLayout } from "./layouts/ad-layout";
import { LoginPage } from "./pages/login";
import { Dashboard } from "./pages/dashboard";
import { CaseView } from "./pages/case-view";
import { CaseContacts } from "./pages/case-contacts";
import { AuthGuard } from "./components/auth-guard";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ad-ui-theme">
      <ProvidersProvider>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<AuthGuard><ADLayout /></AuthGuard>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/cases" element={<Dashboard />} />
              <Route path="/cases/:caseId" element={<CaseView />} />
              <Route path="/cases/:caseId/contacts" element={<CaseContacts />} />
              <Route path="/search" element={<PlaceholderPage title="Search" desc="Global document search across all cases — coming soon" />} />
              <Route path="/compliance" element={<PlaceholderPage title="Reports" desc="Compliance reports and export — coming soon" />} />
              <Route path="/settings" element={<PlaceholderPage title="Settings" desc="User preferences, auth method, notifications — coming soon" />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ProvidersProvider>
    </ThemeProvider>
  );
}

function PlaceholderPage({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground text-sm max-w-md">{desc}</p>
    </div>
  );
}

export default App;
