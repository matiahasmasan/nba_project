import { teamData } from "./teamData.js";
import { formatDate, formatTime } from "./utils.js";
import { fetchNBAStandings } from "./nbaApi.js";

// Main function to fetch data from NBA API
async function fetchFromNbaApi() {
  try {
    clearErrors();
    updateLastRefreshed();

    const response = await fetch(
      "https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json"
    );

    if (!response.ok) {
      throw new Error(`NBA API responded with status: ${response.status}`);
    }

    const data = await response.json();
    const processedData = processNbaApiData(data);
    renderGames(processedData);
    return processedData;
  } catch (error) {
    console.error("Error fetching from NBA API:", error);
    showError(
      `Unable to load upcoming games. Please try again later. Error: ${error.message}`
    );
    clearGamesContainer();
    return [];
  }
}

// Helper functions for UI updates
function clearErrors() {
  document.getElementById("error-container").innerHTML = "";
}

function updateLastRefreshed() {
  const now = new Date();
  document.getElementById(
    "last-updated"
  ).textContent = `Last updated: ${now.toLocaleTimeString()}`;
}

function showError(message) {
  document.getElementById("error-container").innerHTML = `
    <div class="error-message">${message}</div>`;
}

function clearGamesContainer() {
  document.getElementById("games-container").innerHTML = "";
}

// Process NBA API data into a cleaner format
function processNbaApiData(apiData) {
  if (!apiData?.scoreboard?.games?.length) return [];

  return apiData.scoreboard.games.map((game) => ({
    gameId: game.gameId,
    homeTeam: {
      triCode: game.homeTeam.teamTricode,
      name:
        teamData[game.homeTeam.teamTricode]?.name || game.homeTeam.teamTricode,
    },
    awayTeam: {
      triCode: game.awayTeam.teamTricode,
      name:
        teamData[game.awayTeam.teamTricode]?.name || game.awayTeam.teamTricode,
    },
    gameTimeUTC: game.gameTimeUTC,
    gameStatus: game.gameStatus,
  }));
}

// Main function to render games
async function renderGames(games) {
  const container = document.getElementById("games-container");

  if (!games || games.length === 0) {
    container.innerHTML = '<div class="loading">No upcoming games found</div>';
    return;
  }

  container.innerHTML = "";

  for (const game of games) {
    const homeTeamData = teamData[game.homeTeam.triCode];
    const awayTeamData = teamData[game.awayTeam.triCode];

    const gameCard = createGameCard(game, homeTeamData, awayTeamData);
    container.appendChild(gameCard);
  }
}

// Create a complete game card
function createGameCard(game, homeTeamData, awayTeamData) {
  const gameCard = createElement("div", { className: "game-card" });

  const gameInfo = createGameInfo(game, homeTeamData, awayTeamData);
  gameCard.appendChild(gameInfo);

  const predictionDiv = createElement("div", {
    className: "prediction",
    innerHTML: '<div class="loading-prediction">Loading prediction...</div>',
  });
  gameCard.appendChild(predictionDiv);

  const gamePreview = createGamePreview(game);
  gameCard.appendChild(gamePreview);

  // Load prediction asynchronously
  loadPrediction(predictionDiv, homeTeamData, awayTeamData);

  return gameCard;
}

// Create game info section (teams and time)
function createGameInfo(game, homeTeamData, awayTeamData) {
  const gameInfo = createElement("div", { className: "game-info" });

  // Create teams section
  const teams = createElement("div", { className: "teams" });
  teams.appendChild(createTeamElement(homeTeamData, "home"));
  teams.appendChild(createTeamElement(awayTeamData, "away"));

  // Create time section
  const timeDiv = createElement("div", { className: "game-time" });
  timeDiv.innerHTML = `
    <div class="time-label">${formatDate(game.gameTimeUTC)}</div>
    <div class="time">${formatTime(game.gameTimeUTC)}</div>
  `;

  gameInfo.appendChild(teams);
  gameInfo.appendChild(timeDiv);

  return gameInfo;
}

