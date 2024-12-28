import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output, OnChanges, SimpleChanges, signal } from '@angular/core';
import { PrModel } from 'src/app/models/Pr';
import { CommonModule } from '@angular/common';
import { IonGrid, IonRow, IonCol, IonCard, IonButton, IonIcon, IonFabButton, IonFab, IonButtons } from "@ionic/angular/standalone";
import { AlertController } from '@ionic/angular';
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
  IonFabButton
],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrListComponent  implements OnInit, OnChanges {
  async addPr() {
console.log("add pr");

const pr = new PrModel()
const alert = await this.alertCtrl.create({
  header:` nuovo pr`,
  inputs: [
    {
      name: 'prestazione',
      type: 'number',
      value: pr.prestazione,
    },
    {
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
      handler: (data) => {
        console.log('Confirm Ok', data);
        pr.prestazione = data.prestazione
        pr.note = data.note
        pr.date = new Date(data.data).getTime()
        console.log("edited list ",this.prList)
        this.prList = [...this.prList, pr];
        this.$prList.set(this.prList);
        this.editedPrList.emit(this.prList)
    }
    }
  ]
})
await alert.present();
const result = await alert.onDidDismiss();
}
  $prList = signal<PrModel[]>([])











  async editPr(pr: PrModel) {
console.log("edit pr",pr);
const alert = await this.alertCtrl.create({
  header:` edit pr`,
  inputs: [
    {
      name: 'prestazione',
      type: 'number',
      value: pr.prestazione,
    },
    {
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
      handler: (data) => {
        console.log('Confirm Ok', data);
        pr.prestazione = data.prestazione
        pr.note = data.note
        pr.date = new Date(data.data).getTime()
        console.log("edited list ",this.prList)
        this.prList = [...this.prList]
        this.$prList.set(this.prList);
        this.editedPrList.emit(this.prList)
    }
    }
  ]
})
await alert.present();
const result = await alert.onDidDismiss();
console.log(result);

}

showDate(arg0: number) {
return new Date(arg0).toLocaleDateString()
}
  @Input({required:true})  prList:PrModel[] = []
  @Output() editedPrList = new EventEmitter<PrModel[]>()

  constructor(
    private alertCtrl: AlertController
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.$prList.set(this.prList);
console.log("pr list changes",this.prList)
  }

  ngOnInit() {
    this.$prList.set(this.prList);
    console.log("pr list",this.prList) ;
  }

}
