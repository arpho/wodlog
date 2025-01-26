import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { WodFormComponent } from '../../../../components/wodForm/wodForm/wod-form/wod-form.component';
import { WodModel } from 'src/app/models/wod';
import { WodService } from 'src/app/services/wod/wod.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-wod',
  templateUrl: './create-wod.page.html',
  styleUrls: ['./create-wod.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    WodFormComponent,
  ],
})
export class CreateWodPage implements OnInit {
  weeksDays = [
    'domenica',
    'lunedi',
    'martedi',
    'mercoledi',
    'giovedi',
    'venerdi',
    'sabato',
  ];

  constructor(
    private service: WodService,
    private toaster: ToastController,
    private router: Router
  ) {}
  ngOnInit() {
    console.log('init create wod page');
  }
  makeTitle(wod: WodModel) {
    const d = new Date(wod.date);
    return (
      wod.title ||
      `wod di ${this.weeksDays[d.getDay()]} ${d.toLocaleDateString()}`
    );
  }

  createWodAndSetTitle(wod: WodModel) {
    wod.title = this.makeTitle(wod);
    this.createWod(wod);
  }
  createWod(wod: WodModel) {
    console.log('submitted wod', wod);
    this.service
      .createWod(wod)
      .then(async (wodKey) => {
        const toast = await this.toaster.create({
          message: 'Wod created',
          duration: 2000,
        });
        toast.present();
        if (wodKey) this.router.navigateByUrl('/edit-wod?wodKey=' + wodKey);
      })
      .catch(async (err: any) => {
        console.log('error', err);
        const toast = await this.toaster.create({
          message: 'Wod not created',
          duration: 2000,
        });
        toast.present();
        toast.onDidDismiss().then(() => {
         this.router.navigate(['/wods-list'])
        })
      });
  }
  wod = new WodModel();
}
