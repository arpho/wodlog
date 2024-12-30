import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-edit-wod',
  templateUrl: './edit-wod.page.html',
  styleUrls: ['./edit-wod.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class EditWodPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
