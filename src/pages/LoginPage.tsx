import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';
import { PATHS } from '../routes/paths';

export default function LoginPage() {
  const { status, entrar, urlLogin } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'logado') {
      navigate(PATHS.PAINEL_NOTAS, { replace: true });
    }
  }, [status, navigate]);

  return (
    <main className="login-main">
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-card-title">{t('portal_suap')}</h1>
          <p className="login-card-subtitle">{t('area_auth')}</p>

          <div className="login-prompt">
            <p>{t('acesse_credenciais')}</p>

            <a
              href={urlLogin}
              className="button is-success is-large"
              onClick={(e) => {
                e.preventDefault();
                entrar();
              }}
            >
              <i className="fa-solid fa-right-to-bracket" />
              <span>{t('login_suap')}</span>
            </a>

            <Link
              to={PATHS.HOME}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 20,
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                transition: 'color 0.2s ease',
              }}
            >
              <i className="fa-solid fa-arrow-left" />
              {t('voltar')}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}