// src/App.tsx
import React, { useState, useEffect } from "react";
import TypingTest from "../components/TypingTest";
import axios from "axios";
import { MoonLoader } from "react-spinners";
import HistoryModal from "../modals/HistoryModal";

const Home: React.FC = () => {
  const [sampleText, setSampleText] = useState("");
  const [wpm, setWpm] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
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

  const handleTypingComplete = async (sessionData: {
    wpm: number;
    accuracy: number;
    mistakes: number;
    duration: number;
    typedText: string;
  }) => {
    try {
      const { wpm, accuracy } = sessionData;
      setWpm(wpm);
      setAccuracy(accuracy);

      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (token) {
        const res = axios.post(
          "/api/v1/sessions",
          { ...sessionData, originalText: sampleText },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(res);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setTimeout(() => {
        setWpm(null);
        setAccuracy(null);
      }, 3000);
    }
  };

  return (
    <>
      <HistoryModal isOpen={openModal} onClose={() => setOpenModal(false)} />
      <button
        style={{
          position: "fixed",
          top: "0",
          right: "0",
          margin: "5px 5px 0 0",
          background: "aqua",
        }}
        onClick={() => setOpenModal(true)}
      >
        History
      </button>
      <div
        style={{
          top: "50%",
          transform: "translate(-50%, -50%)",
          position: "absolute",
          left: "50%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1>Typing Test</h1>
          {!wpm && !accuracy && sampleText ? (
            <TypingTest
              sampleText={sampleText}
              onComplete={handleTypingComplete}
            />
          ) : (
            (!accuracy || !wpm) && (
              <div>
                <MoonLoader />
              </div>
            )
          )}
          {wpm !== null && accuracy !== null && (
            <div className="results">
              <h2>Results</h2>
              <p>Words per minute (WPM): {wpm.toFixed(2)}</p>
              <p>Accuracy: {accuracy.toFixed(2)}%</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
