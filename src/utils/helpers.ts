export function secondsToStr(seconds: number) {
  function numberEnding(number: number) {
    return number > 1 ? "s" : "";
  }

  let temp = Math.floor(seconds);
  const years = Math.floor(temp / 31536000);
  if (years) {
    return years + " year" + numberEnding(years);
  }
  const days = Math.floor((temp %= 31536000) / 86400);
  if (days) {
    return days + " day" + numberEnding(days);
  }
  const hours = Math.floor((temp %= 86400) / 3600);
  if (hours) {
    return hours + " hour" + numberEnding(hours);
  }
  const minutes = Math.floor((temp %= 3600) / 60);
  if (minutes) {
    return minutes + " minute" + numberEnding(minutes);
  }
  const secondsFormatted = temp % 60;
  if (secondsFormatted) {
    return secondsFormatted + " second" + numberEnding(secondsFormatted);
  }
  return "less than a second";
}
