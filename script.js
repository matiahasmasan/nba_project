// NBA team data with official abbreviations and logo paths
const teamData = {
  ATL: {
    name: "Hawks",
    logo: "https://cdn.nba.com/logos/nba/1610612737/global/L/logo.svg",
  },
  BOS: {
    name: "Celtics",
    logo: "https://cdn.nba.com/logos/nba/1610612738/global/L/logo.svg",
  },
  BKN: {
    name: "Nets",
    logo: "https://cdn.nba.com/logos/nba/1610612751/global/L/logo.svg",
  },
  CHA: {
    name: "Hornets",
    logo: "https://cdn.nba.com/logos/nba/1610612766/global/L/logo.svg",
  },
  CHI: {
    name: "Bulls",
    logo: "https://cdn.nba.com/logos/nba/1610612741/global/L/logo.svg",
  },
  CLE: {
    name: "Cavaliers",
    logo: "https://cdn.nba.com/logos/nba/1610612739/global/L/logo.svg",
  },
  DAL: {
    name: "Mavericks",
    logo: "https://cdn.nba.com/logos/nba/1610612742/global/L/logo.svg",
  },
  DEN: {
    name: "Nuggets",
    logo: "https://cdn.nba.com/logos/nba/1610612743/global/L/logo.svg",
  },
  DET: {
    name: "Pistons",
    logo: "https://cdn.nba.com/logos/nba/1610612765/global/L/logo.svg",
  },
  GSW: {
    name: "Warriors",
    logo: "https://cdn.nba.com/logos/nba/1610612744/global/L/logo.svg",
  },
  HOU: {
    name: "Rockets",
    logo: "https://cdn.nba.com/logos/nba/1610612745/global/L/logo.svg",
  },
  IND: {
    name: "Pacers",
    logo: "https://cdn.nba.com/logos/nba/1610612754/global/L/logo.svg",
  },
  LAC: {
    name: "Clippers",
    logo: "https://cdn.nba.com/logos/nba/1610612746/global/L/logo.svg",
  },
  LAL: {
    name: "Lakers",
    logo: "https://cdn.nba.com/logos/nba/1610612747/global/L/logo.svg",
  },
  MEM: {
    name: "Grizzlies",
    logo: "https://cdn.nba.com/logos/nba/1610612763/global/L/logo.svg",
  },
  MIA: {
    name: "Heat",
    logo: "https://cdn.nba.com/logos/nba/1610612748/global/L/logo.svg",
  },
  MIL: {
    name: "Bucks",
    logo: "https://cdn.nba.com/logos/nba/1610612749/global/L/logo.svg",
  },
  MIN: {
    name: "Timberwolves",
    logo: "https://cdn.nba.com/logos/nba/1610612750/global/L/logo.svg",
  },
  NOP: {
    name: "Pelicans",
    logo: "https://cdn.nba.com/logos/nba/1610612740/global/L/logo.svg",
  },
  NYK: {
    name: "Knicks",
    logo: "https://cdn.nba.com/logos/nba/1610612752/global/L/logo.svg",
  },
  OKC: {
    name: "Thunder",
    logo: "https://cdn.nba.com/logos/nba/1610612760/global/L/logo.svg",
  },
  ORL: {
    name: "Magic",
    logo: "https://cdn.nba.com/logos/nba/1610612753/global/L/logo.svg",
  },
  PHI: {
    name: "76ers",
    logo: "https://cdn.nba.com/logos/nba/1610612755/global/L/logo.svg",
  },
  PHX: {
    name: "Suns",
    logo: "https://cdn.nba.com/logos/nba/1610612756/global/L/logo.svg",
  },
  POR: {
    name: "Trail Blazers",
    logo: "https://cdn.nba.com/logos/nba/1610612757/global/L/logo.svg",
  },
  SAC: {
    name: "Kings",
    logo: "https://cdn.nba.com/logos/nba/1610612758/global/L/logo.svg",
  },
  SAS: {
    name: "Spurs",
    logo: "https://cdn.nba.com/logos/nba/1610612759/global/L/logo.svg",
  },
  TOR: {
    name: "Raptors",
    logo: "https://cdn.nba.com/logos/nba/1610612761/global/L/logo.svg",
  },
  UTA: {
    name: "Jazz",
    logo: "https://cdn.nba.com/logos/nba/1610612762/global/L/logo.svg",
  },
  WAS: {
    name: "Wizards",
    logo: "https://cdn.nba.com/logos/nba/1610612764/global/L/logo.svg",
  },
};

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  // Check if the game is today
  if (date.toDateString() === now.toDateString()) {
    return "Today";
  }

  // Check if the game is tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  }

  // Otherwise return the day of the week
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[date.getDay()];
}

// Format time for display
function formatTime(dateString) {
  const date = new Date(dateString);
  let hours = date.getHours();
  let minutes = date.getMinutes();

  // Ensure minutes are displayed with leading zero if needed
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return `${hours}:${minutes}`;
}

// Function to fetch from NBA API
async function fetchFromNbaApi() {
  try {
    // Clear any existing error
    document.getElementById("error-container").innerHTML = "";

    // Update last updated time
    const now = new Date();
    document.getElementById(
      "last-updated"
    ).textContent = `Last updated: ${now.toLocaleTimeString()}`;

    // Fetch from the NBA API
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
    const errorContainer = document.getElementById("error-container");
    errorContainer.innerHTML = `
      <div class="error-message">
        Unable to load upcoming games. Please try again later.
        Error: ${error.message}
      </div>
    `;

    // Still render the game container as empty
    document.getElementById("games-container").innerHTML = "";
    return [];
  }
}

// Process API data from NBA API format to our app format
function processNbaApiData(apiData) {
  // Handle the case where there are no games
  if (
    !apiData ||
    !apiData.scoreboard ||
    !apiData.scoreboard.games ||
    apiData.scoreboard.games.length === 0
  ) {
    return [];
  }

  // Transform the NBA API data to our format
  return apiData.scoreboard.games.map((game) => {
    // Get the triCode for each team
    const homeTeamTriCode = game.homeTeam.teamTricode;
    const awayTeamTriCode = game.awayTeam.teamTricode;

    return {
      gameId: game.gameId,
      homeTeam: {
        triCode: homeTeamTriCode,
        name: teamData[homeTeamTriCode]
          ? teamData[homeTeamTriCode].name
          : homeTeamTriCode,
      },
      awayTeam: {
        triCode: awayTeamTriCode,
        name: teamData[awayTeamTriCode]
          ? teamData[awayTeamTriCode].name
          : awayTeamTriCode,
      },
      gameTimeUTC: game.gameTimeUTC,
      gameStatus: game.gameStatus,
    };
  });
}

// Function to render game cards
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

// Initial data fetch
fetchFromNbaApi();

// Refresh button functionality
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

// Optional: Add auto-refresh functionality
setInterval(fetchFromNbaApi, 300000); // Refresh every 5 minutes
