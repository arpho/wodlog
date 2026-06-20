import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent } from '@ionic/angular/standalone';
import { CustomSliderComponent } from '../customSlider/custom-slider.component';

@Component({
  selector: 'app-wod-rating',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, CustomSliderComponent],
  templateUrl: './wod-rating.component.html',
  styleUrls: ['./wod-rating.component.scss']
})
export class WodRatingComponent {
  @Input() wodTitle: string = '';
  rating = signal<number>(0);

  constructor(private modalCtrl: ModalController) {}

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  save() {
    this.modalCtrl.dismiss({ rating: this.rating() }, 'confirm');
  }
}
