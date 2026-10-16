import { Link } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import { useTypingEffect } from '../../hooks/useTypingEffect';
import { useParticles } from '../../hooks/useParticles';
import { PATHS } from '../../routes/paths';
import { FraseDoDia } from './FraseDoDia';

const PALAVRAS = ['Informática.', 'Inovação.', 'Tecnologia.', 'Código.'];

export function HeroSection() {
  const { t } = useI18n();
  const particlesRef = useParticles(15, 8);
  const typing = useTypingEffect(PALAVRAS);

  return (
    <section id="inicio" className="hero hero-main">
      <div id="particles-container" ref={particlesRef} />
      <div className="hero-content">
        <img
          src="/img/2V.png"
          alt="Logo da Turma 2V"
          className="hero-logo"
          style={{ height: 245, width: 220 }}
        />

        <div className="badge">
          <i className="fa-solid fa-location-dot pulse-icon" />
          <span>{t('hero_badge')}</span>
        </div>

        <h1>
          <span>{t('hero_titulo_1')}</span>{' '}
          <span className="highlight">{t('hero_titulo_2')}</span>
        </h1>

        <div className="typing-container">
          <p>
            <span>{t('hero_typing_1')}</span>{' '}
            <span>{typing}</span>
            <span className="cursor">|</span>
          </p>
        </div>

        <div className="hero-actions">
          <a href="#curso" className="btn btn-primary">
            {t('hero_btn_curso')}
          </a>
          <Link to={PATHS.LOGIN} className="btn btn-outline btn-suap">
            <i className="fa-solid fa-id-card" />
            <span>{t('hero_btn_suap')}</span>
          </Link>
        </div>

        <FraseDoDia />
      </div>
    </section>
  );
}