import { useMascote } from '../../hooks/useMascote';
import { useXP } from '../../hooks/useXP';
import { MARCOS_MASCOTE } from '../../utils/constants';

export function MascoteMarcos() {
  const { carinhosGlobais } = useMascote();
  const { cliquesMascote } = useXP();
  const total = carinhosGlobais || cliquesMascote;

  return (
    <div className="marcos-container">
      {MARCOS_MASCOTE.map((m) => (
        <div
          key={m.valor}
          className={`marco ${total >= m.valor ? 'ativo' : ''}`}
          title={`${m.valor.toLocaleString('pt-BR')} carinhos`}
        >
          <span>{m.icone}</span>
          <span>{m.texto}</span>
        </div>
      ))}
    </div>
  );
}