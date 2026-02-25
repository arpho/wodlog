import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonFooter,
  IonButton,
  IonButtons,
  IonIcon,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, saveOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-exercise-modal',
  templateUrl: './exercise-modal.component.html',
  styleUrls: ['./exercise-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonFooter,
    IonButton,
    IonButtons,
    IonIcon
  ]
})
export class ExerciseModalComponent implements OnInit {
  @Input() title: string = 'Esercizio';
  @Input() exerciseName: string = '';
  @Input() isEditing: boolean = false;

  constructor(private modalCtrl: ModalController) {
    addIcons({ closeOutline, saveOutline, trashOutline });
  }

  ngOnInit() { }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.exerciseName, 'save');
  }

  remove() {
    return this.modalCtrl.dismiss(null, 'remove');
  }
}

