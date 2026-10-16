import { Outlet } from 'react-router-dom';
import { PerfilCard } from './PerfilCard';
import { PainelXP } from './PainelXP';
import { ConquistasPainel } from './ConquistasPainel';
import { ContagemRegressiva } from './ContagemRegressiva';
import { PainelTabs } from './PainelTabs';
import { PushToggle } from './PushToggle';

interface Props {
  onEditarPerfil: () => void;
}

export function PainelLayout({ onEditarPerfil }: Props) {
  return (
    <div className="painel-wrapper">
      <div className="container">
        <PerfilCard onEditar={onEditarPerfil} />
        <PainelXP />
        <PushToggle />
        <ConquistasPainel />
        <ContagemRegressiva />

        <PainelTabs />

        <div className="painel-conteudo">
          <Outlet />
        </div>
      </div>
    </div>
  );
}