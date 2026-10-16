import { matriculaParaExibicao } from '../../../utils/format';
import type { PerfilAluno } from '../../../types/usuario';

interface Props {
  perfil: PerfilAluno;
  onClick: () => void;
}

export function PerfilCard({ perfil, onClick }: Props) {
  const nomeExibir = perfil.nome || perfil.nomeCompleto || 'Usuário sem nome';
  const foto =
    perfil.foto ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(nomeExibir)}&background=random`;
  const mascote = perfil.mascoteAvatar || 'padrao';

  return (
    <button type="button" className="perfil-card-lista" onClick={onClick}>
      <div className={`perfil-card-mascote-bg mascote-${mascote}`}>
        <img
          src={`/img/Mascote${mascote.charAt(0).toUpperCase() + mascote.slice(1)}.png`}
          alt=""
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>

      <div className="perfil-card-lista-avatar">
        <img
          src={foto}
          alt={nomeExibir}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(nomeExibir)}&background=random`;
          }}
        />
      </div>

      <div className="perfil-card-lista-info">
        <h4>{nomeExibir}</h4>
        <span>{matriculaParaExibicao(perfil.matricula)}</span>
      </div>
    </button>
  );
}