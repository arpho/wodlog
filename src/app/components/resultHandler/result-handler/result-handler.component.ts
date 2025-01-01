import { AlertController } from '@ionic/angular';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ResultsService } from 'src/app/services/results/results.service';
import { alert } from 'ionicons/icons';

@Component({
  selector: 'app-result-handler',
  templateUrl: './result-handler.component.html',
  styleUrls: ['./result-handler.component.scss'],
  standalone: true
})
export class ResultHandlerComponent  implements OnInit, OnChanges {

  constructor(
    private service:ResultsService,
    private alertCtrl:AlertController
  ) { }
  async ngOnChanges(changes: SimpleChanges){
    console.log("result handler",this.userKey,this.wodKey);
    const result =  await this.service.getResult(this.userKey,this.wodKey)
    console.log("result",result);
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
        input
        buttons: [

        ]}
    )
    await alert.present();
  }

}
