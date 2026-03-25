// =============================================================================
// MidnightVitals — Navigation Logger
// =============================================================================
// Automatically logs every route change in the app.
// Place this inside both <BrowserRouter> and <VitalsProvider>.
// It watches React Router's location and logs each navigation event
// with a human-readable description of where the user went.
// =============================================================================

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useVitalsLogger } from '../context';


/**
 * Maps route paths to human-readable page descriptions.
 * Handles both exact paths and parameterized routes.
 */
function describeRoute(pathname: string): string {
  // Exact matches first
  const exactRoutes: Record<string, string> = {
    '/': 'the Dashboard — your overview of all active cases and compliance status.',
    '/login': 'the Login page.',
    '/cases': 'the Cases list — all your active discovery matters.',
    '/search': 'the Search page — full-text and metadata search across all documents.',
    '/compliance': 'the Compliance Reports page — compliance record history and audit trail.',
    '/settings': 'the Settings page — account preferences and configuration.',
    '/reference': 'the Jurisdiction Reference — discovery rules by jurisdiction.',
  };

  if (exactRoutes[pathname]) {
    return exactRoutes[pathname];
  }

  // Parameterized routes
  const caseContactsMatch = pathname.match(/^\/cases\/([^/]+)\/contacts$/);
  if (caseContactsMatch) {
    return `the Contacts page for case "${caseContactsMatch[1]}".`;
  }

  const caseViewMatch = pathname.match(/^\/cases\/([^/]+)$/);
  if (caseViewMatch) {
    return `case "${caseViewMatch[1]}" — viewing case details, discovery steps, and documents.`;
  }

  return `"${pathname}".`;
}


export function VitalsNavigationLogger() {
  const location = useLocation();
  const vitals = useVitalsLogger();
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    // Skip logging the very first render (that's handled by page-level logging)
    if (previousPathRef.current === null) {
      previousPathRef.current = location.pathname;
      return;
    }

    // Skip if the path didn't actually change (e.g., search param only)
    if (previousPathRef.current === location.pathname) {
      return;
    }

    const description = describeRoute(location.pathname);
    vitals.action(`Navigated to ${description}`);
    previousPathRef.current = location.pathname;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // This component renders nothing — it's purely a side-effect hook
  return null;
}
