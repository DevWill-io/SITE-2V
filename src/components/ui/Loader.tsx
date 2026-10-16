// ==========================================
// ⏳ LOADER
// ==========================================
// Antes: o #preloader do index.html + spinner do style.css.
// Agora: componente reutilizável, com modo "full screen" ou "inline".
// ==========================================

interface Props {
  /** Se true, ocupa a tela toda (usado no boot do app). */
  fullScreen?: boolean;
  /** Texto opcional abaixo do spinner. */
  texto?: string;
}

export function Loader({ fullScreen = false, texto }: Props) {
  if (fullScreen) {
    return (
      <div className="preloader" role="status" aria-live="polite">
        <div className="spinner" />
        {texto && <p style={{ marginTop: 16, color: 'var(--text-muted)' }}>{texto}</p>}
      </div>
    );
  }

  return (
    <div className="loader-inline" role="status" aria-live="polite">
      <div className="spinner" />
      {texto && <span>{texto}</span>}
    </div>
  );
}