export function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  

  if (dateOnly.getTime() === nowOnly.getTime()) return "Today";
  
  const tomorrow = new Date(nowOnly);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (dateOnly.getTime() === tomorrow.getTime()) return "Tomorrow";
  
  const yesterday = new Date(nowOnly);
  yesterday.setDate(yesterday.getDate() - 1);
  if (dateOnly.getTime() === yesterday.getTime()) return "Yesterday";
  
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
}

export function formatTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  
  let hours = date.getHours();
  let minutes = date.getMinutes();
  minutes = minutes < 10 ? "0" + minutes : minutes;
  
  const isPast = date.getTime() < now.getTime();
  
  return isPast ? `${hours}:${minutes} <span style="color: red;">(PLAYED)</span>` : `${hours}:${minutes}`;
}

export function formatDateTime(dateString) {
  const dateFormatted = formatDate(dateString);
  const timeFormatted = formatTime(dateString);
  
  return `${dateFormatted} at ${timeFormatted}`;
}