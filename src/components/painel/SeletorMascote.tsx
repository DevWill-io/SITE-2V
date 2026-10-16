import { useXP } from '../../hooks/useXP';
import { useAuth } from '../../hooks/useAuth';
import { AVATARES_MASCOTE } from '../../utils/constants';

interface Props {
  selecionado: string;
  onSelecionar: (skinId: string) => void;
}

export function SeletorMascote({ selecionado, onSelecionar }: Props) {
  const { cliquesMascote, conquistas } = useXP();
  const { isAdmin } = useAuth();

  const skins = AVATARES_MASCOTE.filter((s) =>
    s.apenasAdmin ? isAdmin : true
  );

  return (
    <div className="seletor-mascote">
      <p className="field-section-title">
        <i className="fa-solid fa-paw" />
        <span>Seu mascote</span>
      </p>
      <p className="seletor-mascote-desc">
        Personalize o mascote que aparece quando você dá carinho.
      </p>

      <div className="seletor-mascote-grid">
        {skins.map((skin) => {
          const ativo = selecionado === skin.id;
          const ehAdminSkin = !!skin.apenasAdmin;

          // Calcula bloqueio
          let bloqueada = false;
          let motivo = '';

          if (!skin.gratis && !ehAdminSkin) {
            if (skin.tipo === 'conquista' && skin.conquistaNecessaria) {
              const tem = !!conquistas[skin.conquistaNecessaria];
              if (!tem) {
                bloqueada = true;
                motivo = `Conquista "${skin.conquistaNecessaria}" não desbloqueada`;
              }
            } else {
              const meta = skin.cliquesNecessarios || 0;
              if (cliquesMascote < meta) {
                bloqueada = true;
                const faltam = meta - cliquesMascote;
                motivo = `Faltam ${faltam.toLocaleString('pt-BR')} cliques`;
              }
            }
          }

          return (
            <button
              key={skin.id}
              type="button"
              className={`seletor-mascote-opcao ${ativo ? 'ativo' : ''} ${
                bloqueada ? 'bloqueado' : ''
              } ${ehAdminSkin ? 'admin' : ''}`}
              onClick={() => !bloqueada && onSelecionar(skin.id)}
              disabled={bloqueada}
              title={bloqueada ? motivo : skin.nome}
            >
              <img
                src={skin.arquivo}
                alt={skin.nome}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="seletor-mascote-nome">{skin.nome}</span>

              {bloqueada && (
                <span className="seletor-mascote-lock">
                  <i className="fa-solid fa-lock" />
                </span>
              )}
              {ativo && (
                <span className="seletor-mascote-check">
                  <i className="fa-solid fa-check" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}