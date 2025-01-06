import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output, OnChanges, SimpleChanges, signal } from '@angular/core';
import { PrModel } from 'src/app/models/Pr';
import { CommonModule } from '@angular/common';
import { IonGrid, IonRow, IonCol, IonCard, IonButton, IonIcon, IonFabButton, IonFab, IonButtons } from "@ionic/angular/standalone";
import { AlertController } from '@ionic/angular';
import { PrestazionePipe } from 'src/app/pipes/prestazione/prestazione.pipe';
@Component({
  selector: 'app-pr-list',
  templateUrl: './pr-list.component.html',
  styleUrls: ['./pr-list.component.scss'],
  standalone: true,
  imports: [IonButtons, IonFab,
    CommonModule,
        IonGrid,
  IonCard,
  IonCol,
  IonRow,
IonIcon,
  IonButton,
  PrestazionePipe
],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrListComponent  implements OnInit, OnChanges {
  pr = new PrModel()



  makeAlert4kg(pr:PrModel,title:string){
console.log("make alert for Kg",pr);
 return  this.alertCtrl.create({
  header:title,
  inputs: [
    {
      name: 'prestazione',
      placeholder:'massimale',
      type: 'number',
      label: 'prestazione',
      value: pr.prestazione,
    },
    {
      name: 'data',
      placeholder: 'data',
      type: 'date',
      value: new Date(pr.date).toISOString().split('T')[0],
    },
    {
      name: 'note',
      type: 'text',
      value: pr.note,
    },
  ],
  buttons: [
    {
      text: 'Cancel',
      role: 'cancel',
      cssClass: 'secondary',
      handler: () => {
        console.log('Confirm Cancel');
      },
    },
    {
      text: 'Ok',
      handler: (data: { prestazione: number; note: string; data: string | number | Date; }) => {
        console.log('Confirm Ok', data);
        pr.prestazione = data.prestazione
        pr.note = data.note
        pr.unity = " Kg "
        pr.date = new Date(data.data).getTime()
        console.log("edited list ",this.prList)
        this.prList = [...this.prList, pr];
        this.$prList.set(this.prList);
        this.editedPrList.emit(this.prList)
    }
    }
  ]
})




  }

  makeAlert4sec(pr:PrModel,title:string){
    console.log("make alert for sec",pr);
    return   this.alertCtrl.create({
      header:title,
      inputs: [
        {
          name: 'minuti',
          placeholder: 'minuti',
          type: 'number',
          value: Math.floor(Number(pr.prestazione)/60),
        },
        {
          name: 'secondi',
          type: 'number',
          placeholder: 'secondi',
          value: Number(pr.prestazione)%60,
        },
        {placeholder: 'data',
          name: 'data',
          type: 'date',
          value: new Date(pr.date).toISOString().split('T')[0],
        },
        {
          name: 'note',
          type: 'text',
          value: pr.note,
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Ok',
          handler: (data: { minuti: number; secondi: number; note: string; data: string | number | Date; }) => {
            console.log('Confirm Ok', data);
            pr.prestazione = Number(data.minuti)*60 + Number(data.secondi);
            pr.note = data.note
            pr.unity = ' sec '
            pr.date = new Date(data.data).getTime()
            console.log("edited list ",this.prList)
            this.prList = [...this.prList, pr];
            this.$prList.set(this.prList);
            this.editedPrList.emit(this.prList)
        }
        }
      ]
    })
}

makeAlert(pr:PrModel,title:string){
  console.log("unity",this.unity);
  return this.unity.includes('Kg')?this.makeAlert4kg(pr,title):this.makeAlert4sec(pr,title)
}
  async addPr() {
console.log("add pr for ",this.unity);

const pr = new PrModel()
let alert = await this.makeAlert(pr,"nuovo pr")
await alert.present();
const result = await alert.onDidDismiss();
}
  $prList = signal<PrModel[]>([])











  async editPr(pr: PrModel) {
console.log("edit pr",pr);
const alert = await this.makeAlert(pr,"modifica pr");
await alert.present();
const result = await alert.onDidDismiss();
console.log(result);

}

showDate(arg0: number) {
return new Date(arg0).toLocaleDateString()
}
  @Input({required:true})  prList:PrModel[] = []
  @Input({required:true})  unity:string = ''
  @Output() editedPrList = new EventEmitter<PrModel[]>()

  constructor(
    private alertCtrl: AlertController
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.$prList.set(this.prList);

console.log("pr list changes",this.prList,this.unity)
  }

  ngOnInit() {
    this.$prList.set(this.prList);
    console.log("pr list",this.prList) ;
  }

}
