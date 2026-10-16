import { useEffect } from 'react';

export function useConsoleEasterEgg() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const emoji = '🐾';
    const estiloTitulo =
      'font-size: 18px; font-weight: bold; color: #8B5EDD; padding: 4px 0;';
    const estiloSub = 'font-size: 12px; color: #CEBDEC; padding: 2px 0;';
    const estiloHint = 'font-size: 12px; color: #a78bfa; padding: 2px 0;';

    console.log(
      `%c${emoji} Turma 2V — IFRN Campus Caicó`,
      estiloTitulo
    );
    console.log(
      '%cOlá, dev curioso(a)! 👋 Esse é o novo site da turma 2V, agora em React.',
      estiloSub
    );
    console.log(
      '%cSe você tá vendo isso, é porque abriu o F12. Isso é uma qualidade! 🔍',
      estiloHint
    );
    console.log(
      '%c💡 Dica: dá um "carinho" no mascote lá embaixo pra ganhar XP.',
      estiloHint
    );
    console.log(
      '%c🐙 Contribua: github.com/infoWeb2026-2V',
      estiloHint
    );
  }, []);
}