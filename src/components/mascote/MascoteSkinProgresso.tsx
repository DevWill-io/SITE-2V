import { useXP } from '../../hooks/useXP';
import { useI18n } from '../../hooks/useI18n';
import { AVATARES_MASCOTE } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';

export function MascoteSkinProgresso() {
  const { cliquesMascote } = useXP();
  const { isAdmin } = useAuth();
  const { t } = useI18n();

  // Admin: mostra "todas desbloqueadas"
  if (isAdmin) {
    return (
      <div className="mascote-skin-progresso completo">
        <div className="skin-progresso-label">
          <i className="fa-solid fa-gift" />
          <span>{t('proxima_skin')}</span>
          <strong>👑 Admin</strong>
          <span>✓</span>
        </div>
        <div className="skin-progresso-bar">
          <div className="skin-progresso-fill" style={{ width: '100%' }} />
        </div>
      </div>
    );
  }

  const bloqueaveis = AVATARES_MASCOTE.filter(
    (s) => !s.gratis && s.tipo === 'cliques' && s.cliquesNecessarios
  ).sort((a, b) => (a.cliquesNecessarios || 0) - (b.cliquesNecessarios || 0));

  const proxima = bloqueaveis.find(
    (s) => cliquesMascote < (s.cliquesNecessarios || 0)
  );

  if (!proxima) {
    return (
      <div className="mascote-skin-progresso completo">
        <div className="skin-progresso-label">
          <i className="fa-solid fa-gift" />
          <span>{t('proxima_skin')}</span>
          <strong>🎉 {t('skin_todas_desbloqueadas')}</strong>
          <span>✓</span>
        </div>
        <div className="skin-progresso-bar">
          <div className="skin-progresso-fill" style={{ width: '100%' }} />
        </div>
      </div>
    );
  }

  const meta = proxima.cliquesNecessarios || 0;
  const percentual = Math.min((cliquesMascote / meta) * 100, 100);

  return (
    <div className="mascote-skin-progresso">
      <div className="skin-progresso-label">
        <i className="fa-solid fa-gift" />
        <span>{t('proxima_skin')}</span>
        <strong>{proxima.nome}</strong>
        <span>
          {cliquesMascote.toLocaleString('pt-BR')} / {meta.toLocaleString('pt-BR')}
        </span>
      </div>
      <div className="skin-progresso-bar">
        <div className="skin-progresso-fill" style={{ width: `${percentual}%` }} />
      </div>
    </div>
  );
}