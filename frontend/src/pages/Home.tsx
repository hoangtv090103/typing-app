// src/App.tsx
import React, { useState, useEffect } from "react";
import TypingTest from "../components/TypingTest";
import axios from "axios";

const Home: React.FC = () => {
  const [sampleText, setSampleText] = useState("");
  const [wpm, setWpm] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  useEffect(() => {
    const getSampleText = async () => {
      const res = await axios.get("/api/v1/texts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
        },
      });
      const text = res.data.text;
      setSampleText(text);
    };

    getSampleText();
  }, []);

  const handleTypingComplete = (wpm: number, accuracy: number) => {
    setWpm(wpm);
    setAccuracy(accuracy);
  };

  return (
    <div className="App">
      <h1>Typing Practice</h1>
      {sampleText && (
        <TypingTest sampleText={sampleText} onComplete={handleTypingComplete} />
      )}
      {wpm !== null && accuracy !== null && (
        <div className="results">
          <h2>Results</h2>
          <p>Words per minute (WPM): {wpm.toFixed(2)}</p>
          <p>Accuracy: {accuracy.toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
};

export default Home;
