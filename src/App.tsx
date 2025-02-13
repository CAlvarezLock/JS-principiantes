import { useEffect, useState, useRef } from 'react';
import { HangImage } from './components/HangImage';
import { letters } from './helpers/letters';
import { getNextWord } from './helpers/getNextWord';

import './App.css';

function App() {
  const wordIndex = useRef(0);  // Índice de la palabra actual
  const [word, setWord] = useState<string>(getNextWord(wordIndex.current));  // Inicializa con la primera palabra
  const [hiddenWord, setHiddenWord] = useState<string>('_ '.repeat(word.length).trim());  // Inicializa con guiones bajos separados
  const [attempts, setAttempts] = useState(0);  // Intentos fallidos
  const [lose, setLose] = useState(false);  // Estado de derrota
  const [win, setWin] = useState(false);  // Estado de victoria

  // Verifica si el jugador ha perdido
  useEffect(() => {
    if (attempts >= 9) {
      setLose(true);
    }
  }, [attempts]);

  // Verifica si el jugador ha ganado
  useEffect(() => {
    if (hiddenWord.replace(/ /g, '') === word) {  // Ignora los espacios al comparar
      setWin(true);
    }
  }, [hiddenWord, word]);

  // Maneja la lógica cuando el jugador hace clic en una letra
  const checkLetter = (letter: string) => {
    if (lose || win) return;  // No hacer nada si el juego ya terminó

    if (!word.includes(letter)) {
      setAttempts((prev) => Math.min(prev + 1, 9));  // Incrementa los intentos fallidos
      return;
    }

    // Revela las letras adivinadas
    const hiddenWordArray = hiddenWord.split(' ');
    for (let i = 0; i < word.length; i++) {
      if (word[i] === letter) {
        hiddenWordArray[i] = letter;
      }
    }
    setHiddenWord(hiddenWordArray.join(' '));  // Mantiene los espacios entre letras
  };

  // Reinicia el juego con la misma palabra
  const newTry = () => {
    setHiddenWord('_ '.repeat(word.length).trim());  // Reinicia con guiones bajos separados
    setAttempts(0);
    setLose(false);
    setWin(false);
  };

  // Cambia a la siguiente palabra
  const nextWord = () => {
    wordIndex.current = (wordIndex.current + 1) % 4;  // Cambia al siguiente índice
    const newWord = getNextWord(wordIndex.current);  // Obtén la nueva palabra
    setWord(newWord);
    setHiddenWord('_ '.repeat(newWord.length).trim());  // Inicializa con guiones bajos separados
    setAttempts(0);
    setLose(false);
    setWin(false);
  };

  return (
    <div className="App">
      <HangImage imageNumber={attempts} />

      <h3>{hiddenWord}</h3>

      {lose && <h2> Buuuuuu 🥹 </h2>}
      {win && <h2> Wiiiiiii 💚💚💚 </h2>}

      {letters.map((letter) => (
        <button onClick={() => checkLetter(letter)} key={letter} disabled={lose || win}>
          {letter}
        </button>
      ))}

      <br /><br />
      <button onClick={newTry} disabled={win}>Intenta de nuevo</button>

      <br /><br />
      <button onClick={nextWord} disabled={!win}>Siguiente</button>
    </div>
  );
}

export default App;









