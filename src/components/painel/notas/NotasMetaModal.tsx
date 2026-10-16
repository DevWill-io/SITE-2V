import { useEffect, useState } from 'react';
import { useI18n } from '../../../hooks/useI18n';

interface Props {
  aberto: boolean;
  codigo: string;
  nome: string;
  metaAtual: number | null;
  metaGlobal: number;
  onFechar: () => void;
  onSalvar: (codigo: string, valor: number | null) => void;
}

export function NotasMetaModal({
  aberto,
  codigo,
  nome,
  metaAtual,
  metaGlobal,
  onFechar,
  onSalvar,
}: Props) {
  const { t } = useI18n();
  const [valor, setValor] = useState(metaAtual ?? metaGlobal);

  useEffect(() => {
    if (aberto) setValor(metaAtual ?? metaGlobal);
  }, [aberto, metaAtual, metaGlobal]);

  if (!aberto) return null;

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div
        className="modal-content modal-meta"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onFechar}
          aria-label="Fechar"
        >
          ×
        </button>

        <h2 className="modal-title">
          <i className="fa-solid fa-bullseye" />
          <span>{t('meta_individual')}</span>
        </h2>

        <p className="meta-disciplina-nome">{nome}</p>

        <div className="meta-slider-wrap">
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={valor}
            onChange={(e) => setValor(Number(e.target.value))}
          />
          <span className="meta-num">{valor}</span>
        </div>

        <div className="meta-actions">
          <button
            type="button"
            className="btn-reset-meta"
            onClick={() => {
              onSalvar(codigo, null);
              onFechar();
            }}
          >
            {t('usar_meta_global')}
          </button>
          <button
            type="button"
            className="button is-success"
            onClick={() => {
              onSalvar(codigo, valor);
              onFechar();
            }}
          >
            {t('salvar')}
          </button>
        </div>
      </div>
    </div>
  );
}