import { useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { usePerfis } from '../hooks/usePerfis';
import { PerfilCard } from '../components/painel/membros/PerfilCard';
import { PerfilModal } from '../components/painel/membros/PerfilModal';

export default function MembrosPage() {
  const { t } = useI18n();
  const { perfis, total, carregando, busca, setBusca } = usePerfis();
  const [modalMatricula, setModalMatricula] = useState<string | null>(null);

  return (
    <section className="membros-page">
      <div className="section-title">
        <h2>
          <span>{t('membros_titulo_1')}</span>{' '}
          <span className="highlight">{t('membros_titulo_2')}</span>
        </h2>
        <p>{t('membros_sub')}</p>
        {!carregando && (
          <span className="membros-contador">{total} membro(s)</span>
        )}
      </div>

      <div className="membros-container">
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder={t('busca_perfis')}
          className="input-search"
          autoComplete="off"
        />

        {carregando ? (
          <div className="membros-carregando">
            <i className="fa-solid fa-spinner fa-spin" />
          </div>
        ) : perfis.length === 0 ? (
          <p className="sem-membros">
            {total === 0
              ? 'Nenhum membro cadastrado ainda.'
              : 'Nenhum perfil corresponde ao filtro.'}
          </p>
        ) : (
          <div className="lista-perfis">
            {perfis.map((p) => (
              <PerfilCard
                key={p.id}
                perfil={p}
                onClick={() => setModalMatricula(p.matricula)}
              />
            ))}
          </div>
        )}
      </div>

      <PerfilModal
        aberto={!!modalMatricula}
        matricula={modalMatricula}
        onFechar={() => setModalMatricula(null)}
      />
    </section>
  );
}