// Create team element with logo and name
function createTeamElement(teamData, teamType) {
  const teamDiv = createElement("div", { className: "team" });
  teamDiv.innerHTML = `
    <div class="team-logo">
      <img src="${teamData.logo}" alt="${teamData.name} logo">
    </div>
    <div class="team-name">${teamData.name} <small>(${teamType})</small></div>
  `;
  return teamDiv;
}

// Create game preview section with button
function createGamePreview(game) {
  const gamePreview = createElement("div", { className: "game-preview" });

  const previewButton = createElement("button", {
    className: "preview-button",
    textContent: "GAME PREVIEW",
  });

  previewButton.onclick = () => {
    window.open(`https://www.nba.com/game/${game.gameId}`);
  };

  previewButton.innerHTML += '<span class="preview-icon">📊</span>';
  gamePreview.appendChild(previewButton);

  return gamePreview;
}

// Load prediction data asynchronously
async function loadPrediction(predictionDiv, homeTeamData, awayTeamData) {
  try {
    const homeTeamStandings = await fetchNBAStandings(homeTeamData.index);
    const awayTeamStandings = await fetchNBAStandings(awayTeamData.index);

    // percentage
    const homePercentage = homeTeamStandings.Percentage;
    const awayPercentage = awayTeamStandings.Percentage;

    // points
    const homePointMade = homeTeamStandings.PointsPerGameFor;
    const homePointReceived = homeTeamStandings.PointsPerGameAgainst;

    const awayPointMade = awayTeamStandings.PointsPerGameFor;
    const awayPointReceived = awayTeamStandings.PointsPerGameAgainst;

    const homeScore = Math.round((homePointMade + awayPointReceived) / 2);
    const awayScore = Math.round((awayPointMade + homePointReceived) / 2);
    const totalScore = homeScore + awayScore;

    // AICI INCEPE ALGORITMUL IN SINE
    const winningTeam =
      homePercentage > awayPercentage ? homeTeamData.name : awayTeamData.name;

    // PANA AICI
    predictionDiv.innerHTML = `
      <div class="prediction-content">
        <div class="prediction-label">WIN PREDICTION</div>
        <div class="prediction-text">
          <span class="winner">${winningTeam}</span> is predicted to win with an average score of 
          <span class="winner">${homeScore} - ${awayScore}</span> points, 
          total of <span class="winner">${totalScore}</span> points
          <div class="prediction-stats">
            ${homeTeamData.name}: ${(homePercentage * 100).toFixed(1)}% vs 
            ${awayTeamData.name}: ${(awayPercentage * 100).toFixed(1)}%
          </div>
          <div class="prediction-stats">${
            homeTeamData.name
          } average ${homePointMade} points made and ${homePointReceived} received</div>
          <div class="prediction-stats">${
            awayTeamData.name
          } average ${awayPointMade} points made and ${awayPointReceived} received</div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error("Error fetching team standings:", error);
    predictionDiv.innerHTML =
      '<div class="prediction-error">Unable to load prediction</div>';
  }
}

// Helper function to create DOM elements
function createElement(tag, options = {}) {
  const element = document.createElement(tag);

  Object.entries(options).forEach(([key, value]) => {
    if (key === "className") {
      element.className = value;
    } else if (key === "innerHTML") {
      element.innerHTML = value;
    } else if (key === "textContent") {
      element.textContent = value;
    } else {
      element[key] = value;
    }
  });

  return element;
}

// Initial load and setup refresh functionality
fetchFromNbaApi();

document
  .getElementById("refresh-button")
  .addEventListener("click", async () => {
    const button = document.getElementById("refresh-button");
    const originalText = button.textContent;

    button.textContent = "Refreshing...";
    button.disabled = true;

    await fetchFromNbaApi();

    button.textContent = "Games Updated!";

    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 2000);
  });

// Auto refresh every 5 minutes
setInterval(fetchFromNbaApi, 300000);
