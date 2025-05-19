export function generateSubscribeUrl(token: string): string {
  const baseUrl = process.env.BASE_URL;

  return `${baseUrl}/subscribe/${token}`;
}

export function generateUnsubscribeUrl(token: string): string {
  const baseUrl = process.env.BASE_URL;

  return `${baseUrl}/unsubscribe/${token}`;
}

export function generateConfirmUrl(token: string): string {
  const baseUrl = process.env.BASE_URL;

  return `${baseUrl}/confirm/${token}`;
}

export function generateWeatherUrl(city: string): string {
  const weatherApiUrl = process.env.WEATHER_API_URL;
  const apiKey = process.env.WEATHER_API_KEY;

  return `${weatherApiUrl}/v1/current.json?q=${city}&key=${apiKey}`;
}
