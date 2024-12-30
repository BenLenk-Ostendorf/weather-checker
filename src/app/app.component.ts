import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClothesSelectorService } from './clothes-selector.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'what-i-wear';
  clothesData: any;

  constructor(private clothesSelectorService: ClothesSelectorService) {}

  ngOnInit() {
    this.getClothes();
  }

  async getClothes() {
    try {
      this.clothesData = await this.clothesSelectorService.getcurrentClothes();
      console.log('Clothes data:', this.clothesData);
    } catch (error) {
      console.error('Error fetching clothes:', error);
    }
  }
}
