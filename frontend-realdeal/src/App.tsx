import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { ProvidersProvider } from "./providers/context";
import { ADLayout } from "./layouts/ad-layout";
import { LoginPage } from "./pages/login";
import { Dashboard } from "./pages/dashboard";
import { CaseView } from "./pages/case-view";
import { CaseContacts } from "./pages/case-contacts";
import { SearchPage } from "./pages/search";
import { CompliancePage } from "./pages/compliance";
import { SettingsPage } from "./pages/settings";
import { ReferencePage } from "./pages/reference";
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
              <Route path="/search" element={<SearchPage />} />
              <Route path="/compliance" element={<CompliancePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/reference" element={<ReferencePage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ProvidersProvider>
    </ThemeProvider>
  );
}

export default App;
