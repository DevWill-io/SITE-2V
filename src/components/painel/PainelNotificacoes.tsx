import { useEffect, useRef, useState } from 'react';
import { useNotificacoes } from '../../hooks/useNotificacoes';
import { useI18n } from '../../hooks/useI18n';

export function PainelNotificacoes() {
  const { notificacoes, naoLidas, marcarLida, marcarTodasLidas } =
    useNotificacoes();
  const { t } = useI18n();
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 🆕 Atualiza o título da aba com o contador
  useEffect(() => {
    const tituloBase = t('titulo_pagina');
    if (naoLidas > 0) {
      document.title = `(${naoLidas > 9 ? '9+' : naoLidas}) ${tituloBase}`;
    } else {
      document.title = tituloBase;
    }

    return () => {
      document.title = tituloBase;
    };
  }, [naoLidas, t]);

  // Fecha ao clicar fora
  useEffect(() => {
    if (!aberto) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAberto(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [aberto]);

  return (
    <div className="painel-notif-wrapper" ref={ref}>
      <button
        type="button"
        className="btn-theme btn-notificacoes"
        onClick={() => setAberto((v) => !v)}
        aria-label={t('notificacoes')}
        title={t('notificacoes')}
      >
        <i className="fa-regular fa-bell" />
        {naoLidas > 0 && (
          <span className="badge-notif">
            {naoLidas > 9 ? '9+' : naoLidas}
          </span>
        )}
      </button>

      {aberto && (
        <div className="painel-notif-dropdown">
          <div className="painel-notif-header">
            <strong>
              <i className="fa-regular fa-bell" /> {t('notificacoes')}
            </strong>
            {naoLidas > 0 && (
              <button
                type="button"
                className="btn-mini"
                onClick={marcarTodasLidas}
              >
                <i className="fa-solid fa-check-double" /> {t('marcar_todas')}
              </button>
            )}
          </div>

          <div className="painel-notif-lista">
            {notificacoes.length === 0 ? (
              <p className="painel-notif-vazio">{t('sem_notif')}</p>
            ) : (
              notificacoes.slice(0, 20).map((n) => (
                <button
                  key={n.id}
                  type="button"
                  className={`painel-notif-item ${n.lida ? '' : 'nao-lida'}`}
                  onClick={() => marcarLida(n.id)}
                >
                  <div className="painel-notif-icone">
                    <i className={n.icone} />
                  </div>
                  <div className="painel-notif-corpo">
                    <span className="painel-notif-titulo">{n.titulo}</span>
                    <span className="painel-notif-desc">{n.descricao}</span>
                    <span className="painel-notif-data">
                      {new Date(n.data).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}