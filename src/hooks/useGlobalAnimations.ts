import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useGlobalAnimations() {
  const location = useLocation();

  useEffect(() => {
    // Reveal on scroll
    const reveals = document.querySelectorAll('.reveal:not(.active)');
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    reveals.forEach((el) => revealObserver.observe(el));

    // Tilt em desktop
    const cleanups: (() => void)[] = [];
    const isDesktop = window.matchMedia('(min-width: 850px)').matches;

    if (isDesktop) {
      document.querySelectorAll('.tilt-element').forEach((card) => {
        const c = card as HTMLElement;
        if (c.dataset.tiltBound) return;
        c.dataset.tiltBound = '1';

        const onMove = (e: MouseEvent) => {
          const rect = c.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const cx = rect.width / 2;
          const cy = rect.height / 2;
          const rx = ((y - cy) / cy) * -8;
          const ry = ((x - cx) / cx) * 8;
          c.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03, 1.03, 1.03)`;
        };
        const onLeave = () => {
          c.style.transform =
            'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
          c.style.transition = 'transform 0.5s ease';
        };
        const onEnter = () => {
          c.style.transition = 'none';
        };

        c.addEventListener('mousemove', onMove);
        c.addEventListener('mouseleave', onLeave);
        c.addEventListener('mouseenter', onEnter);

        cleanups.push(() => {
          c.removeEventListener('mousemove', onMove);
          c.removeEventListener('mouseleave', onLeave);
          c.removeEventListener('mouseenter', onEnter);
        });
      });
    }

    return () => {
      revealObserver.disconnect();
      cleanups.forEach((fn) => fn());
    };
  }, [location.pathname]);
}