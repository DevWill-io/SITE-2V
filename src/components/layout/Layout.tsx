import { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { MenuLateral } from './MenuLateral';
import { Footer } from './Footer';
import { BackToTop } from '../ui/BackToTop';
import { useGlobalAnimations } from '../../hooks/useGlobalAnimations';
import { useScrollToHash } from '../../hooks/useScrollToHash';

export function Layout() {
  const [menuAberto, setMenuAberto] = useState(false);
  const progressoRef = useRef<HTMLDivElement>(null);

  useGlobalAnimations();
  useScrollToHash();

  useEffect(() => {
    let ticking = false;
    function atualizar() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollable =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const progresso = scrollable > 0 ? scrolled / scrollable : 0;
        if (progressoRef.current) {
          progressoRef.current.style.transform = `scaleX(${progresso})`;
        }
        ticking = false;
      });
    }
    window.addEventListener('scroll', atualizar, { passive: true });
    return () => window.removeEventListener('scroll', atualizar);
  }, []);

  return (
    <>
      <div id="scroll-progress" ref={progressoRef} />
      <div className="bg-glow" />

      <Navbar onAbrirMenu={() => setMenuAberto(true)} />

      <MenuLateral
        aberto={menuAberto}
        onFechar={() => setMenuAberto(false)}
      />

      <Outlet />

      <Footer />
      <BackToTop />
    </>
  );
}