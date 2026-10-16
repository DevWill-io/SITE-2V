import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { usePerfil } from '../../hooks/usePerfil';
import { useToast } from '../../hooks/useToast';
import { useXP } from '../../hooks/useXP';
import { apiPerfil } from '../../services/api';
import { comprimirImagem } from '../../utils/imagem';
import { emailValido, urlValida } from '../../utils/validators';
import { limparArroba } from '../../utils/format';
import type { RedesSociais, ConquistasVisiveisPayload } from '../../types/usuario';
import { SeletorMascote } from './SeletorMascote';
import { SeletorConquistasVisiveis } from './SeletorConquistasVisiveis';

interface Props {
  aberto: boolean;
  onFechar: () => void;
}

export function EditarPerfilModal({ aberto, onFechar }: Props) {
  const { user } = useAuth();
  const { perfil } = usePerfil();
  const { toast } = useToast();
  const { skinAtiva, definirSkinAtiva } = useXP();

  const [nome, setNome] = useState('');
  const [bio, setBio] = useState('');
  const [redes, setRedes] = useState<RedesSociais>({});
  const [fotoPreview, setFotoPreview] = useState('');
  const [fotoBase64, setFotoBase64] = useState<string | null>(null);
  const [mascoteSelecionado, setMascoteSelecionado] = useState('padrao');
  const [conquistasVisiveis, setConquistasVisiveis] = useState<string[] | null>(
    null
  );
  const [salvando, setSalvando] = useState(false);

  const inputFotoRef = useRef<HTMLInputElement>(null);

  // ==========================================
  // Carrega dados ao abrir
  // ==========================================
  useEffect(() => {
    if (!aberto) return;

    setNome(perfil?.nome || user?.nome || '');
    setBio(perfil?.bio || '');
    setRedes(perfil?.redes || {});
    setFotoPreview(perfil?.foto || user?.foto || '');
    setFotoBase64(null);
    setMascoteSelecionado(perfil?.mascoteAvatar || skinAtiva || 'padrao');

    // Conquistas visíveis: extrai do payload
    const cv = perfil?.conquistasVisiveis;
    if (cv === null || cv === undefined) {
      setConquistasVisiveis(null);
    } else if (cv.mostraTodas === false && cv.ativos) {
      setConquistasVisiveis(Object.keys(cv.ativos));
    } else {
      setConquistasVisiveis(null);
    }
  }, [aberto, perfil, user, skinAtiva]);

  // ==========================================
  // Upload de foto
  // ==========================================
  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast('Imagem muito grande (máx 5MB).', 'erro');
      return;
    }

    try {
      const dataUrl = await comprimirImagem(file);
      setFotoPreview(dataUrl);
      setFotoBase64(dataUrl);
    } catch (err) {
      toast('Erro: ' + (err as Error).message, 'erro');
    }
  };

  const handleRestaurarFoto = () => {
    setFotoPreview(user?.fotoOriginal || user?.foto || '');
    setFotoBase64(null);
    if (inputFotoRef.current) inputFotoRef.current.value = '';
  };

  // ==========================================
  // Salvar
  // ==========================================
  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim()) {
      toast('Informe um nome.', 'erro');
      return;
    }

    if (redes.email && !emailValido(redes.email)) {
      toast('Email inválido.', 'erro');
      return;
    }

    if (redes.site && !urlValida(redes.site)) {
      toast('Site deve começar com http:// ou https://', 'erro');
      return;
    }

    // Monta payload de conquistas visíveis
    let payloadCV: ConquistasVisiveisPayload | null = null;
    if (conquistasVisiveis !== null) {
      if (conquistasVisiveis.length === 0) {
        payloadCV = { mostraTodas: false };
      } else {
        const ativos: Record<string, true> = {};
        conquistasVisiveis.forEach((id) => (ativos[id] = true));
        payloadCV = { mostraTodas: false, ativos };
      }
    }

    setSalvando(true);

    try {
      await apiPerfil.update({
        nome: nome.trim(),
        bio: bio.trim().slice(0, 160),
        foto: fotoBase64 || perfil?.foto || user?.foto,
        redes: {
          tiktok: limparArroba(redes.tiktok || ''),
          instagram: limparArroba(redes.instagram || ''),
          github: limparArroba(redes.github || ''),
          email: redes.email?.trim() || '',
          site: redes.site?.trim() || '',
        },
        mascoteAvatar: mascoteSelecionado,
        conquistasVisiveis: payloadCV,
      });

      // Aplica skin ativa também no XPContext
      if (mascoteSelecionado !== skinAtiva) {
        await definirSkinAtiva(mascoteSelecionado);
      }

      toast('Perfil atualizado!', 'sucesso');
      onFechar();
    } catch (err) {
      toast('Erro: ' + (err as Error).message, 'erro');
    } finally {
      setSalvando(false);
    }
  };

  if (!aberto) return null;

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div
        className="modal-content modal-editar-perfil"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onFechar}
          aria-label="Fechar"
        >
          ×
        </button>

        <h2 className="modal-title">
          <i className="fa-solid fa-user-pen" />
          <span>Editar Perfil</span>
        </h2>
        <p className="modal-subtitle">
          Personalize como você aparece para a turma.
        </p>

        <form onSubmit={handleSalvar}>
          {/* ==========================================
              FOTO
              ========================================== */}
          <div className="avatar-edit-area">
            <img
              src={fotoPreview}
              alt="Preview"
              className="edit-avatar"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(nome || 'U')}&background=random`;
              }}
            />
            <div className="avatar-actions">
              <label htmlFor="edit-foto-input" className="btn-upload">
                <i className="fa-solid fa-camera" />
                <span>Trocar foto</span>
              </label>
              <input
                ref={inputFotoRef}
                type="file"
                id="edit-foto-input"
                accept="image/*"
                onChange={handleFotoChange}
                hidden
              />
              <button
                type="button"
                className="btn-restaurar"
                onClick={handleRestaurarFoto}
                title="Voltar para a foto do SUAP"
              >
                <i className="fa-solid fa-rotate-left" /> SUAP
              </button>
            </div>
            <small className="avatar-hint">
              JPG/PNG até 5MB — será otimizada.
            </small>
          </div>

          {/* ==========================================
              NOME + BIO
              ========================================== */}
          <label className="field-label" htmlFor="edit-nome">
            Nome de exibição
          </label>
          <input
            type="text"
            id="edit-nome"
            value={nome}
            onChange={(e) => setNome(e.target.value.slice(0, 30))}
            placeholder="Como quer ser chamado"
            maxLength={30}
            required
          />

          <label className="field-label" htmlFor="edit-bio">
            Bio <span className="char-counter-inline">{bio.length}/160</span>
          </label>
          <textarea
            id="edit-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value.replace(/[\r\n]+/g, ' '))}
            placeholder="Fale um pouco sobre você..."
            maxLength={160}
            rows={3}
          />

          {/* ==========================================
              REDES SOCIAIS
              ========================================== */}
          <p className="field-section-title">
            <i className="fa-solid fa-share-nodes" />
            <span>Redes sociais</span>
          </p>

          <div className="redes-grid">
            <div className="input-icon">
              <i className="fa-brands fa-tiktok" />
              <input
                type="text"
                value={redes.tiktok ? `@${limparArroba(redes.tiktok)}` : ''}
                onChange={(e) =>
                  setRedes({ ...redes, tiktok: e.target.value })
                }
                placeholder="@usuario"
                maxLength={30}
              />
            </div>
            <div className="input-icon">
              <i className="fa-brands fa-instagram" />
              <input
                type="text"
                value={
                  redes.instagram ? `@${limparArroba(redes.instagram)}` : ''
                }
                onChange={(e) =>
                  setRedes({ ...redes, instagram: e.target.value })
                }
                placeholder="@usuario"
                maxLength={30}
              />
            </div>
            <div className="input-icon">
              <i className="fa-brands fa-github" />
              <input
                type="text"
                value={redes.github ? `@${limparArroba(redes.github)}` : ''}
                onChange={(e) =>
                  setRedes({ ...redes, github: e.target.value })
                }
                placeholder="@usuario"
                maxLength={30}
              />
            </div>
            <div className="input-icon">
              <i className="fa-solid fa-envelope" />
              <input
                type="email"
                value={redes.email || ''}
                onChange={(e) =>
                  setRedes({ ...redes, email: e.target.value })
                }
                placeholder="email@exemplo.com"
                maxLength={80}
              />
            </div>
            <div className="input-icon input-icon-full">
              <i className="fa-solid fa-globe" />
              <input
                type="url"
                value={redes.site || ''}
                onChange={(e) => setRedes({ ...redes, site: e.target.value })}
                placeholder="https://seusite.com"
                maxLength={120}
              />
            </div>
          </div>

          {/* ==========================================
              SELETOR DE MASCOTE
              ========================================== */}
          <SeletorMascote
            selecionado={mascoteSelecionado}
            onSelecionar={setMascoteSelecionado}
          />

          {/* ==========================================
              CONQUISTAS VISÍVEIS
              ========================================== */}
          <SeletorConquistasVisiveis
            selecionadas={conquistasVisiveis}
            onChange={setConquistasVisiveis}
          />

          {/* ==========================================
              BOTÕES
              ========================================== */}
          <div className="modal-actions">
            <button
              type="button"
              className="button btn-cancelar"
              onClick={onFechar}
              disabled={salvando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="button is-success"
              disabled={salvando}
            >
              {salvando ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" /> Salvando...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-floppy-disk" /> Salvar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}