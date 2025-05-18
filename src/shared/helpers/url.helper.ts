export function generateUnsubscribeUrl(unsubscribeToken: string): string {
  const baseUrl = process.env.BASE_URL;

  return `${baseUrl}/unsubscribe/${unsubscribeToken}`;
}
export function generateWeatherUrl(city: string): string {
  const weatherApiUrl = process.env.WEATHER_API_URL;
  const apiKey = process.env.WEATHER_API_KEY;

  return `${weatherApiUrl}/v1/current.json?q=${city}&key=${apiKey}`;
}

export function generateSubscribeUrl(subscribeToken: string): string {
  const baseUrl = process.env.BASE_URL;

  return `${baseUrl}/subscribe/${subscribeToken}`;
}
