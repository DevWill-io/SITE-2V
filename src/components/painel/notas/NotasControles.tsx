import { useI18n } from '../../../hooks/useI18n';
import type { useBoletim } from '../../../hooks/useBoletim';

interface Props {
  periodos: ReturnType<typeof useBoletim>['periodos'];
  periodoSelecionado: string;
  onSelecionarPeriodo: (v: string) => void;
  metaGlobal: number;
  onMudarMeta: (v: number) => void;
  onAtualizar: () => void;
  onLimparSimulador: () => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
}

export function NotasControles({
  periodos,
  periodoSelecionado,
  onSelecionarPeriodo,
  metaGlobal,
  onMudarMeta,
  onAtualizar,
  onLimparSimulador,
  onExportCSV,
  onExportPDF,
}: Props) {
  const { t } = useI18n();

  return (
    <>
      <div className="notas-controls">
        <label htmlFor="periodo-notas">{t('periodo')}</label>
        <select
          id="periodo-notas"
          value={periodoSelecionado}
          onChange={(e) => onSelecionarPeriodo(e.target.value)}
          disabled={periodos.length === 0}
        >
          {periodos.length === 0 && <option>Carregando...</option>}
          {periodos.map((p) => {
            const v = `${p.ano_letivo}/${p.periodo_letivo}`;
            return (
              <option key={v} value={v}>
                {p.ano_letivo}.{p.periodo_letivo}
              </option>
            );
          })}
        </select>

        <label htmlFor="meta-notas">
          {t('meta')}: <span>{metaGlobal}</span>
        </label>
        <input
          id="meta-notas"
          type="range"
          min={0}
          max={100}
          step={5}
          value={metaGlobal}
          onChange={(e) => onMudarMeta(Number(e.target.value))}
        />

        <button type="button" className="button is-link" onClick={onAtualizar}>
          <i className="fa-solid fa-rotate" />
          <span>{t('atualizar')}</span>
        </button>
      </div>

      <div className="notas-acoes">
        <button type="button" className="btn-acao" onClick={onExportCSV}>
          <i className="fa-solid fa-file-csv" />
          <span>{t('export_csv')}</span>
        </button>
        <button type="button" className="btn-acao" onClick={onExportPDF}>
          <i className="fa-solid fa-file-pdf" />
          <span>{t('export_pdf')}</span>
        </button>
        <button type="button" className="btn-acao" onClick={onLimparSimulador}>
          <i className="fa-solid fa-eraser" />
          <span>{t('limpar_simulador')}</span>
        </button>
      </div>
    </>
  );
}