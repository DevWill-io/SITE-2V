import { useState } from 'react';
import { useSalaProfessores } from '../hooks/useSalaProfessores';
import { useToast } from '../hooks/useToast';
import { obterToken } from '../services/api';

type Aba = 'alunos' | 'risco' | 'engajamento';

export default function SalaProfessoresPage() {
  const { alunos, stats, carregando, erro, totalConquistas } =
    useSalaProfessores();
  const { toast } = useToast();
  const [aba, setAba] = useState<Aba>('alunos');
  const [busca, setBusca] = useState('');
  const [recalculando, setRecalculando] = useState(false);

  const recalcCargos = async () => {
    const token = obterToken();
    if (!token) {
      toast('Token expirado. Faça login de novo.', 'erro');
      return;
    }
    if (!confirm('Recalcular os cargos de todos os alunos?')) return;

    setRecalculando(true);
    try {
      const res = await fetch('/api/cargos?tipo=recalcular', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: '{}',
      });
      const dados = await res.json();
      if (!res.ok || !dados.sucesso) {
        throw new Error(dados.erro || 'Erro desconhecido');
      }
      toast(
        `✅ Cargos recalculados: ${dados.totalCargos || 0} cargos em ${
          dados.totalAlunos || 0
        } alunos`,
        'sucesso'
      );
    } catch (err) {
      toast('Erro ao recalcular: ' + (err as Error).message, 'erro');
    } finally {
      setRecalculando(false);
    }
  };

  const alunosFiltrados = alunos.filter((a) =>
    !busca
      ? true
      : a.nome.toLowerCase().includes(busca.toLowerCase()) ||
        a.matricula.includes(busca)
  );

  const alunosRisco = alunos.filter((a) => {
    const mediaBaixa = a.mediaGeral !== null && a.mediaGeral < 60;
    const muitasFaltas = a.faltasTotais !== null && a.faltasTotais > 10;
    const semDados = a.mediaGeral === null && a.faltasTotais === null;
    return mediaBaixa || muitasFaltas || semDados;
  });

  const top10 = [...alunos]
    .sort((a, b) => b.carinhos - a.carinhos)
    .filter((a) => a.carinhos > 0)
    .slice(0, 10);

  if (carregando) {
    return (
      <section className="sala-page">
        <div className="sala-loading">
          <i className="fa-solid fa-spinner fa-spin" />
          <span>Carregando dados da turma...</span>
        </div>
      </section>
    );
  }

  if (erro) {
    return (
      <section className="sala-page">
        <div className="sala-erro">
          <i className="fa-solid fa-triangle-exclamation" />
          <p>{erro}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="sala-page">
      <div className="section-title">
        <h2>
          <span>Sala dos</span>{' '}
          <span className="highlight">Professores</span>
        </h2>
        <p>Visão geral da turma (acesso restrito)</p>
      </div>

      <div className="sala-container">
        {/* Botão recalcular */}
        <div className="sala-acoes-topo">
          <button
            type="button"
            className="btn-acao"
            onClick={recalcCargos}
            disabled={recalculando}
          >
            {recalculando ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" /> Recalculando...
              </>
            ) : (
              <>
                <i className="fa-solid fa-rotate" /> Recalcular Cargos
              </>
            )}
          </button>
        </div>

        {/* Tabs */}
        <div className="sala-tabs">
          <button
            type="button"
            className={`sala-tab ${aba === 'alunos' ? 'ativo' : ''}`}
            onClick={() => setAba('alunos')}
          >
            <i className="fa-solid fa-users" /> Alunos
          </button>
          <button
            type="button"
            className={`sala-tab ${aba === 'risco' ? 'ativo' : ''}`}
            onClick={() => setAba('risco')}
          >
            <i className="fa-solid fa-triangle-exclamation" /> Em Risco (
            {alunosRisco.length})
          </button>
          <button
            type="button"
            className={`sala-tab ${aba === 'engajamento' ? 'ativo' : ''}`}
            onClick={() => setAba('engajamento')}
          >
            <i className="fa-solid fa-heart" /> Engajamento
          </button>
        </div>

        {/* ==========================================
            ABA ALUNOS
            ========================================== */}
        {aba === 'alunos' && (
          <div className="sala-tab-content">
            <input
              type="text"
              className="input-search"
              placeholder="🔍 Buscar aluno por nome ou matrícula..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              autoComplete="off"
            />

            <div className="sala-tabela-wrapper">
              <table className="sala-tabela">
                <thead>
                  <tr>
                    <th>Aluno</th>
                    <th>Matrícula</th>
                    <th>Média</th>
                    <th>Faltas</th>
                    <th>Carinhos</th>
                    <th>Conquistas</th>
                    <th>Cargo</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {alunosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="sala-vazio">
                        Nenhum aluno encontrado.
                      </td>
                    </tr>
                  ) : (
                    alunosFiltrados.map((a) => {
                      const diasSemAcesso = a.ultimoAcesso
                        ? Math.floor(
                            (Date.now() - a.ultimoAcesso) /
                              (1000 * 60 * 60 * 24)
                          )
                        : null;
                      let statusClasse = 'ok';
                      let statusLabel = 'Ativo';
                      if (diasSemAcesso !== null && diasSemAcesso > 14) {
                        statusClasse = 'danger';
                        statusLabel = `${diasSemAcesso}d sem acesso`;
                      } else if (diasSemAcesso !== null && diasSemAcesso > 7) {
                        statusClasse = 'warn';
                        statusLabel = `${diasSemAcesso}d sem acesso`;
                      }

                      return (
                        <tr key={a.matricula}>
                          <td>
                            <div className="sala-td-aluno">
                              <img src={a.foto} alt={a.nome} />
                              <span>{a.nome}</span>
                            </div>
                          </td>
                          <td className="sala-mono">{a.matricula}</td>
                          <td>
                            {a.mediaGeral !== null ? (
                              <strong
                                style={{
                                  color:
                                    a.mediaGeral >= 60
                                      ? 'var(--success)'
                                      : a.mediaGeral >= 40
                                      ? 'var(--warning)'
                                      : 'var(--danger)',
                                }}
                              >
                                {a.mediaGeral.toFixed(1)}
                              </strong>
                            ) : (
                              <span className="sala-sem-dados">
                                <i className="fa-solid fa-clock" /> Pendente
                              </span>
                            )}
                          </td>
                          <td>
                            {a.faltasTotais !== null ? (
                              <strong
                                style={{
                                  color:
                                    a.faltasTotais > 15
                                      ? 'var(--danger)'
                                      : a.faltasTotais > 10
                                      ? 'var(--warning)'
                                      : 'var(--text-main)',
                                }}
                              >
                                {a.faltasTotais}
                              </strong>
                            ) : (
                              <span className="sala-sem-dados">
                                <i className="fa-solid fa-clock" />
                              </span>
                            )}
                          </td>
                          <td>
                            <span className="sala-carinhos">
                              <i className="fa-solid fa-heart" />{' '}
                              {a.carinhos.toLocaleString('pt-BR')}
                            </span>
                          </td>
                          <td>
                            <span
                              style={{
                                fontWeight: 700,
                                color:
                                  a.numConquistas >= 9
                                    ? 'var(--success)'
                                    : a.numConquistas >= 5
                                    ? 'var(--warning)'
                                    : 'var(--text-main)',
                              }}
                            >
                              🎖️ {a.numConquistas}/{totalConquistas}
                            </span>
                          </td>
                          <td>
                            {a.cargo ? (
                              <span
                                className={`sala-cargo-badge cargo-badge-${a.cargo.raridade}`}
                                title={a.cargo.desc}
                              >
                                <i
                                  className={`fa-solid ${a.cargo.icone}`}
                                />
                                <span>{a.cargo.nome}</span>
                              </span>
                            ) : (
                              <span className="sala-sem-dados">—</span>
                            )}
                          </td>
                          <td>
                            <span className={`sala-badge ${statusClasse}`}>
                              {statusLabel}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==========================================
            ABA EM RISCO
            ========================================== */}
        {aba === 'risco' && (
          <div className="sala-tab-content">
            {alunosRisco.length === 0 ? (
              <p className="sala-vazio-msg">
                🎉 Nenhum aluno em risco no momento!
              </p>
            ) : (
              <div className="sala-risco-grid">
                {alunosRisco.map((a) => (
                  <div key={a.matricula} className="sala-risco-card">
                    <img src={a.foto} alt={a.nome} />
                    <div className="sala-risco-info">
                      <span className="sala-risco-nome">{a.nome}</span>
                      <span className="sala-risco-motivos">
                        <i className="fa-solid fa-triangle-exclamation" />
                        {a.mediaGeral === null && a.faltasTotais === null
                          ? ' Sem dados de boletim'
                          : ` ${
                              a.mediaGeral !== null && a.mediaGeral < 60
                                ? `Média ${a.mediaGeral.toFixed(1)}`
                                : ''
                            }${
                              a.faltasTotais !== null && a.faltasTotais > 10
                                ? ` • ${a.faltasTotais} faltas`
                                : ''
                            }`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            ABA ENGAJAMENTO
            ========================================== */}
        {aba === 'engajamento' && (
          <div className="sala-tab-content">
            <div className="sala-stats-grid">
              <div className="sala-stat-card">
                <i className="fa-solid fa-heart" />
                <h3>{stats.totalCarinhos.toLocaleString('pt-BR')}</h3>
                <p>Carinhos totais</p>
              </div>
              <div className="sala-stat-card">
                <i className="fa-solid fa-message" />
                <h3>{stats.totalRecados}</h3>
                <p>Recados publicados</p>
              </div>
              <div className="sala-stat-card">
                <i className="fa-solid fa-users" />
                <h3>{stats.totalAlunos}</h3>
                <p>Alunos cadastrados</p>
              </div>
              <div className="sala-stat-card">
                <i className="fa-solid fa-fire" />
                <h3>
                  {stats.topContribuinte
                    ? `${stats.topContribuinte.nome.split(' ')[0]} (${stats.topContribuinte.carinhos})`
                    : '—'}
                </h3>
                <p>Top contribuinte</p>
              </div>
            </div>

            <h4 className="sala-subtitulo">🏆 Top 10 Carinhos</h4>

            {top10.length === 0 ? (
              <p className="sala-vazio-msg">
                Sem dados de engajamento ainda.
              </p>
            ) : (
              <div className="sala-engajamento-lista">
                {top10.map((a, i) => (
                  <div key={a.matricula} className="sala-eng-item">
                    <span className="sala-eng-pos">{i + 1}º</span>
                    <img src={a.foto} alt={a.nome} />
                    <div className="sala-eng-info">
                      <span className="sala-eng-nome">{a.nome}</span>
                      <span className="sala-eng-xp">
                        Nível {Math.floor(a.xpTotal / 500) + 1} •{' '}
                        {a.xpTotal.toLocaleString('pt-BR')} XP
                      </span>
                    </div>
                    <span className="sala-eng-carinhos">
                      <i className="fa-solid fa-heart" />{' '}
                      {a.carinhos.toLocaleString('pt-BR')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}