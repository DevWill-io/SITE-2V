import { useState } from 'react';
import { useI18n } from '../../../hooks/useI18n';

interface Props {
  onPublicar: (mensagem: string, link: string, duracao: string) => Promise<boolean>;
}

export function MuralForm({ onPublicar }: Props) {
  const { t } = useI18n();
  const [mensagem, setMensagem] = useState('');
  const [link, setLink] = useState('');
  const [duracao, setDuracao] = useState('7');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensagem.trim() || enviando) return;

    setEnviando(true);
    const ok = await onPublicar(mensagem.trim(), link.trim(), duracao);
    setEnviando(false);

    if (ok) {
      setMensagem('');
      setLink('');
      setDuracao('7');
    }
  };

  return (
    <form className="form-recado" onSubmit={handleSubmit}>
      <div className="textarea-wrapper">
        <textarea
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value.slice(0, 200))}
          placeholder={t('recado_msg')}
          rows={3}
          maxLength={200}
          required
        />
        <div className="char-counter">
          <span>{mensagem.length}</span>/200
        </div>
      </div>

      <input
        type="url"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder={t('recado_link')}
        className="input-url"
      />

      <div className="form-recado-footer">
        <div className="form-recado-duracao">
          <label htmlFor="recado-duracao">
            <i className="fa-regular fa-clock" />
            <span>{t('expirar_em')}</span>
          </label>
          <select
            id="recado-duracao"
            value={duracao}
            onChange={(e) => setDuracao(e.target.value)}
          >
            <option value="1">{t('dia_1')}</option>
            <option value="7">{t('dias_7')}</option>
            <option value="15">{t('dias_15')}</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={enviando || !mensagem.trim()}
        >
          {enviando ? (
            <>
              <i className="fa-solid fa-spinner fa-spin" /> Enviando...
            </>
          ) : (
            <>
              <i className="fa-regular fa-paper-plane" />
              <span>{t('publicar')}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}