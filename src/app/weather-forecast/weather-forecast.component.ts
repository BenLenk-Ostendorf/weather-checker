import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather-forecast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.scss']
})
export class WeatherForecastComponent {
  @Input() weatherData: any;

  getCurrentHourIndex(): number {
    if (!this.weatherData?.hourly?.time) return 0;
    
    const now = new Date();
    return this.weatherData.hourly.time.findIndex((time: string) => {
      const forecastTime = new Date(time);
      return forecastTime.getHours() === now.getHours() && 
             forecastTime.getDate() === now.getDate();
    });
  }

  getNextHoursForecast(): any[] {
    if (!this.weatherData?.hourly) return [];
    
    const startIndex = this.getCurrentHourIndex();
    if (startIndex === -1) return [];

    const endIndex = startIndex + 8;
    const hourlyData = this.weatherData.hourly;
    
    return Array.from({ length: 8 }, (_, i) => {
      const index = startIndex + i;
      if (index >= hourlyData.time.length) return null;
      
      return {
        time: new Date(hourlyData.time[index]),
        temperature: hourlyData.temperature2m[index],
        rainProbability: hourlyData.precipitationProbability[index]
      };
    }).filter(item => item !== null);
  }
}
