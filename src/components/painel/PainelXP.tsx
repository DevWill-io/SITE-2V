import { useXP } from '../../hooks/useXP';
import { useI18n } from '../../hooks/useI18n';
import { calcularNivel } from '../../utils/format';

export function PainelXP() {
  const { xp, streak, pronto } = useXP();
  const { t } = useI18n();

  if (!pronto) return null;

  const nivel = calcularNivel(xp);

  return (
    <div className="xp-card">
      <div className="xp-header">
        <div className="xp-nivel-badge">
          <span className="xp-nivel-num">{nivel.nivel}</span>
        </div>
        <div className="xp-info">
          <span className="xp-nome-nivel">{nivel.nome}</span>
          <span className="xp-total">{xp.toLocaleString('pt-BR')} XP</span>
        </div>
        <div className="xp-streak">
          <i className="fa-solid fa-fire" />
          <span>{streak}</span>
          <small>{t('dias')}</small>
        </div>
      </div>

      <div className="xp-barra">
        <div
          className="xp-barra-fill"
          style={{ width: `${nivel.progresso}%` }}
        />
      </div>

      <span className="xp-proximo">
        {nivel.proximoNome
          ? `Próximo nível: ${nivel.proximoNome} (${(nivel.xpProximo - xp).toLocaleString('pt-BR')} XP)`
          : '🎉 Você atingiu o nível máximo!'}
      </span>
    </div>
  );
}