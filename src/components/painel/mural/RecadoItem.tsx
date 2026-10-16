import { useState } from 'react';
import { escaparHTML } from '../../../utils/validators';
import { calcularTempoRestante } from '../../../utils/format';
import type { RecadoProcessado } from '../../../types/recado';

interface Props {
  recado: RecadoProcessado;
  matricula: string | null;
  souAdmin: boolean;
  nomeAutor: string;
  fotoAutor: string;
  onCurtir: (id: string) => void;
  onExcluir: (id: string) => void;
  onEditar: (id: string, mensagem: string, duracao: number) => void;
  onComentar: (id: string, texto: string) => void;
  onExcluirComentario: (recadoId: string, comentarioId: string) => void;
}

export function RecadoItem({
  recado,
  matricula,
  souAdmin,
  nomeAutor,
  fotoAutor,
  onCurtir,
  onExcluir,
  onEditar,
  onComentar,
  onExcluirComentario,
}: Props) {
  const [comentariosAbertos, setComentariosAbertos] = useState(false);
  const [comentario, setComentario] = useState('');

  const ehAutor = recado.autor_matricula === matricula;
  const podeEditar = ehAutor || souAdmin;
  const curtiu = (recado.likes || []).includes(matricula || '');
  const totalLikes = (recado.likes || []).length;

  const comentarios = Object.entries(recado.comentarios || {}).map(([cId, c]) => ({
    cId,
    ...c,
  }));
  const totalComentarios = comentarios.length;

  const handleEditar = () => {
    const textoAtual = recado.mensagem;
    const nova = prompt('1/2 — Edite sua mensagem:', textoAtual);
    if (nova === null || !nova.trim()) return;
    const horasAtuais = recado.duracaoHoras || 168;
    const tempoStr = horasAtuais % 24 === 0 ? `${horasAtuais / 24}d` : `${horasAtuais}h`;
    const duracaoInput = prompt('2/2 — Duração (ex: 5h, 2d, 15d):', tempoStr);
    if (duracaoInput === null) return;
    onEditar(recado.id, nova.trim(), horasAtuais);
  };

  const handleComentar = () => {
    if (!comentario.trim()) return;
    onComentar(recado.id, comentario.trim());
    setComentario('');
  };

  // Detecta e converte URLs em links
  const renderMensagem = (texto: string) => {
    const escapado = escaparHTML(texto);
    const partes = escapado.split(/(https?:\/\/[^\s<]+)/g);
    return partes.map((parte, i) =>
      /^https?:\/\//.test(parte) ? (
        <a
          key={i}
          href={parte}
          target="_blank"
          rel="noopener noreferrer"
          className="recado-link"
        >
          {parte}
        </a>
      ) : (
        <span key={i}>{parte}</span>
      )
    );
  };

  return (
    <div className="recado-item">
      <div className="recado-header">
        <img src={fotoAutor} alt={nomeAutor} className="recado-avatar" />
        <span className="recado-nome">{nomeAutor}</span>
        <span className="recado-data">
          {calcularTempoRestante(recado.timestampCriacao, recado.duracaoHoras)}
        </span>
      </div>

      <p className="recado-mensagem">{renderMensagem(recado.mensagem)}</p>

      {recado.link_anexo && (
        <div className="recado-anexo">
          <a
            href={recado.link_anexo}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-solid fa-paperclip" /> Ver anexo
          </a>
        </div>
      )}

      <div className="recado-acoes">
        {podeEditar && (
          <button
            type="button"
            className="btn-like"
            onClick={handleEditar}
            title="Editar"
          >
            <i className="fa-solid fa-pen" />
          </button>
        )}
        {podeEditar && (
          <button
            type="button"
            className="btn-like btn-excluir"
            onClick={() => onExcluir(recado.id)}
            title="Excluir"
          >
            <i className="fa-solid fa-trash" />
          </button>
        )}

        <button
          type="button"
          className={`btn-like ${curtiu ? 'curtido' : ''}`}
          onClick={() => onCurtir(recado.id)}
          title="Curtir"
        >
          <i className={`fa-${curtiu ? 'solid' : 'regular'} fa-heart`} />
          <span>{totalLikes}</span>
        </button>

        <button
          type="button"
          className="btn-like"
          onClick={() => setComentariosAbertos((v) => !v)}
          title="Comentários"
        >
          <i className="fa-regular fa-comment" />
          <span>{totalComentarios}</span>
        </button>
      </div>

      {comentariosAbertos && (
        <div className="box-comentarios">
          {comentarios.length > 0 && (
            <div className="lista-comentarios">
              {comentarios.map((c) => {
                const podeExcluir =
                  c.autor_matricula === matricula || souAdmin;
                return (
                  <div key={c.cId} className="comentario-item">
                    <div className="comentario-texto">
                      <strong>{c.autor_nome}</strong> {renderMensagem(c.texto)}
                    </div>
                    {podeExcluir && (
                      <button
                        type="button"
                        className="btn-remover-comentario"
                        onClick={() =>
                          onExcluirComentario(recado.id, c.cId)
                        }
                        title="Remover"
                      >
                        <i className="fa-solid fa-xmark" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="comentario-form">
            <input
              type="text"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Escreva um comentário..."
              maxLength={200}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleComentar();
                }
              }}
            />
            <button
              type="button"
              onClick={handleComentar}
              disabled={!comentario.trim()}
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}