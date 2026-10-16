import { usePushNotifications } from '../../hooks/usePushNotifications';
import { useToast } from '../../hooks/useToast';
import { useI18n } from '../../hooks/useI18n';

export function PushToggle() {
  const { suportado, permissao, pedirPermissao } = usePushNotifications();
  const { toast } = useToast();
  const { t } = useI18n();

  if (!suportado) return null;

  const handleToggle = async () => {
    if (permissao === 'granted') {
      toast(
        'Notificações já estão ativadas. Desative nas configurações do navegador.',
        'info'
      );
      return;
    }

    if (permissao === 'denied') {
      toast(
        'Notificações bloqueadas. Ative nas configurações do navegador.',
        'erro'
      );
      return;
    }

    const resultado = await pedirPermissao();

    if (resultado === 'granted') {
      toast('🔔 Notificações ativadas!', 'sucesso');

      setTimeout(() => {
        new Notification('Turma 2V', {
          body: 'Você vai receber avisos de novos recados aqui.',
          icon: '/img/icon-192.png',
        });
      }, 500);
    } else if (resultado === 'denied') {
      toast('Notificações bloqueadas pelo navegador.', 'erro');
    }
  };

  const ativo = permissao === 'granted';
  const bloqueado = permissao === 'denied';

  return (
    <button
      type="button"
      className={`push-toggle ${ativo ? 'ativo' : ''} ${bloqueado ? 'bloqueado' : ''}`}
      onClick={handleToggle}
      title={ativo ? t('notificacoes_ativas') : t('ativar_notificacoes')}
    >
      <i className={`fa-solid ${ativo ? 'fa-bell' : 'fa-bell-slash'}`} />
      <span>
        {ativo
          ? t('notificacoes_ativas')
          : bloqueado
          ? 'Notificações bloqueadas'
          : t('ativar_notificacoes')}
      </span>
    </button>
  );
}