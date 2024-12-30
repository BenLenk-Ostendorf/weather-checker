import { Injectable } from '@angular/core';
import { WeatherApiService } from './weather-api.service';

@Injectable({
  providedIn: 'root'
})
export class ClothesSelectorService {
  constructor(private weatherService: WeatherApiService) { }
  
  async getcurrentClothes() {
    const weatherData = await this.weatherService.getWeather();

    const clothesDict: { [key: string]: boolean } = {
      "pullover": false,
      "leatherjacket": false,
      "rainjacket": false,
      "rainPants": false,
      "bike": false
    };

    const clothesSettings: { [key: string]: { minTemp: number, maxTemp: number, rain?: number } } = {
      "pullover": {
        minTemp: -10,
        maxTemp: 18
      },
      "leatherjacket": {
        minTemp: -10,
        maxTemp: 12
      },
      "rainjacket": {
        minTemp: 12,
        maxTemp: 30,
        rain: 30
      },
      "rainPants": {
        minTemp: -10,
        maxTemp: 18,
        rain: 30
      },
      "bike": {
        minTemp: 1,
        maxTemp: 100
      }
    };

    // Current hour for precipitation probability
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    
    // Create weather data object
    const currentWeather = {
      time: currentTime.toISOString(),
      temperature: Math.round(weatherData.current.temperature2m),
      rainProbability: weatherData.hourly.precipitationProbability[currentHour]
    };

    // First check temperature ranges
    for (const [item, settings] of Object.entries(clothesSettings)) {
      clothesDict[item] = currentWeather.temperature >= settings.minTemp && 
                         currentWeather.temperature <= settings.maxTemp;
    }

    // Then check rain probability and override if necessary
    for (const [item, settings] of Object.entries(clothesSettings)) {
      if (settings.rain && currentWeather.rainProbability >= settings.rain) {
        clothesDict[item] = true;
      }
    }

    return {
      clothes: clothesDict
    };
  }
}
