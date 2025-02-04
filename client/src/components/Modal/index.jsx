import React, { useState } from "react";
import "./style.css";
import { updateMatch } from "../../api/api";

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const teams = [
  "Illusion",
  "whoisTeam",
  "Nexus Esport",
  "FC SKIF",
  "Ukraine",
  "FC Bastion",
  "VFC Crystall",
  "Steel Will",
  "GloryUA",
  "FC Arsenal Kyiv",
  "Galician Lions",
  "Eclipse eSport",
  "Spartans SPR",
  "VFC KRYVBASS",
  "Batalion Monaco",
  "VFC Odessa",
  "CFC Dnipro",
  "VFC Sanctuary",
  "VFC Miami Kyiv",
  "Boars Gaming",
  "Furia Esports",
];

const Modal = ({ match, date, onClose }) => {
  const [editedMatch, setEditedMatch] = useState({
    league: match.league,
    day: date.split("/")[0],
    month: date.split("/")[1],
    time: match.time,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    homeResult: match.result?.home || 0,
    awayResult: match.result?.away || 0,
    video: match.video,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let tempValue = value;
    if (name === "homeResult" || name === "awayResult") {
      tempValue = +value;
    }
    setEditedMatch((prev) => ({
      ...prev,
      [name]: tempValue,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await updateMatch(match.id, {
        league: editedMatch.league,
        homeTeam: editedMatch.homeTeam,
        awayTeam: editedMatch.awayTeam,
        time: editedMatch.time,
        result: {
          home: editedMatch.homeResult,
          away: editedMatch.awayResult,
        },
        video: editedMatch.video,
        date: `${editedMatch.day}/${editedMatch.month}`,
      });

      onClose(response);
    } catch (error) {
      console.error("Error saving match:", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="modal-title">Редагування матчу</h2>
        <div className="modal-match-info">
          <div className="modal-input-container">
            <label>Результат:</label>
            <div className="modal-input-group teams">
              <div className="team-result">
                <select
                  id="homeTeam"
                  name="homeTeam"
                  type="text"
                  value={editedMatch.homeTeam}
                  onChange={handleInputChange}
                >
                  {teams.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
                <input
                  id="homeResult"
                  name="homeResult"
                  type="number"
                  value={editedMatch.homeResult}
                  onChange={handleInputChange}
                />
              </div>
              <div className="team-result">
                <input
                  id="awayResult"
                  name="awayResult"
                  type="number"
                  value={editedMatch.awayResult}
                  onChange={handleInputChange}
                />
                <select
                  id="awayTeam"
                  name="awayTeam"
                  type="text"
                  value={editedMatch.awayTeam}
                  onChange={handleInputChange}
                >
                  {teams.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="modal-input-container">
            <label htmlFor="league">Ліга:</label>
            <select
              id="league"
              name="league"
              value={editedMatch.league}
              onChange={handleInputChange}
            >
              <option value="UCFL League">UCFL League</option>
              <option value="UCFL Cup">UCFL Cup</option>
              <option value="ESUL">ESUL</option>
            </select>
          </div>

          <div className="modal-input-container">
            <label htmlFor="date">Дата:</label>
            <div className="modal-input-group">
              <select
                name="day"
                id="day"
                value={editedMatch.day}
                onChange={handleInputChange}
              >
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <select
                name="month"
                id="month"
                value={editedMatch.month}
                onChange={handleInputChange}
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="modal-input-container">
            <label htmlFor="time">Час:</label>
            <input
              id="time"
              name="time"
              type="time"
              value={editedMatch.time}
              onChange={handleInputChange}
            />
          </div>
          <div className="modal-input-container">
            <label htmlFor="time">Відео:</label>
            <div className="modal-input-group">
              <input
                id="video"
                name="video"
                type="text"
                placeholder="Поки без посилання"
                value={editedMatch.video}
                onChange={handleInputChange}
              />
              {editedMatch.video && (
                <a className="modal-link" href={editedMatch.video}>
                  GO
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="modal-buttons">
          <button className="modal-save-btn" onClick={handleSave}>
            Зберегти
          </button>
          <button className="modal-close-btn" onClick={onClose}>
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
