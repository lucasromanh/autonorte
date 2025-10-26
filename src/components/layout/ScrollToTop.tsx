import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // For accessibility/UX, instant scroll to top on route change
    window.scrollTo({ top: 0, left: 0 });
    // also reset focused element to body to avoid focus staying on elements that might be off-screen
    (document.activeElement as HTMLElement | null)?.blur();
  }, [pathname]);

  return null;
};

export default ScrollToTop;
