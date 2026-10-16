import { useEffect, type ReactNode } from 'react';

interface Props {
  aberto: boolean;
  onFechar: () => void;
  children: ReactNode;
  classNameConteudo?: string;
  bloqueado?: boolean;
}

export function Modal({
  aberto,
  onFechar,
  children,
  classNameConteudo = '',
  bloqueado = false,
}: Props) {
  useEffect(() => {
    if (!aberto || bloqueado) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [aberto, bloqueado, onFechar]);

  useEffect(() => {
    if (aberto) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [aberto]);

  if (!aberto) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (!bloqueado && e.target === e.currentTarget) onFechar();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`modal-content ${classNameConteudo}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onFechar}
          aria-label="Fechar"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}