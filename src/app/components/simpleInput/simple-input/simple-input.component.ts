import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonFooter, ModalController, IonCard, IonCardContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-simple-input',
  templateUrl: './simple-input.component.html',
  styleUrls: ['./simple-input.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonHeader, 
    IonToolbar, 
    IonButtons, 
    IonButton, 
    IonTitle, 
    IonContent, 
    IonItem, 
    IonLabel, 
    IonInput,
    IonFooter,
    IonCard,
    IonCardContent
  ]
})
export class SimpleInputComponent implements OnInit {
  @Input() title: string = 'Aggiungi';
  @Input() value: string = '';
  @Input() isEditing: boolean = false;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  save() {
    this.modalCtrl.dismiss(this.value, 'confirm');
  }

  delete() {
    this.modalCtrl.dismiss(null, 'delete');
  }
}
