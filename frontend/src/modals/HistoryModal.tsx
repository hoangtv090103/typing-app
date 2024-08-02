// src/components/Modal.tsx

import React, { useState } from "react";
import "./HistoryModal.css";
import axios from "axios";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HistoryModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [sessions, setSessions] = useState([]);
  if (!isOpen) return null;

  async function fetchData() {
    try {
      const res = await axios.get("/api/v1/sessions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSessions(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  fetchData();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>History</h2>
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
            {sessions.map(
              (session: {
                wpm: number;
                accuracy: number;
                mistakes: number;
                duration: number;
                _id: string;
              }) => (
                <tr key={session._id}>
                  <td>{session.wpm}</td>
                  <td>{session.accuracy}</td>
                  <td>{session.mistakes}</td>
                  <td>{session.duration}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryModal;
