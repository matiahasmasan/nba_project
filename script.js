import { teamData } from "./teamData.js";
import { formatDate, formatTime } from "./utils.js";

async function fetchFromNbaApi() {
  try {
    document.getElementById("error-container").innerHTML = "";

    const now = new Date();
    document.getElementById(
      "last-updated"
    ).textContent = `Last updated: ${now.toLocaleTimeString()}`;

    const response = await fetch(
      "https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json"
    );
    if (!response.ok)
      throw new Error(`NBA API responded with status: ${response.status}`);

    const data = await response.json();
    const processedData = processNbaApiData(data);
    renderGames(processedData);
    return processedData;
  } catch (error) {
    console.error("Error fetching from NBA API:", error);
    document.getElementById("error-container").innerHTML = `
      <div class="error-message">
        Unable to load upcoming games. Please try again later.
        Error: ${error.message}
      </div>`;
    document.getElementById("games-container").innerHTML = "";
    return [];
  }
}

function processNbaApiData(apiData) {
  if (!apiData?.scoreboard?.games?.length) return [];

  return apiData.scoreboard.games.map((game) => {
    return {
      gameId: game.gameId,
      homeTeam: {
        triCode: game.homeTeam.teamTricode,
        name:
          teamData[game.homeTeam.teamTricode]?.name ||
          game.homeTeam.teamTricode,
      },
      awayTeam: {
        triCode: game.awayTeam.teamTricode,
        name:
          teamData[game.awayTeam.teamTricode]?.name ||
          game.awayTeam.teamTricode,
      },
      gameTimeUTC: game.gameTimeUTC,
      gameStatus: game.gameStatus,
    };
  });
}

function renderGames(games) {
  const container = document.getElementById("games-container");

  if (!games || games.length === 0) {
    container.innerHTML = '<div class="loading">No upcoming games found</div>';
    return;
  }

  container.innerHTML = "";

  games.forEach((game) => {
    const homeTeamData = teamData[game.homeTeam.triCode];
    const awayTeamData = teamData[game.awayTeam.triCode];

    // Skip if team data is not found
    if (!homeTeamData || !awayTeamData) {
      console.warn(`Missing team data for game: ${game.gameId}`);
      return;
    }

    const gameCard = document.createElement("div");
    gameCard.className = "game-card";

    const gameInfo = document.createElement("div");
    gameInfo.className = "game-info";

    const teams = document.createElement("div");
    teams.className = "teams";

    // Away team
    const awayTeamDiv = document.createElement("div");
    awayTeamDiv.className = "team";

    const awayLogoDiv = document.createElement("div");
    awayLogoDiv.className = "team-logo";
    const awayLogo = document.createElement("img");
    awayLogo.src = awayTeamData.logo;
    awayLogo.alt = `${awayTeamData.name} logo`;
    awayLogoDiv.appendChild(awayLogo);

    const awayNameDiv = document.createElement("div");
    awayNameDiv.className = "team-name";
    awayNameDiv.textContent = awayTeamData.name;

    awayTeamDiv.appendChild(awayLogoDiv);
    awayTeamDiv.appendChild(awayNameDiv);
    teams.appendChild(awayTeamDiv);

    // Home team
    const homeTeamDiv = document.createElement("div");
    homeTeamDiv.className = "team";

    const homeLogoDiv = document.createElement("div");
    homeLogoDiv.className = "team-logo";
    const homeLogo = document.createElement("img");
    homeLogo.src = homeTeamData.logo;
    homeLogo.alt = `${homeTeamData.name} logo`;
    homeLogoDiv.appendChild(homeLogo);

    const homeNameDiv = document.createElement("div");
    homeNameDiv.className = "team-name";
    homeNameDiv.textContent = homeTeamData.name;

    homeTeamDiv.appendChild(homeLogoDiv);
    homeTeamDiv.appendChild(homeNameDiv);
    teams.appendChild(homeTeamDiv);

    const timeDiv = document.createElement("div");
    timeDiv.className = "game-time";

    const timeLabel = document.createElement("div");
    timeLabel.className = "time-label";
    timeLabel.textContent = formatDate(game.gameTimeUTC);

    const time = document.createElement("div");
    time.className = "time";
    time.textContent = formatTime(game.gameTimeUTC);

    timeDiv.appendChild(timeLabel);
    timeDiv.appendChild(time);

    gameInfo.appendChild(teams);
    gameInfo.appendChild(timeDiv);

    const gamePreview = document.createElement("div");
    gamePreview.className = "game-preview";

    const previewButton = document.createElement("button");
    previewButton.className = "preview-button";
    previewButton.textContent = "GAME PREVIEW";
    previewButton.onclick = () => {
      window.open(`https://www.nba.com/game/${game.gameId}`);
    };

    const previewIcon = document.createElement("span");
    previewIcon.className = "preview-icon";
    previewIcon.innerHTML = "📊";

    previewButton.appendChild(previewIcon);
    gamePreview.appendChild(previewButton);

    gameCard.appendChild(gameInfo);
    gameCard.appendChild(gamePreview);
    container.appendChild(gameCard);
  });
}

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

setInterval(fetchFromNbaApi, 300000); // 5 min
