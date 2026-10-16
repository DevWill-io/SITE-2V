import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Offset em pixels que compensa a navbar fixa no topo.
const OFFSET_NAVBAR = 100;

export function useScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Sem hash: volta pro topo quando muda de rota
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      return;
    }

    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    if (!el) return;

    // Delay curto pra garantir que a página renderizou
    const timeout = setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const y = rect.top + window.scrollY - OFFSET_NAVBAR;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }, 60);

    return () => clearTimeout(timeout);
  }, [pathname, hash]);
}