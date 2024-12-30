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
  clothesData: any;
  weatherData: any;

  constructor(
    private clothesSelectorService: ClothesSelectorService,
    private weatherService: WeatherApiService
  ) {}

  ngOnInit() {
    this.getClothes();
  }

  async getClothes() {
    try {
      this.weatherData = await this.weatherService.getWeather();
      this.clothesData = await this.clothesSelectorService.getcurrentClothes();
      console.log('Weather data:', this.weatherData);
      console.log('Clothes data:', this.clothesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
}
