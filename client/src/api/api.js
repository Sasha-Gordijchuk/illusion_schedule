import axios from "axios";

axios.defaults.baseURL = "http://localhost:3001";

export const fetchMatches = async () => {
  const response = await axios.get("/matches");

  return response;
};

export const updateMatch = async (id, match) => {
  const password = localStorage.getItem("illusion--password");

  const response = await axios.put(`/matches/${id}`, match, {
    headers: {
      "x-access-password": password,
    },
  });

  return response;
};
