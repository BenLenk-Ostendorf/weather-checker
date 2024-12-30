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

    const backpackDict: { [key: string]: boolean } = {
      "pullover": false,
      "leatherjacket": false,
      "rainjacket": false,
      "rainPants": false
    };

    const clothesSettings: { [key: string]: { cold: boolean, rain: boolean } } = {
      "pullover": {
        cold: true,
        rain: false
      },
      "leatherjacket": {
        cold: true,
        rain: true
      },
      "rainjacket": {
        cold: false,
        rain: true
      },
      "rainPants": {
        cold: true,
        rain: true
      }
    };

    // Get current conditions
    const currentHour = new Date().getHours();
    const currentTemp = weatherData.current.temperature2m;
    const currentRain = weatherData.hourly.precipitationProbability[currentHour];

    // Check current conditions for what to wear now
    const isCold = currentTemp < 18;
    const isRaining = currentRain > 30;

    for (const [item, settings] of Object.entries(clothesSettings)) {
      if (isCold) {
        clothesDict[item] = settings.cold;
      } else {
        clothesDict[item] = !settings.cold && settings.rain && isRaining;
      }
    }

    // Check future conditions for backpack
    const nextHours = weatherData.hourly.time
      .slice(currentHour, currentHour + 8)
      .map((_, index) => ({
        temperature: weatherData.hourly.temperature2m[currentHour + index],
        rainProbability: weatherData.hourly.precipitationProbability[currentHour + index]
      }));

    const willBeCold = nextHours.some(hour => hour.temperature < 18);
    const willRain = nextHours.some(hour => hour.rainProbability > 30);

    // Add items to backpack if conditions will change
    for (const [item, settings] of Object.entries(clothesSettings)) {
      if (!clothesDict[item]) { // Only add to backpack if not already wearing
        if (settings.cold && willBeCold) {
          backpackDict[item] = true;
        }
        if (settings.rain && willRain) {
          backpackDict[item] = true;
        }
      }
    }

    return {
      clothes: clothesDict,
      backpack: backpackDict
    };
  }
}
