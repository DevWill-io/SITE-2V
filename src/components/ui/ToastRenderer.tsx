// ==========================================
// 🔔 RENDERIZADOR DE TOASTS
// ==========================================
// Antes: exibirToast() criava <div> na mão e injetava no body.
// Agora: componente React puro. Estilos vêm do global.css.
// ==========================================

import type { Toast, TipoToast } from '../../contexts/ToastContext';

interface Props {
  toasts: Toast[];
  onClose: (id: number) => void;
}

const CORES: Record<TipoToast, string> = {
  info: '#2f3542',
  sucesso: '#2ed573',
  erro: '#ff4757',
};

export function ToastRenderer({ toasts, onClose }: Props) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          className="toast-item"
          style={{ backgroundColor: CORES[t.tipo] }}
          onClick={() => onClose(t.id)}
        >
          {t.mensagem}
        </button>
      ))}
    </div>
  );
}