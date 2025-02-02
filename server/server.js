require("dotenv").config();
const express = require("express");
const fs = require("fs");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const app = express();
const PORT = 3001;
const PASSWORD = process.env.ACCESS_PASSWORD;

app.use(cors());
app.use(express.json());

const readMatches = () => {
  try {
    const data = fs.readFileSync("api/matches.json", "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading file:", err);
    return [];
  }
};

const checkPassword = (req, res, next) => {
  const userPassword = req.headers["x-access-password"];
  if (!userPassword || userPassword !== PASSWORD) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

app.get("/matches", (req, res) => {
  const matchesData = readMatches();

  matchesData.sort((a, b) => {
    const dateA = moment(a.date, "DD/MM");
    const dateB = moment(b.date, "DD/MM");
    return dateA.isBefore(dateB) ? -1 : 1;
  });

  const result = [];
  let currentDay = null;

  matchesData.forEach((match) => {
    if (!currentDay || currentDay.date !== match.date) {
      if (currentDay) {
        result.push(currentDay);
      }

      const dayOfWeek = moment(match.date, "DD/MM").locale("uk").format("dddd");
      currentDay = {
        date: match.date,
        day: dayOfWeek,
        matches: [],
      };
    }

    currentDay.matches.push(match);
  });

  if (currentDay) {
    result.push(currentDay);
  }

  res.json(result);
});

app.put("/matches/:id", checkPassword, (req, res) => {
  const { id } = req.params;
  const updatedMatch = req.body;
  let matchesData = readMatches();
  const matchIndex = matchesData.findIndex((m) => m.id === id);

  if (matchIndex === -1) {
    return res.status(404).json({ error: "Match not found" });
  }

  matchesData[matchIndex] = { ...matchesData[matchIndex], ...updatedMatch };

  fs.writeFileSync("api/matches.json", JSON.stringify(matchesData, null, 2));

  res.json({
    message: "Match updated successfully",
    match: matchesData[matchIndex],
  });
});

app.post("/matches", checkPassword, (req, res) => {
  const { league, date, homeTeam, awayTeam, time, result, video } = req.body;

  if (!league || !date || !homeTeam || !awayTeam || !time) {
    return res.status(400).json({
      error: "Date, homeTeam, awayTeam, league and time are required fields",
    });
  }

  const dayOfWeek = moment(date, "DD/MM").locale("uk").format("dddd");

  const newMatch = {
    league,
    homeTeam,
    awayTeam,
    time,
    result: result || null,
    video: video || null,
    id: uuidv4(),
  };

  let matchesData = readMatches();
  let dayFound = false;

  for (let day of matchesData) {
    if (day.date === date) {
      dayFound = true;
      day.matches.push(newMatch);
      break;
    }
  }

  if (!dayFound) {
    const newDay = {
      date,
      day: dayOfWeek,
      matches: [newMatch],
    };
    matchesData.push(newDay);
  }

  fs.writeFileSync("api/matches.json", JSON.stringify(matchesData, null, 2));
  res.json({ message: "Match created successfully", match: newMatch });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
