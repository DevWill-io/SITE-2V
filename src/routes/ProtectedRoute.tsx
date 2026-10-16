// ==========================================
// 🔒 ROTA PROTEGIDA
// ==========================================
// Bloqueia acesso se o usuário não está logado.
// Enquanto o AuthContext está validando, mostra Loader
// (evita o "flash" de tela de login).
// ==========================================

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader } from '../components/ui/Loader';
import { PATHS } from './paths';

export function ProtectedRoute() {
  const { status } = useAuth();

  if (status === 'carregando') return <Loader fullScreen />;
  if (status === 'deslogado') return <Navigate to={PATHS.LOGIN} replace />;

  return <Outlet />;
}