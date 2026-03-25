import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { ProvidersProvider } from "./providers/context";
import { VitalsProvider, VitalsNavigationLogger } from "./vitals";
import { ADLayout } from "./layouts/ad-layout";
import { LoginPage } from "./pages/login";
import { SignupPage } from "./pages/signup";
import { Dashboard } from "./pages/dashboard";
import { CaseView } from "./pages/case-view";
import { CaseContacts } from "./pages/case-contacts";
import { SearchPage } from "./pages/search";
import { CompliancePage } from "./pages/compliance";
import { SettingsPage } from "./pages/settings";
import { ReferencePage } from "./pages/reference";
import { AuthGuard } from "./components/auth-guard";
import { useDevMode } from "./hooks/useDevMode";

// Mock contract info for demoLand vitals monitoring
const DEMO_CONTRACTS = [
  { id: 'discovery-core', name: 'Case Management', address: '0xa7f3e1b2c4d5f6' },
  { id: 'document-registry', name: 'Document Registry', address: '0x8b2cd9e4f7a1b3' },
  { id: 'compliance-proof', name: 'Compliance Proofs', address: '0x3d9ef2a5b8c7d1' },
  { id: 'jurisdiction-registry', name: 'Jurisdiction Rules', address: '0x5f1ac8d3e6b9f2' },
  { id: 'access-control', name: 'Access Control', address: '0xd8f0a2c4e6b789' },
  { id: 'expert-witness', name: 'Expert Witnesses', address: '0xe1a3c5d7f9b012' },
];

function AppRoutes() {
  const isDevMode = useDevMode();
  return (
    <>
      {isDevMode && <VitalsNavigationLogger />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
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
    </>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ad-ui-theme">
      <ProvidersProvider>
        <VitalsProvider mode="mock" contracts={DEMO_CONTRACTS}>
          <BrowserRouter basename="/">
            <AppRoutes />
          </BrowserRouter>
        </VitalsProvider>
      </ProvidersProvider>
    </ThemeProvider>
  );
}

export default App;
