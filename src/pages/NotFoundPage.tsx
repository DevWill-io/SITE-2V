// ==========================================
// 🚫 404
// ==========================================

import { Link } from 'react-router-dom';
import { PATHS } from '../routes/paths';
import { useI18n } from '../hooks/useI18n';

export default function NotFoundPage() {
  const { t } = useI18n();

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 20,
      }}
    >
      <h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
      <p style={{ color: 'var(--text-muted)' }}>
        Essa página não existe (ainda).
      </p>
      <Link to={PATHS.HOME} className="btn btn-primary">
        <i className="fa-solid fa-house" /> {t('nav_inicio')}
      </Link>
    </section>
  );
}