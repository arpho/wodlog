import { UsersService } from './../../../services/users/users.service';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivityModel } from 'src/app/models/activityModel';
import { IonGrid, IonRow, IonCol, IonCard, IonButton, IonIcon, IonFabButton, IonFab, IonItem, IonItemSliding, IonItemOptions, IonItemOption,AlertController,ToastController,IonSearchbar, SearchbarChangeEventDetail } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PrestazionePipe } from "../../../pipes/prestazione/prestazione.pipe";
import { ActivityService } from 'src/app/services/activity/activity.service';
import { PaginatorComponent } from '../../paginator/paginator.component';
import { PaginationOptions } from 'src/app/models/paginationOptions';
import { IonSearchbarCustomEvent } from '@ionic/core';
import { FilterPipe } from "../../pipes/customFilter/filterPipe.pipe";

@Component({
  selector: 'app-pr-table',
  templateUrl: './pr-table.component.html',
  styleUrls: ['./pr-table.component.scss'],
  standalone: true,
  imports: [IonItemOption,
    IonItemOptions,
    IonItemSliding,
    PaginatorComponent,
    IonItem,
    IonSearchbar,
    IonFab,
    IonFabButton,
    IonIcon,
    IonButton,
    IonCard,
    IonCol,
    IonRow,
    IonGrid,
    CommonModule,
    IonFabButton,
    IonFab, PrestazionePipe, FilterPipe],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class PrTableComponent  implements OnInit,OnChanges {

  filter= (pr:ActivityModel) => true
search($event: any) {
console.log("search", $event.detail.value);
this.filter = (pr:ActivityModel) => pr.descrizione.toLowerCase().includes($event.detail.value.toLowerCase())
console.log("filtered pr", this.prList.filter(this.filter))
}
  paginationOptions:PaginationOptions = {
    page: 1,
    limit: 10,
    total: 0
  }
  async deletePr(activity: ActivityModel) {
console.log("delete pr",activity);
const alert = await this.alertCtrl.create({
  header: `conferma eliminazione di ${activity.descrizione}?`,
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
      text: 'Elimina',
      handler: async () => {
        console.log('Confirm Ok');
        const loggedUser = await this.users.getLoggedUser()
        this.service.delete(loggedUser.key, activity).then(res=>{
          const toast = this.ToastController.create({
            message: 'Pr eliminato',
            duration: 2000
          });
          toast.then(res=>res.present())
        }).catch(err=>{
          const toast = this.ToastController.create({
            message: 'Pr non eliminato',
            duration: 2000
          });
          toast.then(res=>res.present())
        })
      },
    },

  ]
})
await alert.present()
}
createActivity() {
console.log("create activity")
this.router.navigateByUrl(`/create-activity`)
}
  async editPr(activity: ActivityModel) {
console.log("edit pr",activity)
const alert = await this.alertCtrl.create({
  header: 'Scegli azione da eseguire',
  buttons: [
    {
      text: 'Modifica',
      handler: () => {
        this.router.navigateByUrl(`/edit-activity?activityKey=${activity.key}`)
      }
    },
    {
      text: 'Elimina',
      handler: () => {
        this.deletePr(activity);
      }
    }
  ],
  backdropDismiss: false
})
await alert.present();

//this.router.navigateByUrl(`/edit-activity?activityKey=${activity.key}`)
}
showPr(_t16: ActivityModel) {
}
@Input({required:true})  prList:ActivityModel[] = []

  constructor(
    private router:Router,
    private alertCtrl: AlertController,
    private service:ActivityService,
    private users:UsersService,
    private ToastController: ToastController

  ) { }
  ngOnChanges(changes: SimpleChanges): void {
this.prList = changes['prList'].currentValue
  if(this.prList.length >0){
  }
}


  ngOnInit() {

    console.log(" got user's key",this.prList);
  }

}
