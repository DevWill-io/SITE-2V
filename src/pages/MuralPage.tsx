import { useI18n } from '../hooks/useI18n';
import { useMural } from '../hooks/useMural';
import { MuralForm } from '../components/painel/mural/MuralForm';
import { RecadoItem } from '../components/painel/mural/RecadoItem';

export default function MuralPage() {
  const { t } = useI18n();
  const m = useMural();

  return (
    <section className="mural-page">
      <div className="section-title">
        <h2>
          <span>{t('mural_titulo_1')}</span>{' '}
          <span className="highlight">{t('mural_titulo_2')}</span>
        </h2>
        <p>{t('mural_sub')}</p>
      </div>

      <div className="mural-container">
        <input
          type="text"
          value={m.busca}
          onChange={(e) => m.setBusca(e.target.value)}
          placeholder={t('busca_recados')}
          className="input-search"
          autoComplete="off"
        />

        <MuralForm onPublicar={m.publicar} />

        {m.carregando ? (
          <div className="mural-carregando">
            <i className="fa-solid fa-spinner fa-spin" />
            <span>Carregando recados...</span>
          </div>
        ) : m.recados.length === 0 ? (
          <p className="sem-recados">
            {m.busca
              ? 'Nenhum recado encontrado.'
              : 'Nenhum recado ainda. Seja o primeiro!'}
          </p>
        ) : (
          <div className="lista-recados">
            {m.recados.map((r) => {
              const { nome, foto } = m.dadosAutor(r.autor_matricula);
              return (
                <RecadoItem
                  key={r.id}
                  recado={r}
                  matricula={m.matricula}
                  souAdmin={m.souAdmin}
                  nomeAutor={nome}
                  fotoAutor={foto}
                  onCurtir={m.curtir}
                  onExcluir={m.excluir}
                  onEditar={m.editar}
                  onComentar={m.comentar}
                  onExcluirComentario={m.excluirComentario}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}