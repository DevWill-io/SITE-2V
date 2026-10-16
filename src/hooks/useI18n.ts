// ==========================================
// 🪝 HOOK — useI18n
// ==========================================
// Atalho tipado para consumir o I18nContext.
//
// Uso:
//   const { t, idioma, trocarIdioma } = useI18n();
//   <h1>{t('hero_titulo_1')}</h1>
// ==========================================

import { useContext } from 'react';
import { I18nContext } from '../contexts/I18nContext';

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error(
      'useI18n precisa estar dentro de <I18nProvider>. ' +
      'Verifique se o provider está no App.tsx.'
    );
  }
  return ctx;
}