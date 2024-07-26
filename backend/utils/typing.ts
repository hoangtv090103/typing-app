interface TypingSession {
  typedText: string;
  originalText: string;
  duration: number;
}

export const calculateWPM = (session: TypingSession): number => {
  const { typedText, duration } = session;

  // Calculate WPM
  const wordsTyped = typedText.split(" ").length;
  const wpm = wordsTyped / duration;

  return Math.round(wpm);
};

export const countCorrectChars = (
  typedText: string,
  originalText: string
): number => {
  let correctChars = 0;

  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] === originalText[i]) {
      correctChars++;
    }
  }

  return correctChars;
};

export const calculateAccuracy = (session: TypingSession): number => {
  const { typedText, originalText } = session;
  // Calculate the number of correct characters
  const correctChars = countCorrectChars(typedText, originalText);

  const accuracy = (correctChars / originalText.length) * 100;

  return Math.round(accuracy);
};

export const calculateMistakes = (session: TypingSession): number => {
  const { typedText, originalText } = session;
  let mistakes = 0;

  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] !== originalText[i]) {
      mistakes++;
    }
  }

  return mistakes;
};
