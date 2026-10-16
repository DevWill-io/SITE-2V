import { useMemo } from 'react';

const FRASES = [
  { texto: 'A melhor maneira de prever o futuro é criá-lo.', autor: 'Peter Drucker' },
  { texto: 'Código é poesia.', autor: 'WordPress' },
  { texto: 'Primeiro resolva o problema. Depois, escreva o código.', autor: 'John Johnson' },
  { texto: 'A tecnologia move o mundo.', autor: 'Steve Jobs' },
  { texto: 'Qualquer um pode escrever código que um computador entende. Bons programadores escrevem código que humanos entendem.', autor: 'Martin Fowler' },
  { texto: 'O segredo para progredir é começar.', autor: 'Mark Twain' },
  { texto: 'Não tenha medo de errar, tenha medo de não tentar.', autor: 'Desconhecido' },
];

export function FraseDoDia() {
  const frase = useMemo(() => {
    const hoje = new Date().toDateString();
    const idx =
      hoje.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) %
      FRASES.length;
    return FRASES[idx];
  }, []);

  return (
    <div className="frase-do-dia reveal">
      <i className="fa-solid fa-quote-left" />
      <p>&ldquo;{frase.texto}&rdquo;</p>
      <span>— {frase.autor}</span>
    </div>
  );
}