import { useEffect, useState } from 'react';

export function useTypingEffect(
  words: string[],
  typeSpeed = 100,
  deleteSpeed = 40,
  pauseTime = 2000
): string {
  const [texto, setTexto] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentWord = words[wordIndex] || '';
    let timeout: ReturnType<typeof setTimeout>;

    if (isDeleting) {
      if (charIndex === 0) {
        setIsDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      } else {
        timeout = setTimeout(() => {
          setTexto(currentWord.substring(0, charIndex - 1));
          setCharIndex((i) => i - 1);
        }, deleteSpeed);
      }
    } else {
      if (charIndex === currentWord.length) {
        timeout = setTimeout(() => setIsDeleting(true), pauseTime);
      } else {
        timeout = setTimeout(() => {
          setTexto(currentWord.substring(0, charIndex + 1));
          setCharIndex((i) => i + 1);
        }, typeSpeed);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex, words, typeSpeed, deleteSpeed, pauseTime]);

  return texto;
}