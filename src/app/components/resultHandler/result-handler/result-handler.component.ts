import { update } from '@firebase/database';
import { get } from 'firebase/database';
import { AlertController, ModalController } from '@ionic/angular';
import { ResultFormComponent } from '../../resultForm/result-form.component';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import { ResultsService } from 'src/app/services/results/results.service';
import { alert, createOutline } from 'ionicons/icons';
import { ResultsModel } from 'src/app/models/results';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ToastController, IonButton, IonIcon } from '@ionic/angular/standalone';
import { user } from '@angular/fire/auth';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users/users.service';
import { addIcons } from 'ionicons';
@Component({
  selector: 'app-result-handler',
  templateUrl: './result-handler.component.html',
  styleUrls: ['./result-handler.component.scss'],
  imports: [IonContent,
    IonHeader,
     IonTitle,
     IonToolbar,
      IonButton,
      IonIcon],
  standalone: true,
})
export class ResultHandlerComponent implements OnInit, OnChanges {
async updateResult() {
  console.log("update result", this.Result());
  const modal = await this.modalCtrl.create({
    component: ResultFormComponent,
    componentProps: {
      initialResult: this.Result().result,
      initialDate: this.Result().date ? new Date(this.Result().date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      initialRating: this.Result().rating,
      initialNote: this.Result().note
    },
    cssClass: 'result-modal'
  });
  
  await modal.present();
  
  const { data, role } = await modal.onWillDismiss();
  
  if (role === 'confirm' && data) {
    console.log('Confirm Ok', data);
    data['userKey'] = this.userKey;
    data['wodKey'] = this.wodKey;
    const result = this.Result();
    result.result = data.result;
    result.date = new Date(data.date).getTime();
    result.note = data.note;
    if (data.rating) result.rating = Number(data.rating);
    result.key = this.Result().key
    this.Result.set(result);
    console.log('result', result);
    this.service.updateResult(result).then((res) => {
      console.log('res', res);
      this.toaster.create({
        message: 'risultato aggiornato',
        duration: 3000,
        position: 'bottom',
        color: 'success',
      }).then((toast) => {
        toast.present();
      });
    }).catch((err) => {
      this.toaster.create({
        message: 'risultato non aggiornato',
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      }).then((toast) => {
        console.log('err', err);
        toast.present();
      });
    }).finally(() => {
      this.router.navigateByUrl('/home');
    });
  }
}
showResult() {
return this.Result()? this.Result().result:"no result";
}
  Result = signal<ResultsModel>(new ResultsModel());

  @Input({ required: true }) userKey: string = '';
  @Input({ required: true }) wodKey: string = '';
  @Input() ask4newResult=false;
  @Input() showButton = true;

  constructor(
    private service: ResultsService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private toaster: ToastController,
    private users: UsersService,
    private router: Router,
     private activatedRoute: ActivatedRoute
  ) {
      addIcons({createOutline});}
  async ngOnChanges(changes: SimpleChanges) {
    console.log("changes", changes);
    const result = await this.service.getResult(this.userKey, this.wodKey);

    if (this.userKey && this.wodKey&& this.ask4newResult && result.length == 0)
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
      else {
        this.Result.set(result[0]);
      }
  }

  async ngOnInit() {
const queryParamGetter = new Promise((resolve, reject) => {
  this.activatedRoute.queryParams.subscribe((params: Params) => {
    resolve(params);
  });
})


    const user = await this.users.getLoggedUser();
    this.userKey = user.key;
     const result = await this.service.getResult(this.userKey, this.wodKey);
    this.Result.set(result[0]);
    if (this.userKey && this.wodKey&& this.ask4newResult &&result.length==0){
console.log("userKey", this.userKey);
console.log("wodKey", this.wodKey);
console.log("ask4newResult", this.ask4newResult);
console.log("result", result.length);
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
    this.Result.set(result[0]);
  }
  async setResult() {
    const modal = await this.modalCtrl.create({
      component: ResultFormComponent,
      componentProps: {},
      cssClass: 'result-modal'
    });
    
    await modal.present();
    
    const { data, role } = await modal.onWillDismiss();
    
    if (role === 'confirm' && data) {
      console.log('Confirm Ok', data);
      data['userKey'] = this.userKey;
      data['wodKey'] = this.wodKey;
      if (data.date) data.date = new Date(data.date).getTime();
      if (data.rating) data.rating = Number(data.rating);
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
    }
  }
}
