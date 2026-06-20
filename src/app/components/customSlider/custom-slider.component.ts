import { Component, input, model, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { star } from 'ionicons/icons';

@Component({
  selector: 'app-custom-slider',
  standalone: true,
  imports: [CommonModule, IonIcon],
  templateUrl: './custom-slider.component.html',
  styleUrls: ['./custom-slider.component.scss']
})
export class CustomSliderComponent {
  maxValue = input<number>(5);
  iconType = input<'star' | 'bar'>('star');
  value = model<number>(0);

  items = computed(() => {
    return Array.from({ length: this.maxValue() }, (_, i) => i + 1);
  });

  constructor() {
    addIcons({ star });
  }

  selectValue(val: number) {
    this.value.set(val);
  }

  getColor(index: number) {
    if (index > this.value()) {
      return 'medium';
    }
    if (this.iconType() === 'star') {
      return 'warning';
    }
    // RPE bar colors
    const ratio = index / this.maxValue();
    if (ratio <= 0.4) return 'success';
    if (ratio <= 0.7) return 'primary';
    if (ratio <= 0.9) return 'warning';
    return 'danger';
  }
}
