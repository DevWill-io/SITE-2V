import { Modal } from '../../ui/Modal';
import { useI18n } from '../../../hooks/useI18n';
import { usePerfilPublico } from '../../../hooks/usePerfilPublico';
import { CONQUISTAS } from '../../../utils/constants';
import { limparArroba } from '../../../utils/format';

interface Props {
  aberto: boolean;
  matricula: string | null;
  onFechar: () => void;
}

export function PerfilModal({ aberto, matricula, onFechar }: Props) {
  const { t } = useI18n();
  const { perfil, nivel, cargo, conquistas, carregando } =
    usePerfilPublico(aberto ? matricula : null);

  const nomeExibir =
    perfil?.nomeCompleto || perfil?.nome || 'Não informado';
  const foto =
    perfil?.foto ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(nomeExibir)}&background=random`;

  // Conquistas a mostrar
  const listaConquistas = CONQUISTAS.filter((c) => {
    if (conquistas.length === 0) return false;
    return conquistas.includes(c.id);
  });

  const linksRedes: { url: string; icone: string; titulo: string }[] = [];
  const redes = perfil?.redes || {};
  if (redes.tiktok)
    linksRedes.push({
      url: `https://tiktok.com/@${limparArroba(redes.tiktok)}`,
      icone: 'fa-brands fa-tiktok',
      titulo: 'TikTok',
    });
  if (redes.instagram)
    linksRedes.push({
      url: `https://instagram.com/${limparArroba(redes.instagram)}`,
      icone: 'fa-brands fa-instagram',
      titulo: 'Instagram',
    });
  if (redes.github)
    linksRedes.push({
      url: `https://github.com/${limparArroba(redes.github)}`,
      icone: 'fa-brands fa-github',
      titulo: 'GitHub',
    });
  if (redes.email)
    linksRedes.push({
      url: `mailto:${redes.email}`,
      icone: 'fa-solid fa-envelope',
      titulo: 'Email',
    });
  if (redes.site)
    linksRedes.push({
      url: redes.site,
      icone: 'fa-solid fa-globe',
      titulo: 'Site',
    });

  return (
    <Modal aberto={aberto} onFechar={onFechar} classNameConteudo="modal-perfil-publico">
      {carregando ? (
        <div className="modal-perfil-loading">
          <i className="fa-solid fa-spinner fa-spin" />
        </div>
      ) : (
        <>
          <div className="modal-perfil-topo">
            <img
              src={foto}
              alt={nomeExibir}
              className="modal-perfil-foto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(nomeExibir)}&background=random`;
              }}
            />

            <h3 className="modal-perfil-nome">{nomeExibir}</h3>

            {perfil?.matricula && (
              <span className="modal-perfil-matricula">
                {t('matricula')} {perfil.matricula}
              </span>
            )}
          </div>

          <div className="modal-perfil-badges">
            {cargo?.ativo && (
              <span
                className={`modal-perfil-cargo cargo-badge-${cargo.raridade || 'comum'}`}
              >
                <i className={`fa-solid ${cargo.icone || 'fa-medal'}`} />
                <span>{cargo.nome || cargo.ativo}</span>
              </span>
            )}

            {nivel && (
              <div className="modal-perfil-nivel">
                <span className="modal-perfil-nivel-badge">{nivel.nivel}</span>
                <div>
                  <span className="modal-perfil-nivel-nome">{nivel.nome}</span>
                  <span className="modal-perfil-nivel-xp">
                    {nivel.xpAtual >= 0 &&
                      `${(nivel.xpAtual + (nivel.xpProximo - nivel.xpAtual)).toLocaleString('pt-BR')} XP`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {perfil?.bio && (
            <p className="modal-perfil-bio">{perfil.bio}</p>
          )}

          {linksRedes.length > 0 && (
            <div className="modal-perfil-redes">
              {linksRedes.map((l) => (
                <a
                  key={l.titulo}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={l.titulo}
                  aria-label={l.titulo}
                >
                  <i className={l.icone} />
                </a>
              ))}
            </div>
          )}

          {listaConquistas.length > 0 && (
            <div className="modal-perfil-conquistas">
              <h4>
                <i className="fa-solid fa-medal" />
                <span>{t('conquistas_titulo')}</span>
                <span className="modal-perfil-conquistas-contador">
                  {listaConquistas.length}/{CONQUISTAS.length}
                </span>
              </h4>
              <div className="modal-perfil-conquistas-grid">
                {listaConquistas.map((c) => (
                  <div
                    key={c.id}
                    className={`modal-conquista-badge ${c.raridade}`}
                    title={`${c.nome} — ${c.desc}`}
                  >
                    <i className={c.icone} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {perfil?.ultimoAcesso && (
            <p className="modal-perfil-acesso">
              <span>{t('ultimo_acesso')}</span>{' '}
              {new Date(perfil.ultimoAcesso).toLocaleString('pt-BR')}
            </p>
          )}
        </>
      )}
    </Modal>
  );
}