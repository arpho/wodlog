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
  ModalController,
  IonItem, IonFabButton } from '@ionic/angular/standalone';
import {
  InputChangeEventDetail,
  IonDatetimeCustomEvent,
  IonInputCustomEvent,
IonToggleCustomEvent,
ToggleChangeEventDetail,
} from '@ionic/core';
import { addIcons } from 'ionicons';
import { saveOutline, add, alert, checkmarkOutline, createOutline, open } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { SimpleInputComponent } from '../../../simpleInput/simple-input/simple-input.component';
import { ActivityModel } from 'src/app/models/activityModel';

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
handleForceReorder(arg0: any) {
console.log("force reorder", arg0)
const force = this.force();
const itemMoved = force.splice(arg0.detail.from, 1)[0];
force.splice(arg0.detail.to, 0, itemMoved);
arg0.detail.complete();
this.force.set([...force])
console.log("force", force);
 const Wod = new WodModel({
  date: this.date().getTime(),
  key: this.Wod.key,
  title: this.title(),
  note: this.note(),
  force: this.force(),
  wod: this.wod(),
  open:this.open(),
  girl: this.girl(),
  hero: this.hero(),
  benchmark: this.benchmark(),
  QF: this.QF()
});
this.changedWod.emit(Wod);
}
handleReorder(arg0: any) {
console.log("reorder", arg0)
const wod = this.wod();
const itemMoved = wod.splice(arg0.detail.from, 1)[0];
wod.splice(arg0.detail.to, 0, itemMoved);
arg0.detail.complete();
this.wod.set([...wod])
console.log("wod", wod);
 const Wod = new WodModel({
  date: this.date().getTime(),
  key: this.Wod.key,
  title: this.title(),
  note: this.note(),
  force: this.force(),
  wod: this.wod(),
  girl: this.girl(),
  hero: this.hero(),
  benchmark: this.benchmark(),
  QF: this.QF()
});
this.changedWod.emit(Wod);

}
test= false
updateHero(event:any){
console.log("hero",event.detail.checked);
this.hero.set(event.detail.checked)
}
updateOpen(event:any){
  console.log("open",event)
  this.open.set(event.detail.checked);
  console.log("open", this.open())
}
updateGirl(event:any){
console.log("girl",event.detail.checked);
this.girl.set(event.detail.checked)
}
updateQF(event:any){
  console.log("QF",event.detail.checked);
  this.QF.set(event.detail.checked)
}


updateBenchmark(event:any){
  console.log("benchmark",event.detail.checked);
  this.benchmark.set(event.detail.checked)
  }
async addActivity() {
console.log("adding activity via modal");
const modal = await this.modalCtrl.create({
  component: SimpleInputComponent,
  componentProps: {
    title: 'Aggiungi Attività',
    value: '',
    isEditing: false
  }
});

await modal.present();

const { data, role } = await modal.onDidDismiss();

if (role === 'confirm' && data) {
  const wodSet = this.wod() || [];
  wodSet.push(data);
  this.wod.set([...wodSet]);
  console.log("updated wodset", this.wod());
}
}
async addForce() {
console.log("adding force")
const modal = await this.modalCtrl.create({
  component: SimpleInputComponent,
  componentProps: {
    title: 'Aggiungi Forza',
    value: '',
    isEditing: false
  }
});

await modal.present();

const { data, role } = await modal.onDidDismiss();

if (role === 'confirm' && data) {
  const forceSet = this.force() || [];
  forceSet.push(data);
  this.force.set([...forceSet]);
  console.log("updated forceset", this.force());
}
}
index: any;
  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) {
    addIcons({checkmarkOutline,createOutline,add,saveOutline});
  }
  async editWod(_t38: string, index:number) {
 console.log("editing", _t38)
 
 const modal = await this.modalCtrl.create({
   component: SimpleInputComponent,
   componentProps: {
     title: 'Modifica Attività',
     value: _t38,
     isEditing: true
   }
 });

 await modal.present();

 const { data, role } = await modal.onDidDismiss();

 if (role === 'delete') {
   const wodSet = this.wod() || [];
   wodSet.splice(index, 1);
   this.wod.set([...wodSet]);
   console.log("removed index", index);
 } else if (role === 'confirm' && data) {
   const wodSet = this.wod() || [];
   wodSet[index] = data;
   this.wod.set([...wodSet]);
   console.log("updated wodset", this.wod());
 }
 }
 async editForce(_t38: string, index:number) {
 console.log("editing", _t38)
 const modal = await this.modalCtrl.create({
   component: SimpleInputComponent,
   componentProps: {
     title: 'Modifica Forza',
     value: _t38,
     isEditing: true
   }
 });

 await modal.present();

 const { data, role } = await modal.onDidDismiss();

 if (role === 'delete') {
   const forceSet = this.force() || [];
   forceSet.splice(index, 1);
   this.force.set([...forceSet]);
   console.log("removed force index", index);
 } else if (role === 'confirm' && data) {
   const forceSet = this.force() || [];
   forceSet[index] = data;
   this.force.set([...forceSet]);
   console.log("updated forceset", this.force());
 }
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
  @Output() changedWod = new EventEmitter<WodModel>();
  @Input({ required: true }) Wod = new WodModel();
  date = signal(new Date());
  wod = signal<string[]>([]);
  force = signal<string[]>([]);
  title = signal('');
  note = signal('');
  hero = signal(false);
  girl = signal(false);
  open= signal(false)
  benchmark = signal(false);
  QF = signal(false);


  ngOnChanges(changes: SimpleChanges): void {
console.log("changes", changes)
    this.date.set(new Date(this.Wod.date));
    this.title.set(this.Wod.title);
    this.note.set(this.Wod.note);
    this.force.set(this.Wod.force);
    this.wod.set(this.Wod.wod);
    this.force.set(this.Wod.force);
    this.hero.set(this.Wod.hero);
    this.girl.set(this.Wod.girl);
    this.open.set(this.Wod.open);
    this.benchmark.set(this.Wod.benchmark);
    this.QF.set(this.Wod.QF);
    this.Wod = new WodModel({
      date: this.date().getTime(),
      key: this.Wod.key,
      title: this.title(),
      note: this.note(),
      force: this.force(),
      wod: this.wod(),
      girl: this.girl(),
      open:this.open(),
      hero: this.hero(),
      benchmark: this.benchmark(),
      QF: this.QF()
    });
    //this.changedWod.emit(this.Wod);
  }
  submit() {
    this.Wod = new WodModel({
      date: this.date().getTime(),
      key: this.Wod.key,
      title: this.title(),
      note: this.note(),
      force: this.force(),
      wod: this.wod(),
      open:this.open(),
      girl: this.girl(),
      hero: this.hero(),
      benchmark: this.benchmark(),
      QF: this.QF()
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
    this.QF.set(this.Wod.QF);
  }
  formatDate4Picker() {
    return this.date().toISOString().split('T')[0];
  }
}
