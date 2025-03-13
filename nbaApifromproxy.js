fetch('http://localhost:3000/nba-scoreboard')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error fetching data:', error));
