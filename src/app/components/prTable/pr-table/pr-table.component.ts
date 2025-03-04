import { update } from '@firebase/database';
import { UsersService } from './../../../services/users/users.service';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivityModel } from 'src/app/models/activityModel';
import { IonGrid, IonRow, IonCol, IonCard, IonButton, IonIcon, IonFabButton, IonFab, IonFabList, IonActionSheet,IonItem, IonItemSliding, IonItemOptions, IonItemOption,AlertController,ToastController,IonSearchbar, SearchbarChangeEventDetail } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PrestazionePipe } from "../../../pipes/prestazione/prestazione.pipe";
import { ActivityService } from 'src/app/services/activity/activity.service';
import { PaginatorComponent } from '../../paginator/paginator.component';
import { PaginationOptions } from 'src/app/models/paginationOptions';
import { IonActionSheetCustomEvent, IonSearchbarCustomEvent, OverlayEventDetail } from '@ionic/core';
import { FilterPipe } from "../../pipes/customFilter/filterPipe.pipe";
import { PrModel } from 'src/app/models/Pr';
import { text } from 'ionicons/icons';

@Component({
  selector: 'app-pr-table',
  templateUrl: './pr-table.component.html',
  styleUrls: ['./pr-table.component.scss'],
  standalone: true,
  imports:
  // eslint-disable-next-line
  [
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    PaginatorComponent,
    IonItem,
    IonSearchbar,
    IonFab,
    IonFabButton,
    IonFabButton,
    IonFab,
    IonFabList,
    IonIcon,
    IonButton,
    IonCard,
    IonCol,
    IonRow,
    IonGrid,
    CommonModule,
    IonFabButton,
    IonActionSheet,
    IonFab,
     PrestazionePipe,
      FilterPipe
    ],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class PrTableComponent  implements OnInit,OnChanges {

  selectedActivity: ActivityModel = new ActivityModel();
  constructor(
    private router:Router,
    private alertCtrl: AlertController,
    private service:ActivityService,
    private users:UsersService,
    private ToastController: ToastController

  ) { }
actionSheetDidDismiss($event: IonActionSheetCustomEvent<OverlayEventDetail<any>>) {
switch($event.detail.data.action){
  case 'delete':
    console.log("delete")
    break;
  case 'newPr':
    console.log("newPr")
    console.log("adding pr 2", this.selectedActivity)
    this.addPr(this.selectedActivity)
    break;
  case 'cancel':
    console.log("cancel")
    break;
    case 'edit':
      console.log("edit")
      this.editPr(this.selectedActivity)
      break;
  default:
    console.log("default")
    break
}
  this.setOpen(false)
}

  public actionSheetButtons:any[] = [];
openActions(_t25: any) {
console.log("opening actions 4",_t25)
this.selectedActivity = _t25
this.actionSheetButtons = [
  {
    text: `Elimina ${_t25.descrizione}`,
    role: 'destructive',
    icon:'trash-outline',
    data: {
      action: 'delete',
    },
  },
  {
    text: `Modifica ${_t25.descrizione}`,
    icon:'eye',
    data: {
      action: 'edit',
    },
  },
  {
    text: `registra un nuovo pr per ${_t25.descrizione}`,
    icon:'stats-chart',
    data: {
      action: 'newPr',
    },
  },
  {
    text: 'Cancel',
    role: 'cancel',
    data: {
      action: 'cancel',
    },
  },
];

this.setOpen(true)
}
addPr(activity: ActivityModel) {
console.log("add pr 2",activity)
const pr = new PrModel()
pr.unity = activity.unity
const alert =  activity.unity.includes('Kg')
? this.makeAlert4kg(pr, `nuovo pr per ${activity.descrizione}`,activity)
: this.makeAlert4sec(pr, `nuovo pr per ${activity.descrizione}`,activity);
alert.then(alert => alert.present())
}

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

  isActionSheetOpen = false;

  setOpen(isOpen: boolean) {
    this.isActionSheetOpen = isOpen;
  }

  makeAlert4kg(pr: PrModel, title: string,activity: ActivityModel) {
    return this.alertCtrl.create({
      header: title,
      inputs: [
        {
          name: 'prestazione',
          placeholder: 'massimale',
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
          handler: (data: {
            prestazione: number;
            note: string;
            data: string | number | Date;
          }) => {
            console.log('Confirm Ok', data);
            pr.prestazione = Number(data.prestazione);
            pr.note = data.note;
            pr.unity = ' Kg ';
            pr.date = new Date(data.data).getTime();console.log("new pr",pr)
            activity.prList.push(pr)
            console.log("new activity",activity)
            this.updateActivity(activity)

          },
        },
      ],
    });
  }

  makeAlert4sec(pr: PrModel, title: string, activity: ActivityModel) {
    return this.alertCtrl.create({
      header: title,
      inputs: [
        {
          name: 'minuti',
          placeholder: 'minuti',
          type: 'number',
          value: Math.floor(Number(pr.prestazione) / 60),
        },
        {
          name: 'secondi',
          type: 'number',
          placeholder: 'secondi',
          value: Number(pr.prestazione) % 60,
        },
        {
          placeholder: 'data',
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
          handler: (data: {
            minuti: number;
            secondi: number;
            note: string;
            data: string | number | Date;
          }) => {
            console.log('Confirm Ok', data);
            pr.prestazione = Number(data.minuti) * 60 + Number(data.secondi);
            pr.note = data.note;
            pr.unity = ' sec ';
            pr.date = new Date(data.data).getTime();
            pr.date = new Date(data.data).getTime();console.log("new pr",pr)
            activity.prList.push(pr)
            this.updateActivity(activity).then(res=>{
              const toast = this.ToastController.create({})

          }).catch(err=>{
            const toast = this.ToastController.create({
              message: 'Pr non aggiunto',
              duration: 2000
            });
            toast.then(res=>res.present())
          })
        }
      }
      ]
    });
  }



async updateActivity(activity: ActivityModel) {

  this.service.update(this.userKey,activity).then(res=>{
    const toast = this.ToastController.create({
      message: 'Pr aggiunto',
      duration: 2000
    });
    toast.then(res=>res.present())
  }).catch(err=>{
    const toast = this.ToastController.create({
      message: 'Pr non aggiunto',
      duration: 2000
    });
    toast.then(res=>res.present())
  })
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
this.router.navigateByUrl(`/edit-activity?activityKey=${activity.key}`)

//this.router.navigateByUrl(`/edit-activity?activityKey=${activity.key}`)
}
showPr(_t16: ActivityModel) {
}
@Input({required:true})  prList:ActivityModel[] = []
userKey:string=""

  ngOnChanges(changes: SimpleChanges): void {
this.prList = changes['prList'].currentValue
  if(this.prList.length >0){
  }
}


  async ngOnInit() {
this.userKey = (await this.users.getLoggedUser()).key

  }

}
