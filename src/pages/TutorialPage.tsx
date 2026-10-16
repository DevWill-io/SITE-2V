import { useCallback, useState, type MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PATHS } from '../routes/paths';

const OFFSET_NAVBAR = 100;

// ==========================================
// COMPONENTE: Passo numerado
// ==========================================
interface PassoProps {
  numero: number;
  icone: string;
  titulo: string;
  descricao: string;
  delay?: number;
}

function Passo({ numero, icone, titulo, descricao, delay = 0 }: PassoProps) {
  return (
    <div
      className="curso-card reveal tilt-element"
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      <div className="passo-icone-wrap">
        <i className={icone} />
        <span className="passo-numero">{numero}</span>
      </div>
      <h3>{titulo}</h3>
      <p>{descricao}</p>
    </div>
  );
}

// ==========================================
// COMPONENTE: FAQ com animação
// ==========================================
interface FaqItemData {
  pergunta: string;
  resposta: string;
}

function Faq({ item }: { item: FaqItemData }) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className={`faq-item ${aberto ? 'aberto' : ''}`}>
      <button
        type="button"
        className="faq-pergunta"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
      >
        <i className="fa-solid fa-circle-question faq-icone" />
        <span className="faq-texto">{item.pergunta}</span>
        <i className="fa-solid fa-chevron-down faq-seta" />
      </button>
      <div className="faq-resposta-wrapper">
        <div className="faq-resposta-inner">
          <div className="faq-resposta">{item.resposta}</div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// PÁGINA
