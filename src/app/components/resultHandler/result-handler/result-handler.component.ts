import { AlertController } from '@ionic/angular';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ResultsService } from 'src/app/services/results/results.service';
import { alert } from 'ionicons/icons';
import { ResultsModel } from 'src/app/models/results';
import { IonContent, IonHeader, IonTitle, IonToolbar, ToastController } from '@ionic/angular/standalone';
import { user } from '@angular/fire/auth';
@Component({
  selector: 'app-result-handler',
  templateUrl: './result-handler.component.html',
  styleUrls: ['./result-handler.component.scss'],
  standalone: true
})
export class ResultHandlerComponent  implements OnInit, OnChanges {
Result = new ResultsModel()
  constructor(
    private service:ResultsService,
    private alertCtrl:AlertController,
    private toaster:ToastController
  ) { }
  async ngOnChanges(changes: SimpleChanges){
    console.log("result handle for ",this.userKey,this.wodKey);
    const result =  await this.service.getResult(this.userKey,this.wodKey)
    console.log("result",result);
    if(this.userKey && this.wodKey)
    if(result.length == 0){
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
          else{
            console.log("got results",result);
            this.Result = result[0];
          }
  }

  @Input({required:true})  userKey: string = ""
  @Input({required:true})  wodKey: string = ""


  ngOnInit() {
    console.log("result handler",this.userKey,this.wodKey);
  }
   async setResult(){
    console.log("set result");
    const  alert = await this.alertCtrl.create(
      {
        header: 'Nuovo risultato',
        message: 'Vuoi aggiungere un nuovo risultato?',
        inputs: [
          {
            name: 'result',
            type: 'text',
            placeholder: 'risultato',}
            ,
            {
              name: 'date',
              type: 'date',
              value: new Date().toISOString().split('T')[0],
              placeholder: 'data',},
              {
                name: 'note',
                type: 'textarea',
                placeholder: 'note',
              }
        ],
        buttons: [{
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok',data);
            data['userKey'] = this.userKey;
            data['wodKey'] = this.wodKey;
            const result = new ResultsModel(data);
            console.log("result",result);
            this.service.setResult(this.userKey,this.wodKey,result).then((res)=>{
              this.toaster.create({
                message:"risultato aggiunto",
                duration:2000
              }).then((toast)=>{
                toast.present();
              })
            }).catch((err)=>{
              this.toaster.create({
                message:"risultato non aggiunto",
                duration:2000
              }).then((toast)=>{
                toast.present();
            })
            });
          }
        }

        ]}
    )
    await alert.present();
  }

}
