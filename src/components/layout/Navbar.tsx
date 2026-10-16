import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import { useAuth } from '../../hooks/useAuth';
import { PainelNotificacoes } from '../painel/PainelNotificacoes';
import { PATHS } from '../../routes/paths';

interface Props {
  onAbrirMenu: () => void;
}

export function Navbar({ onAbrirMenu }: Props) {
  const { t } = useI18n();
  const { status } = useAuth();
  const [podeInstalar, setPodeInstalar] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<
    BeforeInstallPromptEvent | null
  >(null);

  const logado = status === 'logado';

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setPodeInstalar(true);
    };

    const onInstalled = () => {
      setDeferredPrompt(null);
      setPodeInstalar(false);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  function instalar() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
    } else {
      alert(
        "Para instalar, use o menu do navegador > 'Adicionar à tela inicial'."
      );
    }
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to={PATHS.HOME} className="logo">
          <i className="fa-solid fa-code-branch" /> InfoWeb
          <span> - 2V</span>
        </Link>

        <div className="header-actions">
          {podeInstalar && (
            <button
              type="button"
              className="btn-theme btn-instalar-app"
              onClick={instalar}
              aria-label={t('instalar_app')}
              title={t('instalar_app')}
            >
              <i className="fa-solid fa-download" />
            </button>
          )}

          {logado && <PainelNotificacoes />}

          <button
            type="button"
            className="btn-menu-hamburguer"
            onClick={onAbrirMenu}
            aria-label="Abrir menu"
          >
            <i className="fa-solid fa-bars-staggered" />
            <span className="btn-menu-label">{t('menu')}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}