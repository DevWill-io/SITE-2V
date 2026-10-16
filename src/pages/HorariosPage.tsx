import { useMediaQuery } from '../hooks/useMediaQuery';

interface LinhaHorario {
  tipo: 'aula' | 'intervalo';
  horario: string;
  segunda: string;
  terca: string;
  quarta: string;
  quinta: string;
  sexta: string;
}

const HORARIOS: LinhaHorario[] = [
  { tipo: 'aula', horario: '13:00 - 13:45', segunda: 'Química', terca: 'Matemática I', quarta: 'Matemática I', quinta: 'Química', sexta: 'Língua Portuguesa e Literatura' },
  { tipo: 'aula', horario: '13:45 - 14:30', segunda: 'Química', terca: 'Matemática I', quarta: 'Matemática I', quinta: 'Química', sexta: 'Língua Portuguesa e Literatura' },
  { tipo: 'intervalo', horario: '14:30 - 14:50', segunda: 'I Intervalo', terca: '', quarta: '', quinta: '', sexta: '' },
  { tipo: 'aula', horario: '14:50 - 15:35', segunda: 'Introdução à Lógica e Programação', terca: 'Ed. Física', quarta: 'Introdução à Lógica e Programação', quinta: 'Sociologia I', sexta: 'Autoria Web' },
  { tipo: 'aula', horario: '15:35 - 16:20', segunda: 'Introdução à Lógica e Programação', terca: 'Ed. Física', quarta: 'Introdução à Lógica e Programação', quinta: 'Sociologia I', sexta: 'Autoria Web' },
  { tipo: 'intervalo', horario: '16:20 - 16:30', segunda: 'II Intervalo', terca: '', quarta: '', quinta: '', sexta: '' },
  { tipo: 'aula', horario: '16:30 - 17:15', segunda: 'Arte I', terca: 'Geografia I', quarta: 'Geografia I', quinta: 'Língua Portuguesa e Literatura', sexta: 'Princípios de Design' },
  { tipo: 'aula', horario: '17:15 - 18:00', segunda: 'Arte I', terca: 'Geografia I', quarta: 'Geografia I', quinta: 'Língua Portuguesa e Literatura', sexta: 'Princípios de Design' },
];

const DIAS = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'] as const;
const DIAS_LABEL: Record<string, string> = {
  segunda: 'Segunda',
  terca: 'Terça',
  quarta: 'Quarta',
  quinta: 'Quinta',
  sexta: 'Sexta',
};

export default function HorariosPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <section className="horarios-page">
        <div className="section-title">
          <h2>
            <span>Quadro de</span> <span className="highlight">Horários</span>
          </h2>
          <p>Nossa rotina semanal</p>
        </div>

        <div className="horarios-mobile">
          {DIAS.map((dia) => (
            <div key={dia} className="horario-dia-card">
              <h3 className="horario-dia-titulo">{DIAS_LABEL[dia]}</h3>
              <div className="horario-dia-aulas">
                {HORARIOS.map((h, i) => {
                  const ehIntervalo = h.tipo === 'intervalo';
                  const texto = ehIntervalo
                    ? h.horario === '14:30 - 14:50'
                      ? 'I Intervalo'
                      : 'II Intervalo'
                    : h[dia];

                  return (
                    <div
                      key={`${dia}-${i}`}
                      className={`horario-aula-item ${ehIntervalo ? 'intervalo' : ''}`}
                    >
                      <span className="horario-aula-hora">{h.horario}</span>
                      <span className="horario-aula-materia">{texto}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <p className="horario-legenda">
          <i className="fa-regular fa-calendar" /> Horário sujeito a alterações.
          Consulte o{' '}
          <a href="https://suap.ifrn.edu.br/" target="_blank" rel="noopener noreferrer">
            SUAP
          </a>{' '}
          para a versão oficial.
        </p>
      </section>
    );
  }

  return (
    <section className="horarios-page">
      <div className="section-title">
        <h2>
          <span>Quadro de</span> <span className="highlight">Horários</span>
        </h2>
        <p>Nossa rotina semanal</p>
      </div>

      <div className="horarios-tabela-wrapper">
        <table className="tabela-horarios-novo">
          <thead>
            <tr>
              <th>Horário</th>
              <th>Segunda</th>
              <th>Terça</th>
              <th>Quarta</th>
              <th>Quinta</th>
              <th>Sexta</th>
            </tr>
          </thead>
          <tbody>
            {HORARIOS.map((h, i) => {
              if (h.tipo === 'intervalo') {
                return (
                  <tr key={i} className="linha-intervalo">
                    <td>{h.horario}</td>
                    <td colSpan={5}>
                      {h.horario === '14:30 - 14:50' ? 'I Intervalo' : 'II Intervalo'}
                    </td>
                  </tr>
                );
              }
              return (
                <tr key={i}>
                  <td className="col-horario">{h.horario}</td>
                  <td>{h.segunda}</td>
                  <td>{h.terca}</td>
                  <td>{h.quarta}</td>
                  <td>{h.quinta}</td>
                  <td>{h.sexta}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="horario-legenda">
        <i className="fa-regular fa-calendar" /> Horário sujeito a alterações.
        Consulte o{' '}
        <a href="https://suap.ifrn.edu.br/" target="_blank" rel="noopener noreferrer">
          SUAP
        </a>{' '}
        para a versão oficial.
      </p>
    </section>
  );
}