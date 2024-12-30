import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ClothesItem {
  name: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-current-clothes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './current-clothes.component.html',
  styleUrls: ['./current-clothes.component.scss']
})
export class CurrentClothesComponent {
  @Input() clothesData: any;

  clothesItems: ClothesItem[] = [
    { name: 'pullover', icon: '⚫️', label: 'Pullover' },
    { name: 'leatherjacket', icon: '🧥', label: 'Leather Jacket' },
    { name: 'rainjacket', icon: '🌧️', label: 'Rain Jacket' },
    { name: 'rainPants', icon: '👖', label: 'Rain Pants' },
    { name: 'bike', icon: '🚲', label: 'Bike' }
  ];

  getRecommendedClothes(): ClothesItem[] {
    if (!this.clothesData?.clothes) return [];
    return this.clothesItems.filter(item => this.clothesData.clothes[item.name]);
  }
}
