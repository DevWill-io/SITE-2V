import { useMascote } from '../../hooks/useMascote';
import { useXP } from '../../hooks/useXP';
import { useI18n } from '../../hooks/useI18n';
import { LIMITE_CARINHOS } from '../../utils/constants';

export function MascoteStats() {
  const { carinhosGlobais, meusCarinhos } = useMascote();
  const { cliquesMascote } = useXP();
  const { t } = useI18n();

  const carinhosMostrar = carinhosGlobais || cliquesMascote;
  const meusMostrar = meusCarinhos || cliquesMascote;
  const percentual = Math.min((carinhosMostrar / LIMITE_CARINHOS) * 100, 100);

  return (
    <>
      <div className="mascote-stats">
        <div className="mascote-stat">
          <i className="fa-solid fa-heart" />
          <span>{carinhosMostrar.toLocaleString('pt-BR')}</span>
          <span>{t('mascote_carinhos')}</span>
        </div>
        <div className="mascote-stat">
          <i className="fa-solid fa-user" />
          <span>{t('mascote_seus')}</span>
          <span>{meusMostrar.toLocaleString('pt-BR')}</span>
        </div>
      </div>

      <div className="progresso-container">
        <div className="progresso-label">
          <span>
            <i className="fa-solid fa-chart-line" />
            <span>{t('mascote_progresso')}</span>
          </span>
          <span>
            {carinhosMostrar.toLocaleString('pt-BR')} /{' '}
            {LIMITE_CARINHOS.toLocaleString('pt-BR')}
          </span>
        </div>
        <div className="progresso-bar">
          <div
            className="progresso-fill"
            style={{ width: `${percentual}%` }}
          />
        </div>
      </div>
    </>
  );
}