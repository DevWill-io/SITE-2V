import React, { useMemo } from 'react';
import { useXP } from '../../hooks/useXP';
import { useMascote } from '../../hooks/useMascote';
import { AVATARES_MASCOTE } from '../../utils/constants';
import { useI18n } from '../../hooks/useI18n';

export function MascoteImagem() {
  const { skinAtiva } = useXP();
  const { somLigado, toggleSom, atingiuLimite, darCarinho } = useMascote();
  const { t } = useI18n();

  const skin = useMemo(
    () => AVATARES_MASCOTE.find((s) => s.id === skinAtiva) || AVATARES_MASCOTE[0],
    [skinAtiva]
  );

  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    darCarinho({ clientX: e.clientX, clientY: e.clientY });
    const img = e.currentTarget;
    img.classList.add('clicando');
    setTimeout(() => img.classList.remove('clicando'), 350);
  };

  return (
    <div className="mascote-imagem">
      <button
        type="button"
        className="btn-mascote-mute"
        onClick={toggleSom}
        aria-label={somLigado ? 'Desligar som' : 'Ligar som'}
        title={somLigado ? 'Desligar som' : 'Ligar som'}
      >
        <i className={`fa-solid ${somLigado ? 'fa-volume-high' : 'fa-volume-xmark'}`} />
      </button>

      <img
        src={skin.arquivo}
        alt="Mascote da Turma 2V"
        className="mascote-flutuante"
        data-skin={skinAtiva}
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      />

      {atingiuLimite && (
        <>
          <div className="medalha-conquista" title="1 MILHÃO DE CARINHOS!">
            🏆
          </div>
          <div className="coroa-mascote" title="O mascote é LENDÁRIO!">
            👑
          </div>
        </>
      )}

      <p className="mascote-clique">{t('mascote_clique')}</p>
    </div>
  );
}