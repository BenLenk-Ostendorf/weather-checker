import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClothesSelectorService } from './clothes-selector.service';
import { CommonModule } from '@angular/common';
import { WeatherApiService } from './weather-api.service';
import { WeatherForecastComponent } from './weather-forecast/weather-forecast.component';
import { CurrentClothesComponent } from './current-clothes/current-clothes.component';
import { BackpackClothesComponent } from './backpack-clothes/backpack-clothes.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    CommonModule, 
    WeatherForecastComponent, 
    CurrentClothesComponent,
    BackpackClothesComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'what-i-wear';
  weatherData: any;
  clothesData: any;

  constructor(
    private weatherService: WeatherApiService,
    private clothesSelectorService: ClothesSelectorService
  ) {}

  ngOnInit() {
    this.getClothes();
  }

  isCold(): boolean {
    return this.weatherData?.current?.temperature2m < 18;
  }

  isWarm(): boolean {
    return this.weatherData?.current?.temperature2m >= 18;
  }

  isRainy(): boolean {
    if (!this.weatherData?.hourly?.precipitationProbability) return false;
    const currentHour = new Date().getHours();
    return this.weatherData.hourly.precipitationProbability[currentHour] > 30;
  }

  async getClothes() {
    try {
      this.weatherData = await this.weatherService.getWeather();
      this.clothesData = await this.clothesSelectorService.getcurrentClothes();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
}
