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
import { Router } from '@angular/router';
@Component({
  selector: 'app-result-handler',
  templateUrl: './result-handler.component.html',
  styleUrls: ['./result-handler.component.scss'],
  standalone: true,
})
export class ResultHandlerComponent implements OnInit, OnChanges {
  Result = signal<ResultsModel>(new ResultsModel());
  constructor(
    private service: ResultsService,
    private alertCtrl: AlertController,
    private toaster: ToastController,
    private router: Router
  ) {}
  async ngOnChanges(changes: SimpleChanges) {
    const result = await this.service.getResult(this.userKey, this.wodKey);
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
  }

  @Input({ required: true }) userKey: string = '';
  @Input({ required: true }) wodKey: string = '';
  @Input() ask4newResult=false

  async ngOnInit() {
    console.log('result handler', this.userKey, this.wodKey);
    const result = await this.service.getResult(this.userKey, this.wodKey);
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
