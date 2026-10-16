// ==========================================
// 🦶 FOOTER
// ==========================================

import { useI18n } from '../../hooks/useI18n';

export function Footer() {
  const { t } = useI18n();
  const ano = new Date().getFullYear();

  return (
    <footer>
      <div className="container">
        <div className="footer-logo">
          <i className="fa-solid fa-code-branch" /> Turma 2V
        </div>
        <p>
          © <span>{ano}</span> {t('footer_feito')}{' '}
          <a
            href="https://github.com/infoWeb2026-2V"
            target="_blank"
            rel="noopener noreferrer"
          >
            InfoWeb2026.2V
          </a>{' '}
          {t('footer_carinho')}
        </p>
      </div>
    </footer>
  );
}