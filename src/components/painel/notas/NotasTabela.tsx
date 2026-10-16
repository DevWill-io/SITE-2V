import { useState } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import { textoNota } from '../../../utils/format';
import type {
  DisciplinaCalculada,
  SortKey,
  useBoletim,
} from '../../../hooks/useBoletim';

interface Props {
  disciplinas: DisciplinaCalculada[];
  sortKey: SortKey | null;
  sortDir: 'asc' | 'desc';
  onTrocarSort: (key: SortKey) => void;
  onSimular: (codigo: string, valor: number | null) => void;
  onAbrirMeta: (codigo: string, nome: string) => void;
  mensagem: string;
  status: ReturnType<typeof useBoletim>['status'];
}

export function NotasTabela({
  disciplinas,
  sortKey,
  sortDir,
  onTrocarSort,
  onSimular,
  onAbrirMeta,
  mensagem,
  status,
}: Props) {
  const { t } = useI18n();
  const [colapsados, setColapsados] = useState<Record<string, boolean>>({});

  const iconSort = (key: SortKey) => {
    if (sortKey !== key) return 'fa-sort';
    return sortDir === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  };

  const grupos = disciplinas.reduce(
    (acc, d) => {
      const tipo = d.etapas.tipo;
      if (!acc[tipo]) acc[tipo] = [];
      acc[tipo].push(d);
      return acc;
    },
    {} as Record<string, DisciplinaCalculada[]>
  );

  const statusIcone: Record<string, string> = {
    aprovado: 'fa-check',
    recuperacao: 'fa-rotate',
    reprovado: 'fa-xmark',
  };

  const statusLabel: Record<string, string> = {
    aprovado: t('leg_aprovado'),
    recuperacao: t('leg_recuperacao'),
    reprovado: t('leg_reprovado'),
  };

  return (
    <>
      <p className={`notas-status ${status}`}>
        <i
          className={`fa-solid ${
            status === 'carregando' ? 'fa-spinner fa-spin' : 'fa-circle-info'
          }`}
        />
        <span>{mensagem || t('aguardando_suap')}</span>
      </p>

      <div className="notas-table-wrapper">
        <table className="tabela-notas">
          <thead>
            <tr>
              <th onClick={() => onTrocarSort('nome')} className="sortable">
                <span>{t('th_disciplina')}</span>
                <i className={`fa-solid ${iconSort('nome')}`} />
              </th>
              <th>{t('th_etapas')}</th>
              <th onClick={() => onTrocarSort('media')} className="sortable">
                <span>{t('th_media')}</span>
                <i className={`fa-solid ${iconSort('media')}`} />
              </th>
              <th onClick={() => onTrocarSort('faltas')} className="sortable">
                <span>{t('th_faltas')}</span>
                <i className={`fa-solid ${iconSort('faltas')}`} />
              </th>
              <th>{t('th_projecao')}</th>
              <th onClick={() => onTrocarSort('status')} className="sortable">
                <span>{t('th_status')}</span>
                <i className={`fa-solid ${iconSort('status')}`} />
              </th>
              <th title={t('th_simulador')}>🧪</th>
              <th title={t('th_meta_ind')}>🎯</th>
            </tr>
          </thead>
          <tbody>
            {disciplinas.length === 0 && status !== 'carregando' ? (
              <tr>
                <td colSpan={8} className="notas-vazia">
                  <i className="fa-solid fa-inbox" />
                  <span>Nenhuma disciplina neste filtro.</span>
                </td>
              </tr>
            ) : (
              (['Semestral', 'Anual'] as const).map((tipo) => {
                const lista = grupos[tipo];
                if (!lista || lista.length === 0) return null;
                const colapsado = colapsados[tipo];
                return (
                  <>
                    <tr
                      key={`grupo-${tipo}`}
                      className={`notas-grupo ${colapsado ? 'colapsado' : ''}`}
                      onClick={() =>
                        setColapsados((p) => ({ ...p, [tipo]: !p[tipo] }))
                      }
                    >
                      <th colSpan={8}>
                        {tipo === 'Semestral'
                          ? 'Matérias Semestrais'
                          : 'Matérias Anuais'}
                        <span className="grupo-contador">
                          {lista.length} disciplina(s)
                        </span>
                      </th>
                    </tr>
                    {!colapsado &&
                      lista.map((c) => {
                        const d = c.disciplina;
                        const etapaNotas = c.etapas.etapas.map((n) => {
                          const e = d[`nota_etapa_${n}` as keyof typeof d];
                          const val =
                            e && typeof e === 'object'
                              ? (e as { nota: number }).nota
                              : e;
                          return textoNota(
                            typeof val === 'string' || typeof val === 'number'
                              ? Number(val)
                              : null
                          );
                        });
                        const percentual =
                          c.media.media !== null
                            ? Math.min(c.media.media, 100)
                            : 0;
                        const faltasClasse =
                          c.faltas > 15 ? 'critico' : c.faltas > 12 ? 'alerta' : '';

                        return (
                          <tr
                            key={c.codigo}
                            className={`${c.status === 'reprovado' ? 'linha-risco' : ''} ${c.media.simulando ? 'simulando' : ''}`}
                          >
                            <td className="td-disciplina">
                              <strong>
                                {d.disciplina || d.codigo_diario || 'Disciplina'}
                              </strong>
                            </td>
                            <td>
                              <div className="etapas-cell">
                                {etapaNotas.map((n, i) => (
                                  <span key={i} className="etapa-pill">
                                    {n}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="td-media">
                              <div className="media-cell">
                                <span>{textoNota(c.media.media)}</span>
                                <div className="media-bar">
                                  <div
                                    className={`media-bar-fill ${c.status}`}
                                    style={{ width: `${percentual}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="td-faltas">
                              <span className={`faltas-cell ${faltasClasse}`}>
                                {c.faltas}
                              </span>
                            </td>
                            <td className="td-projecao">
                              <span className={`projecao-cell ${c.projecao.classe}`}>
                                {c.projecao.texto}
                              </span>
                            </td>
                            <td className="td-status">
                              <span className={`badge badge-${c.status}`}>
                                <i className={`fa-solid ${statusIcone[c.status]}`} />{' '}
                                {statusLabel[c.status]}
                              </span>
                            </td>
                            <td className="td-simulador">
                              {c.media.temEtapaAberta ? (
                                <input
                                  type="number"
                                  className="simulador-input"
                                  min={0}
                                  max={100}
                                  step={0.1}
                                  placeholder="Nota"
                                  value={
                                    c.media.simulando && c.media.media !== null
                                      ? ''
                                      : ''
                                  }
                                  onChange={(e) => {
                                    const v = e.target.value.trim();
                                    if (v === '') onSimular(c.codigo, null);
                                    else {
                                      const n = Number(v.replace(',', '.'));
                                      if (Number.isFinite(n))
                                        onSimular(
                                          c.codigo,
                                          Math.max(0, Math.min(100, n))
                                        );
                                    }
                                  }}
                                />
                              ) : (
                                <span className="etapa-fechada">Fechada</span>
                              )}
                            </td>
                            <td className="td-meta">
                              <button
                                type="button"
                                className={`btn-meta-disciplina ${c.metaCustom ? 'customizada' : ''}`}
                                onClick={() =>
                                  onAbrirMeta(
                                    c.codigo,
                                    d.disciplina || c.codigo
                                  )
                                }
                                title={`Meta: ${c.metaEfetiva}`}
                              >
                                🎯
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="notas-legenda">
        <span>
          <i className="dot dot-aprovado" /> {t('leg_aprovado')}
        </span>
        <span>
          <i className="dot dot-recuperacao" /> {t('leg_recuperacao')}
        </span>
        <span>
          <i className="dot dot-reprovado" /> {t('leg_reprovado')}
        </span>
        <span style={{ marginLeft: 'auto', opacity: 0.8 }}>
          {t('leg_extra')}
        </span>
      </div>
    </>
  );
}