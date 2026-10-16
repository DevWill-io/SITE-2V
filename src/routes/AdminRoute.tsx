// ==========================================
// 👑 ROTA ADMIN
// ==========================================
// Só admin entra. Se não é admin, redireciona pra Home.
//
// ⚠️ A proteção REAL está no backend /api/*.
//     Isso aqui só evita que um aluno comum veja a tela por acidente.
// ==========================================

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader } from '../components/ui/Loader';
import { PATHS } from './paths';

export function AdminRoute() {
  const { status, isAdmin } = useAuth();

  if (status === 'carregando') return <Loader fullScreen />;
  if (status === 'deslogado') return <Navigate to={PATHS.LOGIN} replace />;
  if (!isAdmin) return <Navigate to={PATHS.HOME} replace />;

  return <Outlet />;
}