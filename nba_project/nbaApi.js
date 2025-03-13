const API_KEY = "0109c2311f6f4f88860fb810a77f5e7f";
const SEASON = "2025";
const URL = `https://api.sportsdata.io/v3/nba/scores/json/Standings/${SEASON}?key=${API_KEY}`;

async function fetchNBAStandings(teamID) {
  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const standingsData = await response.json();
    return standingsData[teamID];
  } catch (error) {
    console.error("Error fetching NBA standings:", error);
    throw error;
  }
}
export { fetchNBAStandings };
