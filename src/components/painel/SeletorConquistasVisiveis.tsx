import { useXP } from '../../hooks/useXP';
import { CONQUISTAS } from '../../utils/constants';

interface Props {
  /** null = mostrar todas; array = mostrar só essas */
  selecionadas: string[] | null;
  onChange: (novo: string[] | null) => void;
}

export function SeletorConquistasVisiveis({ selecionadas, onChange }: Props) {
  const { conquistas } = useXP();

  // Lista efetiva: null = todas as desbloqueadas
  const listaEfetiva =
    selecionadas === null
      ? CONQUISTAS.filter((c) => !!conquistas[c.id]).map((c) => c.id)
      : selecionadas;

  const toggle = (id: string) => {
    // Se estava null, materializa com as desbloqueadas atuais
    const base =
      selecionadas === null
        ? CONQUISTAS.filter((c) => !!conquistas[c.id]).map((c) => c.id)
        : [...selecionadas];

    const idx = base.indexOf(id);
    if (idx >= 0) base.splice(idx, 1);
    else base.push(id);

    onChange(base);
  };

  const marcarTodas = () => {
    onChange(CONQUISTAS.filter((c) => !!conquistas[c.id]).map((c) => c.id));
  };

  const desmarcarTodas = () => {
    onChange([]);
  };

  return (
    <div className="seletor-conquistas">
      <p className="field-section-title">
        <i className="fa-solid fa-eye" />
        <span>Conquistas no perfil</span>
      </p>
      <p className="seletor-conquistas-desc">
        Escolha quais conquistas os outros verão no seu perfil. Sem seleção
        = mostra todas as desbloqueadas.
      </p>

      <div className="seletor-conquistas-acoes">
        <button type="button" className="btn-mini" onClick={marcarTodas}>
          <i className="fa-solid fa-check-double" /> Todas
        </button>
        <button type="button" className="btn-mini" onClick={desmarcarTodas}>
          <i className="fa-solid fa-eraser" /> Nenhuma
        </button>
      </div>

      <div className="seletor-conquistas-grid">
        {CONQUISTAS.map((c) => {
          const desbloqueada = !!conquistas[c.id];
          const selecionada = listaEfetiva.includes(c.id);

          return (
            <button
              key={c.id}
              type="button"
              className={`seletor-conquista-item ${
                selecionada ? 'selecionada' : ''
              } ${c.raridade} ${!desbloqueada ? 'bloqueada' : ''}`}
              onClick={() => desbloqueada && toggle(c.id)}
              disabled={!desbloqueada}
              title={`${c.nome} — ${c.desc}${
                !desbloqueada ? ' (Bloqueada)' : ''
              }`}
            >
              <i className={c.icone} />
            </button>
          );
        })}
      </div>
    </div>
  );
}