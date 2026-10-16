import { useI18n } from '../../../hooks/useI18n';
import type { Filtro } from '../../../hooks/useBoletim';

interface Props {
  filtro: Filtro;
  onChange: (f: Filtro) => void;
}

export function NotasFiltros({ filtro, onChange }: Props) {
  const { t } = useI18n();

  const opcoes: Array<{ valor: Filtro; icone?: string; label: string }> = [
    { valor: 'todas', label: t('filtro_todas') },
    { valor: 'aprovado', icone: 'fa-solid fa-check', label: t('filtro_aprovadas') },
    { valor: 'recuperacao', icone: 'fa-solid fa-rotate', label: t('filtro_recuperacao') },
    { valor: 'reprovado', icone: 'fa-solid fa-xmark', label: t('filtro_reprovadas') },
    { valor: 'risco', icone: 'fa-solid fa-triangle-exclamation', label: t('filtro_risco') },
  ];

  return (
    <div className="notas-filtros" role="tablist">
      {opcoes.map((o) => (
        <button
          key={o.valor}
          type="button"
          className={`filtro-chip ${filtro === o.valor ? 'ativo' : ''}`}
          onClick={() => onChange(o.valor)}
        >
          {o.icone && <i className={o.icone} />}
          <span>{o.label}</span>
        </button>
      ))}
    </div>
  );
}