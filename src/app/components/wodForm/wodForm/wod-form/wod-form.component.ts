import { IonFab, IonToggle, IonButtons, IonToolbar } from '@ionic/angular/standalone';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { WodModel } from 'src/app/models/wod';
import {
  DatetimeChangeEventDetail,
  IonDatetime,
  IonInput,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  ItemReorderEventDetail,
  IonReorderGroup,
  IonReorder,
  AlertController,
  IonItem, IonFabButton } from '@ionic/angular/standalone';
import {
  InputChangeEventDetail,
  IonDatetimeCustomEvent,
  IonInputCustomEvent,
IonToggleCustomEvent,
ToggleChangeEventDetail,
} from '@ionic/core';
import { addIcons } from 'ionicons';
import { saveOutline, add, alert, checkmarkOutline, createOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wod-form',
  templateUrl: './wod-form.component.html',
  styleUrls: ['./wod-form.component.scss'],
  standalone: true,
  imports: [IonToolbar, IonButtons, IonToggle, IonFabButton,
    IonItem,
    IonList,
    IonCol,
    IonRow,
    IonGrid,
    IonIcon,
    IonIcon,
    IonButton,
    IonInput,
    CommonModule,
    IonDatetime,
    IonReorder,
    IonReorderGroup,
    IonFab
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WodFormComponent implements OnInit, OnChanges {
handleReorder(arg0: any) {
console.log("reorder", arg0)
const wod = this.wod();
const itemMoved = wod.splice(arg0.detail.from, 1)[0];
wod.splice(arg0.detail.to, 0, itemMoved);
arg0.detail.complete();
this.wod.set([...wod])
console.log("wod", wod);

}
test= false
updateHero(event:any){
console.log("hero",event.detail.checked);
this.hero.set(event.detail.checked)
}
updateGirl(event:any){
console.log("girl",event.detail.checked);
this.girl.set(event.detail.checked)
}


updateBenchmark(event:any){
  console.log("benchmark",event.detail.checked);
  this.benchmark.set(event.detail.checked)
  }
async addActivity() {
console.log("adding activity")
const alert = await this.alertCtrl.create({
  header: 'add activity',
  inputs: [
    {
      type: 'text',
      label: 'activity',
      value: '',}
  ],
  buttons: [
    {
      text: 'add',
    handler: (data) => {
      const wodSet = this.wod();
      console.log("wodSet", wodSet)
      wodSet.push(data[0])
      this.wod.set([...wodSet])
      console.log("updated wodset", this.wod())
    }
    }
  ]
})
await alert.present()
}
async addForce() {
console.log("adding force")
const alert = await this.alertCtrl.create({
  header: 'add force',
  inputs: [
    {
      type: 'text',
      label: 'force',
      value: '',}
  ],
  buttons: [
    {
      text: 'add',
    handler: (data) => {
      const forceSet = this.force();
      console.log("wodSet", forceSet)
      forceSet.push(data[0])
      this.force.set([...forceSet])
      console.log("updated wodset", this.wod())
    }
    }
  ]
})
await alert.present()
}
index: any;
  constructor(
    private alertCtrl: AlertController
  ) {
    addIcons({checkmarkOutline,createOutline,add,saveOutline});
  }
  async editWod(_t38: string, index:number) {
 console.log("editing", _t38)
 const alert = await this.alertCtrl.create({
   header: 'edit activity',
   inputs: [
     {
       type: 'text',
       label: 'activity',
       value: _t38,}
   ],
   buttons: [
     {
       text: 'change',
     handler: (data) => {
       const wodSet = this.wod();
       console.log("wodSet", wodSet)
       wodSet[index] = data[0]
       this.wod.set([...wodSet])
       console.log("updated wodset", this.wod())
     }
     },
     {
       text: 'Remove activity',
       handler: (data) => {
         const wodSet = this.wod();
         console.log("wodSet", wodSet)
         wodSet.splice(index,1)
         this.wod.set([...wodSet])
         console.log("remove index",index)
       }}
   ]
 })
 await alert.present()
 }
 async editForce(_t38: string, index:number) {
console.log("editing", _t38)
const alert = await this.alertCtrl.create({
  header: 'edit force',
  inputs: [
    {
      type: 'text',
      label: 'activity',
      value: _t38,}
  ],
  buttons: [
    {
      text: 'change',
    handler: (data) => {
      const forceSet = this.force();
      console.log("wodSet", forceSet)
      forceSet[index] = data[0]
      this.force.set([...forceSet])
      console.log("updated wodset", this.wod())
    }
    }
  ]
})
await alert.present()
}
  wod2Input = signal('');
  updateWod($event: IonInputCustomEvent<InputChangeEventDetail>) {
    const exercises = this.wod()||[];
    this.wod2Input.set('');
    exercises.push(String($event.detail.value));
    this.wod.set(exercises);
    console.log('wod', $event.detail.value);
  }
  force2Input = '';
  updateForce($event: IonInputCustomEvent<InputChangeEventDetail>) {
    const forza = this.force()||[];
    this.force2Input = '';
    forza.push(String($event.detail.value));
    this.force.set(forza);
    console.log('force', this.force());
  }
  @Output() submitWod = new EventEmitter<WodModel>();
  @Input({ required: true }) Wod = new WodModel();
  date = signal(new Date());
  wod = signal<string[]>([]);
  force = signal<string[]>([]);
  title = signal('');
  note = signal('');
  hero = signal(false);
  girl = signal(false);
  benchmark = signal(false);


  ngOnChanges(changes: SimpleChanges): void {

    this.date.set(new Date(this.Wod.date));
    this.title.set(this.Wod.title);
    this.note.set(this.Wod.note);
    this.force.set(this.Wod.force);
    this.wod.set(this.Wod.wod);
    this.force.set(this.Wod.force);
    this.hero.set(this.Wod.hero);
    this.girl.set(this.Wod.girl);
    this.benchmark.set(this.Wod.benchmark);
  }
  submit() {
    this.Wod = new WodModel({
      date: this.date().getTime(),
      key: this.Wod.key,
      title: this.title(),
      note: this.note(),
      force: this.force(),
      wod: this.wod(),
      girl: this.girl(),
      hero: this.hero(),
      benchmark: this.benchmark()
    });
    this.submitWod.emit(this.Wod);
  }
  updateNote($event: IonInputCustomEvent<InputChangeEventDetail>) {
    console.log('note', $event.detail.value);
    this.note.set(String($event.detail.value));
  }
  updateName($event: IonInputCustomEvent<InputChangeEventDetail>) {
    console.log('name', $event.detail.value);
    this.title.set(String($event.detail.value));
  }
  updateDate($event: IonDatetimeCustomEvent<DatetimeChangeEventDetail>) {
    console.log('date', $event);
    this.date.set(new Date(String($event.detail.value)));
  }

  ngOnInit() {
    this.date.set(new Date(this.Wod.date));
    this.title.set(this.Wod.title);
    this.note.set(this.Wod.note);
    this.force.set(this.Wod.force);
    this.wod.set(this.Wod.wod||[]);
    this.force.set(this.Wod.force||[]);
    this.wod.set(this.Wod.wod);
    this.hero.set(this.Wod.hero);
    this.girl.set(this.Wod.girl);
    this.benchmark.set(this.Wod.benchmark);
  }
  formatDate4Picker() {
    return this.date().toISOString().split('T')[0];
  }
}
