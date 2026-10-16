import { useAuth } from '../../hooks/useAuth';
import { usePerfil } from '../../hooks/usePerfil';
import { useCargos } from '../../hooks/useCargos';
import { useI18n } from '../../hooks/useI18n';
import { limparArroba } from '../../utils/format';

interface Props {
  onEditar: () => void;
}

export function PerfilCard({ onEditar }: Props) {
  const { user, isAdmin, sair } = useAuth();
  const { perfil } = usePerfil();
  const cargo = useCargos();
  const { t } = useI18n();

  if (!user) return null;

  const nomeExibir = perfil?.nome || user.nome;
  const fotoExibir = perfil?.foto || user.foto;
  const bio = perfil?.bio || '';
  const redes = perfil?.redes || {};

  const linksRedes: { url: string; icone: string; titulo: string }[] = [];
  if (redes.tiktok) linksRedes.push({ url: `https://tiktok.com/@${limparArroba(redes.tiktok)}`, icone: 'fa-brands fa-tiktok', titulo: 'TikTok' });
  if (redes.instagram) linksRedes.push({ url: `https://instagram.com/${limparArroba(redes.instagram)}`, icone: 'fa-brands fa-instagram', titulo: 'Instagram' });
  if (redes.github) linksRedes.push({ url: `https://github.com/${limparArroba(redes.github)}`, icone: 'fa-brands fa-github', titulo: 'GitHub' });
  if (redes.email) linksRedes.push({ url: `mailto:${redes.email}`, icone: 'fa-solid fa-envelope', titulo: 'Email' });
  if (redes.site) linksRedes.push({ url: redes.site, icone: 'fa-solid fa-globe', titulo: 'Site' });

  const handleSair = () => {
    if (confirm(t('confirmar_sair'))) sair();
  };

  return (
    <div className="perfil-card-painel">
      {isAdmin && (
        <span className="admin-badge" title="Administrador do site">
          <i className="fa-solid fa-crown" />
        </span>
      )}

      <img
        src={fotoExibir}
        alt={nomeExibir}
        className="perfil-card-foto"
        onError={(e) => {
          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(nomeExibir)}&background=random`;
        }}
      />

      <div className="perfil-card-info">
        <span className="perfil-card-greeting">{t('bem_vindo')}</span>
        <h2 className="perfil-card-nome">{nomeExibir}</h2>
        <span className="perfil-card-matricula">{user.matricula}</span>

        {cargo?.ativo && (
          <span
            className={`perfil-card-cargo cargo-badge-${cargo.raridade || 'comum'}`}
            title={cargo.nome || cargo.ativo}
          >
            <i className={`fa-solid ${cargo.icone || 'fa-medal'}`} />
            <span>{cargo.nome || cargo.ativo}</span>
          </span>
        )}

        {bio && <p className="perfil-card-bio">{bio}</p>}

        {linksRedes.length > 0 && (
          <div className="perfil-card-redes">
            {linksRedes.map((l) => (
              <a key={l.titulo} href={l.url} target="_blank" rel="noopener noreferrer" title={l.titulo} aria-label={l.titulo}>
                <i className={l.icone} />
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="perfil-card-acoes">
        <button type="button" className="perfil-card-editar" onClick={onEditar}>
          <i className="fa-solid fa-user-pen" />
          <span>{t('editar_perfil')}</span>
        </button>

        <button type="button" className="perfil-card-sair" onClick={handleSair}>
          <i className="fa-solid fa-right-from-bracket" />
          <span>{t('sair_conta')}</span>
        </button>
      </div>
    </div>
  );
}