import "./style.css";
import { useEffect, useState } from "react";
import Modal from "../Modal";
import { fetchMatches } from "../../api/api";
import PasswordModal from "../PasswordModal";

const MatchList = () => {
  const [allMatches, setAllMatches] = useState([]);
  const [visibleMatches, setVisibleMatches] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState("");
  const [selectedResult, setSelectedResult] = useState("all");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);

  const getMatches = async () => {
    const matches = await fetchMatches();
    setAllMatches(matches.data);
    setVisibleMatches(matches.data);
  };

  const handleMatchClick = (match, date) => {
    setSelectedDate(date);
    setSelectedMatch(match);
    setShowModal(true);
  };

  const handleCloseModal = async (isUpdated) => {
    setShowModal(false);
    setSelectedMatch(null);

    if (isUpdated?.status === 200) {
      getMatches();
    }
  };

  const filterMatches = () => {
    const filtredMatches = allMatches
      .map((day) => {
        const filteredDayMatches = day.matches.filter((match) => {
          const leagueFilter =
            selectedLeague === "" || match.league === selectedLeague;

          const resultFilter =
            selectedResult === "all" ||
            (selectedResult === "completed" && match.result !== null) ||
            (selectedResult === "pending" && match.result === null);

          return leagueFilter && resultFilter;
        });

        if (filteredDayMatches.length > 0) {
          return {
            ...day,
            matches: filteredDayMatches,
          };
        }
        return null;
      })
      .filter(Boolean);

    setVisibleMatches(filtredMatches);
  };

  const handleClosePassModal = () => {
    setShowPassModal(false);
  }

  useEffect(() => {
    filterMatches();
  }, [selectedLeague, selectedResult, allMatches]);

  useEffect(() => {
    getMatches();
  }, []);

  return (
    <div className="match-list">
      <h2 className="match-list-title" onDoubleClick={() => {setShowPassModal(true)}}>Розклад матчів</h2>
      {showPassModal && (
        <PasswordModal
          onClose={handleClosePassModal}
        />
      )}
      {showModal && selectedMatch && (
        <Modal
          match={selectedMatch}
          date={selectedDate}
          onClose={handleCloseModal}
        />
      )}
      <div className="match-list-filtres">
        <select
          value={selectedLeague}
          onChange={(e) => setSelectedLeague(e.target.value)}
        >
          <option value="">Усі ліги</option>
          <option value="UCFL League">UCFL League</option>
          <option value="UCFL Cup">UCFL Cup</option>
          <option value="ESUL">ESUL</option>
        </select>

        <select
          value={selectedResult}
          onChange={(e) => setSelectedResult(e.target.value)}
        >
          <option value="all">Усі матчі</option>
          <option value="completed">Завершені</option>
          <option value="pending">Незавершені</option>
        </select>
      </div>
      {visibleMatches.map((day, i) => (
        <div key={i} className="match-day">
          <h3 className="match-day-title">
            {day.date} ({day.day})
          </h3>
          <ul className="match-day-list">
            {day.matches.map((match) => (
              <li
                key={match.id}
                className="match-item"
                onClick={() => handleMatchClick(match, day.date)}
              >
                <div className="match-top">
                  <span className="match-league">{match.league}</span>
                  <span className="match-time">{match.time}</span>
                </div>
                <span className="match-teams">
                  <span className="match-team">{match.homeTeam}</span>
                  {match.result ? (
                    <span className="match-result">
                      {match.result.home} : {match.result.away}
                    </span>
                  ) : (
                    <span className="match-result">- : -</span>
                  )}
                  <span className="match-team">{match.awayTeam}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MatchList;
