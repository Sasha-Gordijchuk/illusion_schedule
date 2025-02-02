const fs = require("fs");

// Читаємо вхідний файл
const inputFile = "api/matches.json";
const outputFile = "api/converted_matches.json";

const readMatches = () => {
  try {
    const data = fs.readFileSync(inputFile, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading file:", err);
    return [];
  }
};

const convertMatches = () => {
  const data = readMatches();

  const allMatches = [];

  data.forEach((match) => {
    allMatches.push({
      ...match,
      video: "", // Додаємо дату до кожного матчу
    });
  });

  // Записуємо нову структуру в новий файл
  fs.writeFileSync(outputFile, JSON.stringify(allMatches, null, 2), "utf8");
  console.log("Matches have been converted and saved to", outputFile);
};

// Викликаємо функцію для конвертації
convertMatches();