// ==========================================
export default function TutorialPage() {
  const { status } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const logado = status === 'logado';

  // ==========================================
  // Scroll manual pra âncora da Home
  // ==========================================
  const irParaAncora = useCallback(
    (ancora: string) => {
      const rolar = () => {
        const el = document.getElementById(ancora);
        if (!el) return;
        const y =
          el.getBoundingClientRect().top + window.scrollY - OFFSET_NAVBAR;
        window.scrollTo({ top: y, behavior: 'smooth' });
        window.history.replaceState(null, '', `/#${ancora}`);
      };

      if (location.pathname === '/') {
        rolar();
        return;
      }

      navigate('/');
      setTimeout(rolar, 150);
    },
    [location.pathname, navigate]
  );

  const handleAtalhoClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>, ancora: string) => {
      e.preventDefault();
      irParaAncora(ancora);
    },
    [irParaAncora]
  );

  // ==========================================
  // Dados
  // ==========================================
  const passos = [
    {
      icone: 'fa-solid fa-right-to-bracket',
      titulo: 'Faça login com SUAP',
      descricao:
        'Clique em "Acessar SUAP" na Home ou acesse /login. Você será redirecionado para o portal oficial do IFRN para autenticar com suas credenciais institucionais.',
    },
    {
      icone: 'fa-solid fa-chart-line',
      titulo: 'Veja suas notas',
      descricao:
        'Depois de logado, sua aba "Notas" mostra o boletim atualizado direto do SUAP, com simulador de médias, metas individuais, gráfico de evolução e exportação em CSV/PDF.',
    },
    {
      icone: 'fa-solid fa-comments',
      titulo: 'Participe do mural',
      descricao:
        'Deixe recados para a turma, curta e comente nas mensagens dos colegas. Você ganha XP por interagir e sobe de nível no ranking!',
    },
    {
      icone: 'fa-solid fa-user-pen',
      titulo: 'Personalize seu perfil',
      descricao:
        'Troque sua foto, escreva uma bio, adicione suas redes sociais e escolha seu mascote. Tudo aparece para os colegas da turma.',
    },
    {
      icone: 'fa-solid fa-paw',
      titulo: 'Interaja com o mascote',
      descricao:
        'Cada carinho no mascote te dá XP e desbloqueia skins exclusivas. Tem skin do Simpson, do Mafioso, do Jojo e várias outras. Bora desbloquear todas?',
    },
    {
      icone: 'fa-solid fa-trophy',
      titulo: 'Suba no ranking',
      descricao:
        'Você ganha XP ao postar no mural, ver o boletim, definir metas, usar o simulador e dar carinho no mascote. Desbloqueie conquistas e apareça no Top 10!',
    },
  ];

  const faqs: FaqItemData[] = [
    {
      pergunta: 'Preciso pagar alguma coisa pra usar?',
      resposta:
        'Não! O site é 100% gratuito e feito pela própria turma. Nenhum dado é vendido ou compartilhado com terceiros.',
    },
    {
      pergunta: 'Meus dados do SUAP ficam salvos aqui?',
      resposta:
        'Não. O login acontece direto no site oficial do SUAP (suap.ifrn.edu.br). O site só recebe um token temporário que permite buscar suas notas. Suas credenciais nunca passam por aqui.',
    },
    {
      pergunta: 'Como ganho XP?',
      resposta:
        'Postando no mural (+10), comentando (+3), curtindo (+1), vendo o boletim (+5), definindo metas (+5), usando o simulador (+2), trocando avatar (+5), e dando carinho no mascote (+1). Login diário também dá bônus de XP.',
    },
    {
      pergunta: 'Por quanto tempo meu recado fica no mural?',
      resposta:
        'Você escolhe! Ao postar, pode definir 1 dia, 7 dias ou 15 dias. Depois disso, o recado é removido automaticamente.',
    },
    {
      pergunta: 'O que são as conquistas?',
      resposta:
        'São medalhas que você desbloqueia cumprindo certas metas (dar 100 carinhos, atingir o nível 5, fazer 7 dias seguidos de login, etc). Aparecem no seu perfil público e dão XP extra.',
    },
    {
      pergunta: 'Como instalo o site como app no celular?',
      resposta:
        'No Chrome (Android): menu ⋮ → "Instalar app" ou "Adicionar à tela inicial". No iOS Safari: botão de compartilhar → "Adicionar à Tela de Início". O site vira um app de verdade!',
    },
    {
      pergunta: 'Encontrei um bug. Como reporto?',
      resposta:
        'Manda um e-mail pra infowebifrn2026@gmail.com ou abre uma issue no GitHub (github.com/infoWeb2026-2V). Todo feedback é bem-vindo!',
    },
  ];

  const atalhos = [
    { ancora: 'mascote', icone: 'fa-solid fa-paw', titulo: 'Mascote', desc: 'Dê carinho e desbloqueie skins' },
    { ancora: 'galeria', icone: 'fa-solid fa-images', titulo: 'Galeria', desc: 'Veja as fotos da turma' },
    { ancora: 'projetos', icone: 'fa-solid fa-code', titulo: 'Projetos', desc: 'Nossos repositórios no GitHub' },
    { ancora: 'contato', icone: 'fa-solid fa-envelope', titulo: 'Contato', desc: 'Redes sociais e e-mail da turma' },
  ];

  return (
    <main>
      {/* ==========================================
          HERO
          ========================================== */}
      <section
        className="hero hero-main"
        style={{ minHeight: '60vh', paddingTop: 140 }}
      >
        <div className="hero-content">
          <div className="badge">
            <i className="fa-solid fa-graduation-cap pulse-icon" />
            <span>Tutorial</span>
          </div>

          <h1>
            Como usar o <span className="highlight">Site da Turma</span>
          </h1>

          <p
            style={{
              color: 'var(--text-muted)',
              maxWidth: 640,
              margin: '20px auto 0',
              fontSize: '1.05rem',
              lineHeight: 1.7,
            }}
          >
            Um guia rápido de tudo que você pode fazer aqui: do login SUAP
            às skins do mascote.
          </p>
        </div>
      </section>

      {/* ==========================================
          PASSO A PASSO
          ========================================== */}
      <section className="curso">
        <div className="container">
          <div className="section-title reveal">
            <h2>
              <span>Passo a</span>{' '}
              <span className="highlight">Passo</span>
            </h2>
            <p>Comece por aqui se é sua primeira vez</p>
          </div>

          <div className="curso-grid">
            {passos.map((p, i) => (
              <Passo
                key={p.titulo}
                numero={i + 1}
                icone={p.icone}
                titulo={p.titulo}
                descricao={p.descricao}
                delay={i * 0.05}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          CTA DE LOGIN (só se deslogado)
          ========================================== */}
      {!logado && (
        <section className="tutorial-cta-section">
          <div className="container">
            <div className="tutorial-cta reveal">
              <div className="tutorial-cta-glow" />
              <i className="fa-solid fa-id-card tutorial-cta-icone" />
              <h3>Pronto pra começar?</h3>
              <p>
                Faça login com sua conta SUAP e explore todas as
                funcionalidades do site da turma.
              </p>
              <Link to={PATHS.LOGIN} className="btn-suap-cta">
                <i className="fa-solid fa-right-to-bracket" />
                Acessar SUAP
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ==========================================
          FAQ
          ========================================== */}
      <section className="contato">
        <div className="container">
          <div className="section-title reveal">
            <h2>
              <span>Perguntas</span>{' '}
              <span className="highlight">Frequentes</span>
            </h2>
            <p>Tire suas dúvidas</p>
          </div>

          <div className="faq-lista">
            {faqs.map((f) => (
              <Faq key={f.pergunta} item={f} />
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          ATALHOS ÚTEIS
          ========================================== */}
      <section className="tecnologias">
        <div className="container">
          <div className="section-title reveal">
            <h2>
              <span>Atalhos</span>{' '}
              <span className="highlight">Úteis</span>
            </h2>
            <p>Links rápidos pras seções da Home</p>
          </div>

          <div className="curso-grid">
            {atalhos.map((a, i) => (
              <button
                key={a.ancora}
                type="button"
                className="tutorial-atalho reveal tilt-element"
                style={{ transitionDelay: `${i * 0.1}s` }}
                onClick={(e) => handleAtalhoClick(e, a.ancora)}
              >
                <i className={a.icone} />
                <h3>{a.titulo}</h3>
                <p>{a.desc}</p>
                <span className="tutorial-atalho-seta">
                  Ir para a seção →
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}