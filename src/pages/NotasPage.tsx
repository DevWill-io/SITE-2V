import { useEffect, useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { useBoletim } from '../hooks/useBoletim';
import { useHistoricoPeriodos } from '../hooks/useHistoricoPeriodos';
import { NotasResumo } from '../components/painel/notas/NotasResumo';
import { NotasControles } from '../components/painel/notas/NotasControles';
import { NotasFiltros } from '../components/painel/notas/NotasFiltros';
import { NotasTabela } from '../components/painel/notas/NotasTabela';
import { NotasMetaModal } from '../components/painel/notas/NotasMetaModal';
import { HistoricoPeriodos } from '../components/painel/notas/HistoricoPeriodos';

export default function NotasPage() {
  const { t } = useI18n();
  const b = useBoletim();
  const { periodos: historico, salvarPeriodo } = useHistoricoPeriodos();
  const [metaModal, setMetaModal] = useState<{
    aberto: boolean;
    codigo: string;
    nome: string;
  }>({ aberto: false, codigo: '', nome: '' });

  // 🆕 Salva o período no histórico quando carrega o boletim
  useEffect(() => {
    if (b.status !== 'ok' || !b.periodoSelecionado) return;
    if (b.resumo.disciplinas === 0) return;

    salvarPeriodo({
      periodo: b.periodoSelecionado.replace('/', '.'),
      media: b.resumo.mediaGeral,
      disciplinas: b.resumo.disciplinas,
      salvoEm: Date.now(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [b.status, b.periodoSelecionado, b.resumo.mediaGeral, b.resumo.disciplinas]);

  const abrirMeta = (codigo: string, nome: string) => {
    setMetaModal({ aberto: true, codigo, nome });
  };
  const fecharMeta = () => setMetaModal((m) => ({ ...m, aberto: false }));

  const exportarCSV = () => {
    if (b.disciplinas.length === 0) return;
    const linhas = [
      ['Disciplina', 'Tipo', 'Etapas', 'Média', 'Meta', 'Faltas', 'Projeção', 'Status'].join(';'),
    ];
    b.disciplinas.forEach((c) => {
      linhas.push(
        [
          (c.disciplina.disciplina || c.codigo).replace(/;/g, ','),
          c.etapas.tipo,
          c.etapas.etapas
            .map((n) => {
              const e = c.disciplina[`nota_etapa_${n}` as keyof typeof c.disciplina];
              const val = e && typeof e === 'object' ? (e as { nota: number }).nota : e;
              return val ?? '-';
            })
            .join(' | '),
          c.media.media !== null ? c.media.media.toFixed(1) : '-',
          c.metaEfetiva,
          c.faltas,
          c.projecao.texto,
          c.status,
        ].join(';')
      );
    });
    const csv = '\uFEFF' + linhas.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boletim_${b.periodoSelecionado.replace('/', '.')}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const exportarPDF = () => {
    if (b.disciplinas.length === 0) return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <!doctype html><html><head><meta charset="utf-8">
      <title>Boletim ${b.periodoSelecionado}</title>
      <style>
        *{font-family:'Segoe UI',Arial,sans-serif}
        body{padding:30px;color:#222}
        h1{font-size:20px;margin:0 0 4px}
        .sub{color:#666;font-size:12px;margin-bottom:20px}
        table{width:100%;border-collapse:collapse;margin-top:10px;font-size:12px}
        th,td{border:1px solid #ccc;padding:6px 8px;text-align:left}
        th{background:#f3f0fa}
      </style></head><body>
      <h1>Boletim — ${b.periodoSelecionado}</h1>
      <div class="sub">Emitido em ${new Date().toLocaleString('pt-BR')}</div>
      <table><thead><tr>
        <th>Disciplina</th><th>Média</th><th>Faltas</th><th>Projeção</th><th>Status</th>
      </tr></thead><tbody>
      ${b.disciplinas
        .map(
          (c) =>
            `<tr><td>${c.disciplina.disciplina || c.codigo}</td><td>${c.media.media !== null ? c.media.media.toFixed(1) : '-'}</td><td>${c.faltas}</td><td>${c.projecao.texto}</td><td>${c.status}</td></tr>`
        )
        .join('')}
      </tbody></table>
      <script>window.onload=()=>setTimeout(()=>window.print(),300);<\/script>
      </body></html>`);
    w.document.close();
  };

  return (
    <section className="notas-page">
      <div className="section-title">
        <h2>
          <span>{t('calc_titulo_1')}</span>{' '}
          <span className="highlight">{t('calc_titulo_2')}</span>
        </h2>
        <p>{t('calc_sub')}</p>
      </div>

      <NotasResumo resumo={b.resumo} />

      {/* 🆕 Histórico de períodos */}
      <HistoricoPeriodos periodos={historico} />

      <div className="notas-panel">
        <NotasControles
          periodos={b.periodos}
          periodoSelecionado={b.periodoSelecionado}
          onSelecionarPeriodo={b.selecionarPeriodo}
          metaGlobal={b.metaGlobal}
          onMudarMeta={b.setMetaGlobal}
          onAtualizar={b.atualizar}
          onLimparSimulador={b.limparSimulacoes}
          onExportCSV={exportarCSV}
          onExportPDF={exportarPDF}
        />

        <NotasFiltros filtro={b.filtro} onChange={b.setFiltro} />

        <NotasTabela
          disciplinas={b.disciplinas}
          sortKey={b.sortKey}
          sortDir={b.sortDir}
          onTrocarSort={b.trocarSort}
          onSimular={b.simular}
          onAbrirMeta={abrirMeta}
          mensagem={b.mensagem}
          status={b.status}
        />
      </div>

      <NotasMetaModal
        aberto={metaModal.aberto}
        codigo={metaModal.codigo}
        nome={metaModal.nome}
        metaAtual={
          metaModal.codigo
            ? b.disciplinas.find((d) => d.codigo === metaModal.codigo)
                ?.metaEfetiva ?? null
            : null
        }
        metaGlobal={b.metaGlobal}
        onFechar={fecharMeta}
        onSalvar={(codigo, valor) => b.definirMeta(codigo, valor)}
      />
    </section>
  );
}