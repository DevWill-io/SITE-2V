import { useI18n } from '../../../hooks/useI18n';
import type { useBoletim } from '../../../hooks/useBoletim';

interface Props {
  resumo: ReturnType<typeof useBoletim>['resumo'];
}

export function NotasResumo({ resumo }: Props) {
  const { t } = useI18n();

  const cards = [
    {
      icone: 'fa-solid fa-chart-line',
      label: t('media_geral'),
      valor: resumo.mediaGeral !== null ? resumo.mediaGeral.toFixed(1) : '—',
    },
    {
      icone: 'fa-solid fa-book',
      label: t('disciplinas'),
      valor: resumo.disciplinas || '—',
    },
    {
      icone: 'fa-solid fa-triangle-exclamation',
      label: t('em_risco'),
      valor: resumo.emRisco,
      classe: resumo.emRisco > 0 ? 'aviso' : '',
    },
    {
      icone: 'fa-solid fa-user-xmark',
      label: t('faltas_totais'),
      valor: resumo.faltasTotais,
    },
  ];

  return (
    <div className="notas-resumo">
      {cards.map((c) => (
        <div key={c.label} className={`resumo-card ${c.classe || ''}`}>
          <i className={c.icone} />
          <span className="resumo-label">{c.label}</span>
          <strong className="resumo-valor">{c.valor}</strong>
        </div>
      ))}
    </div>
  );
}