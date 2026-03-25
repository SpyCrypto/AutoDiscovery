import { useState, useEffect } from 'react';

const DEV_MODE_SESSION_KEY = 'ad-dev-mode';

/**
 * Returns true when developer mode is active.
 *
 * Dev mode can be activated in two ways:
 *  1. URL query parameter: `?dev=true`
 *  2. Keyboard shortcut: Ctrl+Shift+D / Cmd+Shift+D (toggles; persisted for the session)
 *
 * The URL param takes precedence on initial load. The keyboard shortcut
 * state is stored in sessionStorage so it survives in-app navigation.
 */
export function useDevMode(): boolean {
  const getInitialDevMode = (): boolean => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('dev') === 'true') return true;
    return sessionStorage.getItem(DEV_MODE_SESSION_KEY) === 'true';
  };

  const [isDevMode, setIsDevMode] = useState<boolean>(getInitialDevMode);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsDevMode((prev) => {
          const next = !prev;
          if (next) {
            sessionStorage.setItem(DEV_MODE_SESSION_KEY, 'true');
          } else {
            sessionStorage.removeItem(DEV_MODE_SESSION_KEY);
          }
          return next;
        });
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return isDevMode;
}
