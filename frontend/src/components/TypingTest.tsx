// src/components/TypingTest.tsx
import React, { useState, useEffect, useRef } from "react";
import "./TypingTest.css";

interface TypingTestProps {
  sampleText: string;
  onComplete: (sessionData: {
    wpm: number;
    accuracy: number;
    mistakes: number;
    duration: number;
    typedText: string;
  }) => void;
}

const TypingTest: React.FC<TypingTestProps> = ({ sampleText, onComplete }) => {
  const [userInput, setUserInput] = useState("");
  const [errors, setErrors] = useState<number>(0);
  const [duration, setDuration] = useState<number>(30); // Default to 30 seconds
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTypingStarted, setIsTypingStarted] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Reset state when sample text changes
    setUserInput("");
    setErrors(0);
    setIsTypingStarted(false);
    setTimeLeft(duration);
  }, [sampleText, duration]);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0 && isTypingStarted) {
      handleTimeUp();
    }
    if (isTypingStarted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isTypingStarted]);

  const handleTimeUp = () => {
    // Calculate words per minute
    const wordsTyped = userInput.trim().split(/\s+/).length;
    const wpm = wordsTyped / (duration / 60);

    console.log("WPM: ", wpm);

    // Calculate accuracy
    const correctness =
      sampleText.length - errors > 0 ? sampleText.length - errors : 0;
    const accuracy = (correctness / sampleText.length) * 100;
    const sessionData = {
      wpm: wpm,
      accuracy: accuracy,
      mistakes: errors,
      duration: duration,
      typedText: userInput,
    };
    onComplete(sessionData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isTypingStarted) {
      setIsTypingStarted(true);
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
      setIsTypingStarted(false);
      handleTimeUp();
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
      <select
        disabled={isTypingStarted}
        onChange={(e) => setDuration(parseInt(e.target.value))}
      >
        <option value="30">30s</option>
        <option value="60">1min</option>
        <option value="120">2min</option>
      </select>

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
        <p>Time Left: {timeLeft}s</p>
        <p>Errors: {errors}</p>
      </div>
    </div>
  );
};

export default TypingTest;
