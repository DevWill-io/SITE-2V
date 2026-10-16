// ==========================================
// 🔔 CONTEXTO DE TOAST (notificações rápidas)
// ==========================================
// Antes: função `exibirToast(mensagem, tipo)` solta em login.js que
//        criava divs na mão e injetava no body.
//
// Agora: Provider com fila de toasts, tipagem, e renderização React.
//        Pode ser chamado de qualquer componente com `const { toast } = useToast()`.
//
// ⚠️ Precisa estar ANTES do AuthContext na árvore — Auth usa toast pra erros.
// ==========================================

import {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

// ==========================================
// TIPOS
// ==========================================
export type TipoToast = 'info' | 'sucesso' | 'erro';

export interface Toast {
  id: number;
  mensagem: string;
  tipo: TipoToast;
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (mensagem: string, tipo?: TipoToast) => void;
  remover: (id: number) => void;
}

// ==========================================
// CONTEXT
// ==========================================
export const ToastContext = createContext<ToastContextValue | null>(null);

// ==========================================
// PROVIDER
// ==========================================
interface Props {
  children: ReactNode;
  /** Duração de cada toast em ms. Padrão: 3500. */
  duracaoMs?: number;
}

export function ToastProvider({ children, duracaoMs = 3500 }: Props) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const remover = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (mensagem: string, tipo: TipoToast = 'info') => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, mensagem, tipo }]);
      setTimeout(() => remover(id), duracaoMs);
    },
    [duracaoMs, remover]
  );

  const value = useMemo<ToastContextValue>(
    () => ({ toasts, toast, remover }),
    [toasts, toast, remover]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastRenderer toasts={toasts} onClose={remover} />
    </ToastContext.Provider>
  );
}

// ==========================================
// RENDERIZADOR (fica dentro do provider)
// ==========================================
import { ToastRenderer } from '../components/ui/ToastRenderer';

// ==========================================
// NOTA SOBRE O RENDERER
// ==========================================
// O componente visual <ToastRenderer /> mora em components/ui/.
// O CSS vai no global.css. Assim mantemos o provider leve.