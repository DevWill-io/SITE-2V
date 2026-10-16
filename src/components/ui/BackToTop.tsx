import { useEffect, useState } from 'react';
import { useI18n } from '../../hooks/useI18n';

export function BackToTop() {
  const { t } = useI18n();
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisivel(window.scrollY > 400);
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const voltarAoTopo = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={voltarAoTopo}
      className={`back-to-top ${visivel ? 'show' : ''}`}
      aria-label={t('voltar_topo')}
      title={t('voltar_topo')}
    >
      <i className="fa-solid fa-arrow-up" />
    </button>
  );
}