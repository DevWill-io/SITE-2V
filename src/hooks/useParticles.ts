import { useEffect, useRef } from 'react';

export function useParticles(countDesktop = 15, countMobile = 8) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile && countMobile === 0) return;

    const total = isMobile ? countMobile : countDesktop;
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < total; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 4 + 2;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}vw`;
      p.style.top = `${Math.random() * 100 + 20}vh`;
      p.style.animationDuration = `${Math.random() * 15 + 10}s`;
      p.style.animationDelay = `${Math.random() * 5}s`;
      p.style.willChange = 'transform';
      container.appendChild(p);
      particles.push(p);
    }

    return () => {
      particles.forEach((p) => p.remove());
    };
  }, [countDesktop, countMobile]);

  return ref;
}