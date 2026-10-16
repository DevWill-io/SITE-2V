import { useCallback, useEffect, useState, type MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { TEMAS_DISPONIVEIS, type TemaCor } from '../../utils/constants';
import { PATHS } from '../../routes/paths';

interface Props {
  aberto: boolean;
  onFechar: () => void;
}

const ITENS_HOME = [
  { ancora: 'inicio',        chave: 'nav_inicio',    chaveDesc: 'nav_inicio_desc',    icone: 'fa-house' },
  { ancora: 'curso',         chave: 'nav_curso',     chaveDesc: 'nav_curso_desc',     icone: 'fa-graduation-cap' },
  { ancora: 'estatisticas',  chave: 'nav_numeros',   chaveDesc: 'nav_numeros_desc',   icone: 'fa-chart-simple' },
  { ancora: 'lideres',       chave: 'nav_lideres',   chaveDesc: 'nav_lideres_desc',   icone: 'fa-crown' },
  { ancora: 'coordenadores', chave: 'nav_coord',     chaveDesc: 'nav_coord_desc',     icone: 'fa-user-tie' },
  { ancora: 'galeria',       chave: 'nav_galeria',   chaveDesc: 'nav_galeria_desc',   icone: 'fa-images' },
  { ancora: 'projetos',      chave: 'nav_projetos',  chaveDesc: 'nav_projetos_desc',  icone: 'fa-code' },
  { ancora: 'contato',       chave: 'nav_contato',   chaveDesc: 'nav_contato_desc',   icone: 'fa-envelope' },
  { ancora: 'mascote',       chave: 'nav_mascote',   chaveDesc: 'nav_mascote_desc',   icone: 'fa-paw' },
] as const;

const ITENS_PAINEL = [
  { rota: PATHS.PAINEL_NOTAS,    chave: 'nav_notas',    chaveDesc: 'nav_notas_desc',    icone: 'fa-chart-line' },
  { rota: PATHS.PAINEL_HORARIOS, chave: 'nav_horarios', chaveDesc: 'nav_horarios_desc', icone: 'fa-calendar-days' },
  { rota: PATHS.PAINEL_MURAL,    chave: 'nav_mural',    chaveDesc: 'nav_mural_desc',    icone: 'fa-comments' },
  { rota: PATHS.PAINEL_MEMBROS,  chave: 'nav_membros',  chaveDesc: 'nav_membros_desc',  icone: 'fa-users' },
  { rota: PATHS.PAINEL_AGENDA,   chave: 'nav_agenda',   chaveDesc: 'nav_agenda_desc',   icone: 'fa-calendar-check' },
] as const;

const OFFSET_NAVBAR = 100;

export function MenuLateral({ aberto, onFechar }: Props) {
  const { t, idioma, trocarIdioma } = useI18n();
  const { temaCor, modo, trocarCor, trocarModo } = useTheme();
  const { status, isAdmin } = useAuth();
  const logado = status === 'logado';
  const location = useLocation();
  const navigate = useNavigate();

  const [submenuIdiomaAberto, setSubmenuIdiomaAberto] = useState(false);
  const [submenuTemaAberto, setSubmenuTemaAberto] = useState(false);

  useEffect(() => {
    if (!aberto) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [aberto, onFechar]);

  useEffect(() => {
    if (aberto) {
      document.body.classList.add('menu-aberto');
      return () => document.body.classList.remove('menu-aberto');
    }
  }, [aberto]);

  useEffect(() => {
    onFechar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const fecharSubmenus = useCallback(() => {
    setSubmenuIdiomaAberto(false);
    setSubmenuTemaAberto(false);
  }, []);

  const toggleIdioma = useCallback(() => {
    setSubmenuIdiomaAberto((v) => !v);
    setSubmenuTemaAberto(false);
  }, []);

  const toggleTema = useCallback(() => {
    setSubmenuTemaAberto((v) => !v);
    setSubmenuIdiomaAberto(false);
  }, []);

  const escolherIdioma = useCallback(
    (novo: typeof idioma) => trocarIdioma(novo),
    [trocarIdioma]
  );

  const escolherCor = useCallback(
    (cor: TemaCor) => trocarCor(cor),
    [trocarCor]
  );

  const handleAncoraClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, ancora: string) => {
      e.preventDefault();
      onFechar();
      fecharSubmenus();

      const irParaSecao = () => {
        const el = document.getElementById(ancora);
        if (!el) return;
        const y = el.getBoundingClientRect().top + window.scrollY - OFFSET_NAVBAR;
        window.scrollTo({ top: y, behavior: 'smooth' });
        window.history.replaceState(null, '', `/#${ancora}`);
      };

      if (location.pathname === '/') {
        irParaSecao();
        return;
      }

      navigate('/');
      setTimeout(irParaSecao, 150);
    },
    [onFechar, fecharSubmenus, location.pathname, navigate]
  );

  return (
    <>
      <div className={`menu-lateral-overlay ${aberto ? 'aberto' : ''}`} onClick={onFechar} />

      <aside className={`menu-lateral ${aberto ? 'aberto' : ''}`} aria-hidden={!aberto}>
        <div className="menu-lateral-header">
          <span className="menu-lateral-titulo">
            <i className="fa-solid fa-code-branch" /> InfoWeb 2V
          </span>
          <button type="button" className="btn-fechar-menu" onClick={onFechar} aria-label="Fechar menu">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <nav className="menu-lateral-nav">
          {logado && (
            <>
              <div className="menu-grupo-titulo">
                <i className="fa-solid fa-gauge-high" />
                <span>{t('painel_aluno')}</span>
              </div>

              {ITENS_PAINEL.map((item) => (
                <Link
                  key={item.rota}
                  to={item.rota}
                  className={`menu-item ${location.pathname === item.rota ? 'active' : ''}`}
                >
                  <span className="menu-item-icone">
                    <i className={`fa-solid ${item.icone}`} />
                  </span>
                  <span className="menu-item-texto">
                    <span className="menu-item-titulo">{t(item.chave)}</span>
                    <span className="menu-item-desc">{t(item.chaveDesc)}</span>
                  </span>
                </Link>
              ))}

              {isAdmin && (
                <Link
                  to={PATHS.ADMIN_SALA}
                  className={`menu-item ${location.pathname === PATHS.ADMIN_SALA ? 'active' : ''}`}
                >
                  <span className="menu-item-icone">
                    <i className="fa-solid fa-user-tie" />
                  </span>
                  <span className="menu-item-texto">
                    <span className="menu-item-titulo">{t('nav_sala')}</span>
                    <span className="menu-item-desc">{t('nav_sala_desc')}</span>
                  </span>
                </Link>
              )}
            </>
          )}

          <div className="menu-grupo-titulo">
            <i className="fa-solid fa-house" />
            <span>{t('grupo_site')}</span>
          </div>

          {ITENS_HOME.map((item) => (
            <a
              key={item.ancora}
              href={`/#${item.ancora}`}
              className="menu-item"
              onClick={(e) => handleAncoraClick(e, item.ancora)}
            >
              <span className="menu-item-icone">
                <i className={`fa-solid ${item.icone}`} />
              </span>
              <span className="menu-item-texto">
                <span className="menu-item-titulo">{t(item.chave)}</span>
                <span className="menu-item-desc">{t(item.chaveDesc)}</span>
              </span>
            </a>
          ))}

          <div className="menu-grupo-titulo">
            <i className="fa-solid fa-ellipsis" />
            <span>{t('grupo_extras')}</span>
          </div>

          {!logado && (
            <Link to={PATHS.LOGIN} className="menu-item">
              <span className="menu-item-icone">
                <i className="fa-solid fa-right-to-bracket" />
              </span>
              <span className="menu-item-texto">
                <span className="menu-item-titulo">{t('entrada_suap')}</span>
                <span className="menu-item-desc">{t('entrada_suap_desc')}</span>
              </span>
            </Link>
          )}

          {logado && (
            <Link to={PATHS.LOGIN} className="menu-item">
              <span className="menu-item-icone">
                <i className="fa-solid fa-id-card" />
              </span>
              <span className="menu-item-texto">
                <span className="menu-item-titulo">SUAP</span>
                <span className="menu-item-desc">{t('nav_suap_desc')}</span>
              </span>
            </Link>
          )}

          <Link to={PATHS.TUTORIAL} className="menu-item">
            <span className="menu-item-icone">
              <i className="fa-solid fa-graduation-cap" />
            </span>
            <span className="menu-item-texto">
              <span className="menu-item-titulo">Tutorial</span>
              <span className="menu-item-desc">{t('como_usar_site')}</span>
            </span>
          </Link>
        </nav>

        <div className="menu-lateral-footer">
          <div className="menu-lateral-acoes">
            <button type="button" className="menu-acao-btn" onClick={toggleIdioma} aria-expanded={submenuIdiomaAberto}>
              <i className="fa-solid fa-globe" />
              <span>{t('idioma')}</span>
            </button>
            <button type="button" className="menu-acao-btn" onClick={toggleTema} aria-expanded={submenuTemaAberto}>
              <i className="fa-solid fa-palette" />
              <span>{t('tema')}</span>
            </button>
          </div>

          <div className={`menu-submenu ${submenuIdiomaAberto ? 'aberto' : ''}`}>
            {(['pt-BR', 'en', 'es'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                className={`menu-submenu-item ${idioma === lang ? 'ativo' : ''}`}
                onClick={() => escolherIdioma(lang)}
              >
                <span className="submenu-flag">
                  {lang === 'pt-BR' ? '🇧🇷' : lang === 'en' ? '🇺🇸' : '🇪🇸'}
                </span>
                <span>{lang === 'pt-BR' ? 'Português' : lang === 'en' ? 'English' : 'Español'}</span>
              </button>
            ))}
          </div>

          <div className={`menu-submenu ${submenuTemaAberto ? 'aberto' : ''}`}>
            <div className="submenu-titulo">
              <i className="fa-solid fa-swatchbook" />
              <span>{t('cor_tema')}</span>
            </div>
            <div className="submenu-cores">
              {TEMAS_DISPONIVEIS.map((cor) => (
                <button
                  key={cor}
                  type="button"
                  className={`submenu-cor ${temaCor === cor ? 'ativo' : ''}`}
                  onClick={() => escolherCor(cor)}
                >
                  <span className={`tema-swatch tema-swatch-${cor}`} />
                  <span>{t(`cor_${cor}` as never)}</span>
                </button>
              ))}
            </div>

            <div className="submenu-titulo submenu-titulo-modo">
              <i className="fa-solid fa-circle-half-stroke" />
              <span>{t('modo')}</span>
            </div>
            <div className="submenu-modos">
              <button
                type="button"
                className={`submenu-modo ${modo === 'claro' ? 'ativo' : ''}`}
                onClick={() => trocarModo('claro')}
              >
                <i className="fa-solid fa-sun" />
                <span>{t('modo_claro')}</span>
              </button>
              <button
                type="button"
                className={`submenu-modo ${modo === 'escuro' ? 'ativo' : ''}`}
                onClick={() => trocarModo('escuro')}
              >
                <i className="fa-solid fa-moon" />
                <span>{t('modo_escuro')}</span>
              </button>
            </div>
          </div>

          <div className="menu-lateral-redes">
            <a href="https://github.com/infoWeb2026-2V" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <i className="fa-brands fa-github" />
            </a>
            <a href="https://instagram.com/InfoWeb2026.1" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fa-brands fa-instagram" />
            </a>
            <a href="https://www.tiktok.com/@infoweb2026_2v" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <i className="fa-brands fa-tiktok" />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}