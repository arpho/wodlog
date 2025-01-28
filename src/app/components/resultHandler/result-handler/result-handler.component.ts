import { get } from 'firebase/database';
import { AlertController } from '@ionic/angular';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import { ResultsService } from 'src/app/services/results/results.service';
import { alert } from 'ionicons/icons';
import { ResultsModel } from 'src/app/models/results';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { user } from '@angular/fire/auth';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users/users.service';
@Component({
  selector: 'app-result-handler',
  templateUrl: './result-handler.component.html',
  styleUrls: ['./result-handler.component.scss'],
  standalone: true,
})
export class ResultHandlerComponent implements OnInit, OnChanges {
showResult() {
return this.Result()? this.Result().result:"no result";
}
  Result = signal<ResultsModel>(new ResultsModel());
  constructor(
    private service: ResultsService,
    private alertCtrl: AlertController,
    private toaster: ToastController,
    private users: UsersService,
    private router: Router,
     private activatedRoute: ActivatedRoute
  ) {}
  async ngOnChanges(changes: SimpleChanges) {
    console.log("changes", changes);

    console.log('ask for new result', this.ask4newResult);
    if (this.userKey && this.wodKey&& this.ask4newResult )
       {
        const alert = await this.alertCtrl.create({
          header: 'Nuovo risultato',
          message: 'Vuoi aggiungere un nuovo risultato?',
          buttons: [
            {
              text: 'No',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Confirm Cancel');
              },
            },
            {
              text: 'Si',
              handler: () => {
                console.log('Confirm Ok');
                this.setResult();
              },
            },
          ],
        });
        await alert.present();
      }
  }

  @Input({ required: true }) userKey: string = '';
  @Input({ required: true }) wodKey: string = '';
  @Input() ask4newResult=false

  async ngOnInit() {
    const paramGetter:Promise<Params> = new Promise((resolve, reject) => {
      this.activatedRoute.params.subscribe((params) => {
        resolve(params);
      })
    })
    const params = await paramGetter;
    const wodKey = params['wodKey'];
    const user = await this.users.getLoggedUser();
    this.userKey = user.key;
    const result = await this.service.getResult(this.userKey, this.wodKey);
    this.Result.set(result[0]);
    console.log('result', result);
    console.log('ask for new result', this.ask4newResult);
    if (this.userKey && this.wodKey&& this.ask4newResult)
      if (result.length == 0) {
        const alert = await this.alertCtrl.create({
          header: 'Nuovo risultato',
          message: 'Vuoi aggiungere un nuovo risultato?',
          buttons: [
            {
              text: 'No',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Confirm Cancel');
              },
            },
            {
              text: 'Si',
              handler: () => {
                console.log('Confirm Ok');
                this.setResult();
              },
            },
          ],
        });
        await alert.present();
      } else {
        this.Result.set(result[0]);
      }
    console.log('result', result);
    this.Result.set(result[0]);
  }
  async setResult() {
    const alert = await this.alertCtrl.create({
      header: 'Nuovo risultato',
      message: 'Vuoi aggiungere un nuovo risultato?',
      inputs: [
        {
          name: 'result',
          type: 'text',
          placeholder: 'risultato',
        },
        {
          name: 'date',
          type: 'date',
          value: new Date().toISOString().split('T')[0],
          placeholder: 'data',
        },
        {
          name: 'note',
          type: 'textarea',
          placeholder: 'note',
        },
      ],
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok', data);
            data['userKey'] = this.userKey;
            data['wodKey'] = this.wodKey;
            const result = new ResultsModel(data);
            console.log('result', result);
            this.service
              .setResult(this.userKey, this.wodKey, result)
              .then((res) => {
                this.toaster
                  .create({
                    message: 'risultato aggiunto',
                    duration: 2000,
                  })
                  .then((toast) => {
                    toast.present();
                  });
              })
              .catch((err) => {
                this.toaster
                  .create({
                    message: 'risultato non aggiunto',
                    duration: 2000,
                  })
                  .then((toast) => {
                    toast.present();
                  });
              }).finally(() => {
                this.router.navigateByUrl('/wods-list')
              });
          },
        },
      ],
    });
    await alert.present();
  }
}
