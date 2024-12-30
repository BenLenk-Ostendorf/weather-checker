import { Injectable } from '@angular/core';
import { fetchWeatherApi } from 'openmeteo';

@Injectable({
  providedIn: 'root'
})
export class WeatherApiService {

  constructor() { }

  async getWeather() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    const params = {
      "latitude": 48.1374,
      "longitude": 11.5755,
      "current": "temperature_2m",
      "hourly": ["temperature_2m", "precipitation_probability"],
      "daily": "weather_code",
      "timezone": "Europe/Berlin",
      "start_date": formatDate(today),
      "end_date": formatDate(tomorrow)
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);
    
    // Helper function to form time ranges
    const range = (start: number, stop: number, step: number) =>
      Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
    
    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];
    
    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const current = response.current()!;
    const hourly = response.hourly()!;
    
    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      current: {
        time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
        temperature2m: current.variables(0)!.value(),
      },
      hourly: {
        time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
          (t) => new Date((t + utcOffsetSeconds) * 1000)
        ),
        temperature2m: hourly.variables(0)!.valuesArray()!,
        precipitationProbability: hourly.variables(1)!.valuesArray()!,
      },
    };
        
    // Find the current hour in the hourly data
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    
    // Log next 8 hours of temperature data
    console.log("\nWeather forecast:");
    // Log current temperature first
    console.log(`Current time: ${currentTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} | Temperature: ${Math.round(weatherData.current.temperature2m)}°C | Rain: ${weatherData.hourly.precipitationProbability[currentHour]}%`);
    
    let hoursLogged = 0;
    for (let i = 0; i < weatherData.hourly.time.length && hoursLogged < 7; i++) {
      const forecastTime = weatherData.hourly.time[i];
      if (forecastTime.getHours() > currentHour) {
        console.log(
          `${forecastTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}: ${Math.round(weatherData.hourly.temperature2m[i])}°C | Rain: ${weatherData.hourly.precipitationProbability[i]}%`
        );
        hoursLogged++;
      }
    }
    
    return weatherData;
  }
}