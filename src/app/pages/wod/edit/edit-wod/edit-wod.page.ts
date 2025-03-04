import { alert } from 'ionicons/icons';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  AlertController,
  IonBackButton,
  ToastController, IonButtons } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/services/users/users.service';
import { WodModel } from 'src/app/models/wod';
import { WodService } from 'src/app/services/wod/wod.service';
import { WodFormComponent } from '../../../../components/wodForm/wodForm/wod-form/wod-form.component';
import { ResultHandlerComponent } from 'src/app/components/resultHandler/result-handler/result-handler.component';
import { UserModel } from '/home/giuseppe/Documenti/projects/wodLog/src/app/models/userModel';

@Component({
  selector: 'app-edit-wod',
  templateUrl: './edit-wod.page.html',
  styleUrls: ['./edit-wod.page.scss'],
  standalone: true,
  imports: [IonButtons,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    IonBackButton,
    FormsModule,
    WodFormComponent,
    ResultHandlerComponent,
  ],
})
export class EditWodPage implements OnInit {
  title = signal('Editing wod');
setResult = true
  async deleteWod(arg0: string) {
    console.log('delete wod', arg0);
    const alert = this.alertCtrl.create({
      header: 'Attenzione',
      message: 'Sei sicuro di voler cancellare il Wod?',
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
        },
        {
          text: 'Si, cancellalo',
          handler: () => {
            this.wods
              .deleteWod(this.Wod)
              .then(() => {
                this.toaster
                  .create({
                    message: 'Wod cancellato',
                    duration: 2000,
                  })
                  .then((toast) => {
                    toast.present();
                  });
              })
              .catch((err) => {
                this.toaster
                  .create({
                    message: 'Wod non cancellato',
                    duration: 2000,
                  })
                  .then((toast) => {
                    toast.present();
                  });
              });
          },
        },
      ],
    });
    await alert.then((res) => res.present());
  }
  loggedUser: import('/home/giuseppe/Documenti/projects/wodLog/src/app/models/userModel').UserModel =
    new UserModel();
  updateWod(wod: WodModel) {
    console.log('updating wod', wod);
    this.wods
      .updateWod(wod)
      .then(() => {
        this.toaster
          .create({
            message: 'Wod aggiornato',
            duration: 2000,
          })
          .then((toast) => {
            toast.present();
          });
      })
      .catch((err) => {
        this.toaster
          .create({
            message: 'Wod non aggiornato',
            duration: 2000,
          })
          .then((toast) => {
            toast.present();
          });
      });
  }
  subscriptions = new Subscription();
  Wod = new WodModel();

  constructor(
    private route: ActivatedRoute,
    private users: UsersService,
    private wods: WodService,
    private alertCtrl: AlertController,
    private toaster: ToastController
  ) {}

  async ngOnInit() {
    this.loggedUser = await this.users.getLoggedUser();
    this.subscriptions.add(
      this.route.queryParams.subscribe(async (params) => {
        this.loggedUser = await this.users.getLoggedUser();
        this.Wod = await this.wods.getWodByKey(params['wodKey']);
        this.title.set(`Editing ${this.Wod.title}`);
      })
    );
  }
}
