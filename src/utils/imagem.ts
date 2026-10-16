// ==========================================
// 🖼️ UTILITÁRIO DE IMAGEM
// ==========================================
// Comprime imagens no navegador antes de enviar pro servidor.
// Porta fiel do comprimirImagem() do login.js original.
// ==========================================

const MAX_FOTO_BYTES = 500 * 1024; // 500 KB

export function comprimirImagem(
  file: File,
  maxLado = 500,
  qualidade = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Arquivo não é uma imagem.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        if (width > height && width > maxLado) {
          height = Math.round((height * maxLado) / width);
          width = maxLado;
        } else if (height > maxLado) {
          width = Math.round((width * maxLado) / height);
          height = maxLado;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas não disponível.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        let qualidadeAtual = qualidade;
        let dataUrl = canvas.toDataURL('image/jpeg', qualidadeAtual);
        let tentativas = 0;

        while (
          dataUrl.length * 0.75 > MAX_FOTO_BYTES &&
          tentativas < 5 &&
          qualidadeAtual > 0.4
        ) {
          qualidadeAtual -= 0.12;
          dataUrl = canvas.toDataURL('image/jpeg', qualidadeAtual);
          tentativas++;
        }

        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Falha ao carregar imagem.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Falha ao ler arquivo.'));
    reader.readAsDataURL(file);
  });
}