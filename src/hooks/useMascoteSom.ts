// ==========================================
// 🔊 HOOK — Som do mascote (Web Audio API)
// ==========================================
// Porta fiel do tocarSom() do mascote.js original.
// ==========================================

import { useCallback, useRef, useState } from 'react';
import { STORAGE_KEYS, lsGetBool, lsSetBool } from '../utils/storage';

export type TipoSomMascote = 'carinho' | 'marco' | 'limite' | 'desbloqueio';

export function useMascoteSom() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [somLigado, setSomLigado] = useState(() =>
    lsGetBool(STORAGE_KEYS.MASCOTE_SOM, true)
  );

  const tocarSom = useCallback(
    (tipo: TipoSomMascote = 'carinho') => {
      if (!somLigado) return;
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext })
              .webkitAudioContext
          )();
        }
        const ctx = audioCtxRef.current;

        if (tipo === 'carinho') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.08);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
          osc.start();
          osc.stop(ctx.currentTime + 0.15);
          return;
        }

        const escalas: Record<Exclude<TipoSomMascote, 'carinho'>, number[]> = {
          marco: [523.25, 659.25, 783.99, 1046.5],
          limite: [523.25, 659.25, 783.99, 1046.5, 1318.5],
          desbloqueio: [659.25, 880, 1046.5, 1318.5, 1567.98],
        };

        const escala = escalas[tipo];
        escala.forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          if (tipo === 'desbloqueio') o.type = 'triangle';
          o.frequency.value = freq;
          const dur = tipo === 'desbloqueio' ? 0.4 : tipo === 'limite' ? 0.35 : 0.2;
          const delay = tipo === 'desbloqueio' ? 0.1 : tipo === 'limite' ? 0.12 : 0.08;
          const t0 = ctx.currentTime + i * delay;
          g.gain.setValueAtTime(0.15, t0);
          g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
          o.start(t0);
          o.stop(t0 + dur);
        });
      } catch {
        /* ignora erros de áudio */
      }
    },
    [somLigado]
  );

  const toggleSom = useCallback(() => {
    const novo = !somLigado;
    lsSetBool(STORAGE_KEYS.MASCOTE_SOM, novo);
    setSomLigado(novo);
    return novo;
  }, [somLigado]);

  return { somLigado, tocarSom, toggleSom };
}