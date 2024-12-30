import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ClothesItem {
  name: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-backpack-clothes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './backpack-clothes.component.html',
  styleUrls: ['./backpack-clothes.component.scss']
})
export class BackpackClothesComponent {
  @Input() clothesData: any;

  clothesItems: ClothesItem[] = [
    { name: 'pullover', icon: '⚫️', label: 'Pullover' },
    { name: 'leatherjacket', icon: '🧥', label: 'Leather Jacket' },
    { name: 'rainjacket', icon: '🌧️', label: 'Rain Jacket' },
    { name: 'rainPants', icon: '👖', label: 'Rain Pants' }
  ];

  getBackpackClothes(): ClothesItem[] {
    if (!this.clothesData?.backpack) return [];
    return this.clothesItems.filter(item => this.clothesData.backpack[item.name]);
  }
}
