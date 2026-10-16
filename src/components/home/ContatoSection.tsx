import { useI18n } from '../../hooks/useI18n';

export function ContatoSection() {
  const { t } = useI18n();

  return (
    <section id="contato" className="contato">
      <div className="container">
        <div className="section-title reveal">
          <h2>{t('contato_titulo')}</h2>
          <p>{t('contato_sub')}</p>
        </div>

        <div className="contato-grid">
          {/* ---- Instituição ---- */}
          <div className="contato-card reveal tilt-element">
            <div className="card-header">
              <i className="fa-solid fa-building-columns" />
              <h3>{t('contato_inst_t')}</h3>
            </div>
            <div className="card-body">
              <h4>IFRN - Campus Caicó</h4>
              <p>
                <i className="fa-solid fa-location-dot" />
                Rodovia RN 288, s/n - Nova Caicó, RN
                <br />
                CEP: 59300-000
              </p>
              <p>
                <i className="fa-solid fa-phone" /> (84) 4005-4102{' '}
                <em>(Ramal Caicó)</em>
              </p>
              <a href="mailto:seac.ca@ifrn.edu.br" className="link-destaque">
                <i className="fa-solid fa-envelope" /> seac.ca@ifrn.edu.br
              </a>
            </div>
          </div>

          {/* ---- Turma ---- */}
          <div
            className="contato-card reveal tilt-element"
            style={{ transitionDelay: '0.1s' }}
          >
            <div className="card-header">
              <i className="fa-solid fa-users" />
              <h3>{t('contato_turma_t')}</h3>
            </div>
            <div className="card-body">
              <h4>{t('contato_fale_t')}</h4>
              <p>{t('contato_fale_p')}</p>

              <div className="social-links-pessoal">
                <a
                  href="https://instagram.com/InfoWeb2026.1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-instagram" /> @InfoWeb2026.1
                </a>
                <a
                  href="https://github.com/infoWeb2026-2V"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-github" /> infoWeb2026-2V
                </a>
                <a
                  href="https://www.tiktok.com/@infoweb2026_2v"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-tiktok" /> @infoweb2026_2v
                </a>
                <a href="mailto:infowebifrn2026@gmail.com">
                  <i className="fa-solid fa-envelope" /> infowebifrn2026@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}