// src/components/TypingTest.tsx
import React, { useState, useEffect, useRef } from "react";
import "./TypingTest.css";

interface TypingTestProps {
  sampleText: string;
  onComplete: (wpm: number, accuracy: number) => void;
}

const TypingTest: React.FC<TypingTestProps> = ({
  sampleText,
  onComplete,
}) => {
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Reset state when sample text changes
    setUserInput("");
    setStartTime(null);
    setErrors(0);
  }, [sampleText]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (startTime === null) {
      setStartTime(Date.now());
    }

    const input = e.target.value;
    setUserInput(input);

    // Calculate errors
    let errorCount = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] !== sampleText[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);

    // Check if typing is complete
    if (input === sampleText) {
      const endTime = Date.now();
      const timeTaken = (endTime - startTime!) / 1000; // time in seconds
      const wordsTyped = sampleText.split(" ").length;
      const wpm = (wordsTyped / timeTaken) * 60;
      const accuracy = ((sampleText.length - errorCount) / sampleText.length) * 100;
      onComplete(wpm, accuracy);
    }
  };

  const getCharacterClass = (charIndex: number) => {
    if (charIndex < userInput.length) {
      return userInput[charIndex] === sampleText[charIndex]
        ? "correct"
        : "incorrect";
    }
    return "";
  };

  return (
    <div className="typing-test">
      <div className="sample-text">
        {sampleText.split("").map((char, index) => (
          <span key={index} className={getCharacterClass(index)}>
            {char}
          </span>
        ))}
      </div>
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        className="typing-input"
        placeholder="Start typing..."
        autoFocus
      />
      <div className="status">
        <p>Errors: {errors}</p>
      </div>
    </div>
  );
};

export default TypingTest;
