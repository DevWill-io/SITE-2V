import { NavLink } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import { PATHS } from '../../routes/paths';

interface Tab {
  rota: string;
  chave: string;
  icone: string;
}

const TABS: Tab[] = [
  { rota: PATHS.PAINEL_NOTAS,    chave: 'nav_notas',    icone: 'fa-chart-line' },
  { rota: PATHS.PAINEL_HORARIOS, chave: 'nav_horarios', icone: 'fa-calendar-days' },
  { rota: PATHS.PAINEL_MURAL,    chave: 'nav_mural',    icone: 'fa-comments' },
  { rota: PATHS.PAINEL_MEMBROS,  chave: 'nav_membros',  icone: 'fa-users' },
  { rota: PATHS.PAINEL_AGENDA,   chave: 'nav_agenda',   icone: 'fa-calendar-check' },
];

export function PainelTabs() {
  const { t } = useI18n();

  return (
    <nav className="painel-tabs" aria-label="Navegação do painel">
      {TABS.map((tab) => (
        <NavLink
          key={tab.rota}
          to={tab.rota}
          className={({ isActive }) =>
            `painel-tab ${isActive ? 'ativo' : ''}`
          }
        >
          <i className={`fa-solid ${tab.icone}`} />
          <span>{t(tab.chave as never)}</span>
        </NavLink>
      ))}
    </nav>
  );
}