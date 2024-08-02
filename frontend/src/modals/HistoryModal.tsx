// src/components/HistoryModal.tsx

import React, { useEffect, useState } from "react";
import "./HistoryModal.css";
import axios from "axios";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Session {
  _id: number;
  wpm: number;
  accuracy: number;
  mistakes: number;
  duration: number;
}

const HistoryModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/v1/sessions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log(res.data.sessions);

      // Ensure the response is in the expected format
      if (Array.isArray(res.data.sessions)) {
        setSessions(res.data.sessions);
      } else {
        console.error("Unexpected response format: ", res.data.sessions);
        setSessions([]);
      }
    } catch (err) {
      console.log("Error fetching session data: ", err);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>History</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>WPM</th>
                <th>Accuracy</th>
                <th>Mistakes</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length > 0 ? (
                sessions.map((session) => (
                  <tr key={session._id}>
                    <td>{session.wpm}</td>
                    <td>{session.accuracy.toFixed(2)}</td>
                    <td>{session.mistakes}</td>
                    <td>{session.duration}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>No session history available.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HistoryModal;
