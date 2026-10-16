// ==========================================
// 🗺️ ROTEADOR PRINCIPAL
// ==========================================
// Define todas as rotas do site. Usa layout aninhado:
//   - Rotas dentro do <Layout> ganham navbar + menu lateral + footer
//   - Rotas dentro do <ProtectedRoute> exigem login
//   - Rotas dentro do <AdminRoute> exigem ser admin
//
// Pra adicionar rota nova: adicione um <Route path="..."> aqui.
// ==========================================

import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { PainelLayout } from '../components/painel/PainelLayout';
import { EditarPerfilModal } from '../components/painel/EditarPerfilModal';
import { PATHS } from './paths';

// Páginas públicas
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import TutorialPage from '../pages/TutorialPage';
import NotFoundPage from '../pages/NotFoundPage';
import PlaceholderPage from '../pages/PlaceholderPage';

// Páginas do painel
import NotasPage from '../pages/NotasPage';
import MuralPage from '../pages/MuralPage';
import MembrosPage from '../pages/MembrosPage';
import AgendaPage from '../pages/AgendaPage';
import HorariosPage from '../pages/HorariosPage';

// Páginas de admin
import SalaProfessoresPage from '../pages/SalaProfessoresPage';

export function AppRouter() {
  // Modal de edição de perfil fica no App pra poder ser aberto
  // tanto do painel quanto do menu lateral (futuro)
  const [editarPerfilAberto, setEditarPerfilAberto] = useState(false);

  return (
    <>
      <Routes>
        {/* ==========================================
            ROTAS COM LAYOUT (navbar + menu + footer)
            ========================================== */}
        <Route element={<Layout />}>
          {/* ---- Públicas ---- */}
          <Route path={PATHS.HOME} element={<HomePage />} />
          <Route path={PATHS.TUTORIAL} element={<TutorialPage />} />

          {/* ==========================================
              ROTAS LOGADAS (Painel do Aluno)
              ========================================== */}
          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <PainelLayout
                  onEditarPerfil={() => setEditarPerfilAberto(true)}
                />
              }
            >
              {/* /painel redireciona pra primeira aba */}
              <Route
                path={PATHS.PAINEL}
                element={<Navigate to={PATHS.PAINEL_NOTAS} replace />}
              />

              {/* Tabs do painel */}
              <Route path={PATHS.PAINEL_NOTAS} element={<NotasPage />} />
              
              <Route path={PATHS.PAINEL_HORARIOS} element={<HorariosPage />} />
              
              <Route path={PATHS.PAINEL_MURAL} element={<MuralPage />} />
              <Route path={PATHS.PAINEL_MEMBROS} element={<MembrosPage />} />
              <Route path={PATHS.PAINEL_AGENDA} element={<AgendaPage />} />
            </Route>

            {/* Perfil público (ainda placeholder) */}
            <Route
              path={PATHS.PERFIL}
              element={<PlaceholderPage titulo="Perfil" />}
            />
          </Route>

          {/* ==========================================
              ROTAS ADMIN
              ========================================== */}
          <Route element={<AdminRoute />}>
            <Route path={PATHS.ADMIN_SALA} element={<SalaProfessoresPage />} />
          </Route>

          {/* ---- 404 ---- */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* ==========================================
            ROTAS SEM LAYOUT (tela própria)
            ========================================== */}
        <Route path={PATHS.LOGIN} element={<LoginPage />} />
      </Routes>

      {/* ==========================================
          MODAL DE EDIÇÃO DE PERFIL
          (fica fora do Router pra poder ser aberto
          de qualquer lugar do app via estado)
          ========================================== */}
      <EditarPerfilModal
        aberto={editarPerfilAberto}
        onFechar={() => setEditarPerfilAberto(false)}
      />
    </>
  );
}