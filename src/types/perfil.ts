// ==========================================
// 👥 TIPOS DE PERFIL PÚBLICO
// ==========================================

import type { PerfilAluno } from './usuario';
import type { InfoNivel } from './xp';

export interface PerfilModalDados extends PerfilAluno {
  nivelInfo?: InfoNivel;
  conquistas?: string[]; // IDs das conquistas visíveis
}