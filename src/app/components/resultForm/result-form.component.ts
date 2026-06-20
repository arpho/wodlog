import { Component, Input, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonItem, IonLabel, IonInput, IonTextarea, IonDatetime, IonDatetimeButton, IonModal } from '@ionic/angular/standalone';
import { CustomSliderComponent } from '../customSlider/custom-slider.component';

@Component({
  selector: 'app-result-form',
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonItem, IonLabel, IonInput, IonTextarea, IonDatetime, IonDatetimeButton, IonModal, CustomSliderComponent],
  templateUrl: './result-form.component.html',
  styleUrls: ['./result-form.component.scss']
})
export class ResultFormComponent implements OnInit {
  @Input() initialResult: string = '';
  @Input() initialDate: string = new Date().toISOString().split('T')[0];
  @Input() initialRating: number = 0;
  @Input() initialNote: string = '';

  resultStr = signal<string>('');
  dateStr = signal<string>('');
  rating = signal<number>(0);
  noteStr = signal<string>('');

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.resultStr.set(this.initialResult || '');
    this.dateStr.set(this.initialDate || new Date().toISOString().split('T')[0]);
    this.rating.set(this.initialRating || 0);
    this.noteStr.set(this.initialNote || '');
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  save() {
    this.modalCtrl.dismiss({
      result: this.resultStr(),
      date: this.dateStr(),
      rating: this.rating(),
      note: this.noteStr()
    }, 'confirm');
  }
}
