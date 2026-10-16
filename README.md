# 🚀 Portal Turma 2V | IFRN Caicó

![Status](https://img.shields.io/badge/Status-Em%20Produ%C3%A7%C3%A3o-success)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-10-FFCA28?style=flat&logo=firebase&logoColor=black)

Repositório oficial do site da **Turma 2V (1º Ano)** do curso técnico integrado em **Informática para Internet** do IFRN — Campus Caicó.

O projeto serve como vitrine dos nossos projetos, mural de recados, integração com o SUAP (notas, boletim, agenda acadêmica) e muito mais.

> 💡 **Migração:** este projeto era originalmente um site em HTML5, CSS3 e JavaScript puro. Foi migrado para **React + TypeScript + Vite** preservando 100% das funcionalidades, com melhorias de performance, segurança e arquitetura.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **[React 18](https://react.dev/)** — Componentização e estado reativo
- **[TypeScript](https://www.typescriptlang.org/)** — Tipagem estática
- **[Vite](https://vitejs.dev/)** — Build tool ultrarrápido + HMR
- **[React Router v6](https://reactrouter.com/)** — Rotas SPA
- **CSS com Variáveis** — Temas dinâmicos (5 cores + claro/escuro)
- **Google Fonts** + **Font Awesome** — Tipografia e ícones

### Backend / Integrações
- **[Firebase Realtime Database](https://firebase.google.com/)** — Dados em tempo real (mural, XP, perfis, cargos)
- **[Firebase Admin](https://firebase.google.com/docs/admin/setup)** — Escrita server-side
- **[SUAP](https://suap.ifrn.edu.br/)** — Integração acadêmica (login OAuth, notas, boletim)
- **[Google Calendar API](https://developers.google.com/calendar)** — Agenda da turma
- **[GitHub API](https://docs.github.com/en/rest)** — Listagem de projetos da turma
- **[Vercel Serverless Functions](https://vercel.com/docs/functions)** — Backend `/api/*`

---

## ✨ Funcionalidades

### 🌐 Site Público
- **Home** — Hero animado, curso, números, líderes, coordenadores, galeria, projetos do GitHub, contato e mascote
- **Tutorial** — Passo a passo ilustrado + FAQ animada
- **Multi-idioma** — pt-BR, English, Español
- **Temas** — 5 cores (roxo, azul, verde, rosa, laranja) + modo claro/escuro
- **PWA** — Instalável como app, funciona offline

### 🔐 Autenticação
- **Login SUAP** via OAuth2 (implicit grant)
- **Logout automático** em token expirado (401)
- **Sessão persistente** (cookie + localStorage)

### 🎮 Gamificação
- **Sistema de XP** com 10 níveis (Novato → Lenda)
- **Streak de acesso** (bônus por logins consecutivos)
- **24 conquistas** por raridade (comum → lendário)
- **Cargos** por ranking (com badge visual por raridade)
- **Mascote interativo** — dá carinho, desbloqueia skins, sobe no ranking

### 📊 Painel do Aluno
- **Notas** — Boletim direto do SUAP, simulador de médias, metas individuais, filtros, export CSV/PDF e histórico de períodos
- **Horários** — Quadro de aulas responsivo (tabela em desktop, cards em mobile)
- **Mural** — Recados com curtidas, comentários, edição, expiração automática e busca
- **Membros** — Grid de perfis com modal público (foto, bio, redes, nível, conquistas)
- **Agenda** — Calendário mensal + próximos eventos do Google Calendar
- **Perfil** — Edição de foto, bio, redes sociais, seletor de mascote e conquistas visíveis
- **Notificações** — Badge no título da aba, dropdown com recados novos e push notifications

### 🧑‍🏫 Sala dos Professores (admin)
- **Aba Alunos** — Tabela com média, faltas, carinhos, conquistas e cargo
- **Aba Em Risco** — Alunos com média baixa ou muitas faltas
- **Aba Engajamento** — Stats gerais + Top 10 carinhos
- **Recalcular Cargos** — Botão para rodar o ranking de cargos

---

## 📁 Estrutura do Projeto

```
SITE-2V-REACT/
├── api/                    → Backend Vercel (serverless functions)
├── public/                 → Arquivos estáticos (imagens, manifest, sw.js)
├── src/
│   ├── components/         → Componentes React
│   ├── contexts/           → Estados globais (Auth, XP, Mascote, Tema, i18n)
│   ├── hooks/              → Lógica reutilizável
│   ├── pages/              → Páginas (rotas)
│   ├── routes/             → Configuração do React Router
│   ├── services/           → Integrações (API, Firebase, SUAP, GitHub)
│   ├── styles/             → CSS global, login, mascote, tutorial
│   ├── types/              → Tipos TypeScript
│   └── utils/              → Helpers, constantes, i18n
├── index.html              → Shell do Vite
├── vite.config.ts          → Config do Vite
├── vercel.json             → Config do deploy
└── package.json
```

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- **Node.js** 24.x
- **npm** ou **yarn**
- Conta no **Firebase** (com Realtime Database)
- Credenciais de aplicação **SUAP**

### 1. Clonar
```bash
git clone https://github.com/infoWeb2026-2V/SITE-2V.git
cd SITE-2V-REACT
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
Cria um arquivo `.env.local` na raiz com base no `.env.example`:

```bash
# Firebase (client)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# Admin
VITE_MATRICULA_ADMIN=...
VITE_MATRICULAS_ADMIN=...

# SUAP
VITE_SUAP_URL=https://suap.ifrn.edu.br
VITE_SUAP_CLIENT_ID=...
VITE_SUAP_REDIRECT_URI=http://localhost:5173/login
VITE_SUAP_SCOPE=identificacao email documentos_pessoais

# Google Calendar
VITE_GCAL_API_KEY=...
VITE_GCAL_CALENDAR_ID=...

# GitHub
VITE_GITHUB_USERNAME=infoWeb2026-2V
```

### 4. Rodar em desenvolvimento
```bash
npm run dev
```

Abre em `http://localhost:5173`.

> ⚠️ **Para testar chamadas `/api/*` em dev**, roda o backend em outro terminal:
> ```bash
> vercel dev --listen 3000
> ```

### 5. Build de produção
```bash
npm run build
npm run preview
```

---

## 📜 Scripts Disponíveis

| Comando | O que faz |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm run preview` | Preview local do build |
| `npm run typecheck` | Checa tipos TypeScript |
| `npm run lint` | Roda ESLint |
| `npm run clean` | Limpa cache (`dist` + `.vite`) |

---

## 🌍 Deploy

O projeto está hospedado na **[Vercel](https://vercel.com/)**.

### Deploy automático
Todo push na branch `main` dispara um deploy automático.

### Deploy manual
```bash
vercel --prod
```

### Variáveis de ambiente
Todas as variáveis do `.env.local` precisam estar cadastradas no painel da Vercel em **Settings → Environment Variables**.

---

## 🤝 Como Contribuir

1. Faça um **fork** do projeto
2. Crie uma branch (`git checkout -b feature/minha-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push pra branch (`git push origin feature/minha-feature`)
5. Abra um **Pull Request**

### Padrão de commits
- `feat:` nova funcionalidade
- `fix:` correção de bug
- `chore:` tarefas de manutenção
- `docs:` documentação
- `refactor:` refatoração sem mudança funcional
- `style:` formatação, sem mudança lógica

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

## 👥 Autores

**Turma 2V — Informática para Internet | IFRN Campus Caicó**

- **Bela Cardoso** — Líder de sala
- **Samuel Nóbrega** — Vice-líder
- **Williams** — Coordenador de Mídia
- **Kleber** — Coordenador de Design
- **Jonas e Ayslan** — Coordenadores de HTML/CSS

---

## 📞 Contato

- **Instagram:** [@InfoWeb2026.1](https://instagram.com/InfoWeb2026.1)
- **GitHub:** [infoWeb2026-2V](https://github.com/infoWeb2026-2V)
- **TikTok:** [@infoweb2026_2v](https://www.tiktok.com/@infoweb2026_2v)
- **E-mail:** [infowebifrn2026@gmail.com](mailto:infowebifrn2026@gmail.com)

---

<p align="center">
  Feito com 💜 pela Turma 2V — IFRN Campus Caicó
</p>
