import { useCallback, useEffect, useState } from 'react';

type Permissao = 'default' | 'granted' | 'denied';

export function usePushNotifications() {
  const [permissao, setPermissao] = useState<Permissao>('default');
  const [suportado, setSuportado] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window)) return;

    setSuportado(true);
    setPermissao(Notification.permission as Permissao);
  }, []);

  const pedirPermissao = useCallback(async (): Promise<Permissao> => {
    if (!suportado) return 'denied';
    try {
      const resultado = await Notification.requestPermission();
      setPermissao(resultado as Permissao);
      return resultado as Permissao;
    } catch {
      return 'denied';
    }
  }, [suportado]);

  const notificar = useCallback(
    (titulo: string, opcoes?: NotificationOptions) => {
      if (!suportado || permissao !== 'granted') return null;
      try {
        const notif = new Notification(titulo, {
          icon: '/img/icon-192.png',
          badge: '/img/icon-192.png',
          ...opcoes,
        });
        setTimeout(() => notif.close(), 8000);
        return notif;
      } catch {
        return null;
      }
    },
    [suportado, permissao]
  );

  return { suportado, permissao, pedirPermissao, notificar };
}