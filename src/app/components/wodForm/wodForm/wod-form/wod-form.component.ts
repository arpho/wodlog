import { Component, EventEmitter, Input, OnChanges, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { WodModel } from 'src/app/models/wod';
import { DatetimeChangeEventDetail, IonDatetime, IonInput, IonButton, IonIcon, IonGrid, IonRow, IonCol, IonList, IonItem } from "@ionic/angular/standalone";
import { InputChangeEventDetail, IonDatetimeCustomEvent, IonInputCustomEvent } from '@ionic/core';
import { addIcons } from 'ionicons';
import { saveOutline } from 'ionicons/icons';

@Component({
  selector: 'app-wod-form',
  templateUrl: './wod-form.component.html',
  styleUrls: ['./wod-form.component.scss'],
  standalone: true,
  imports: [IonItem, IonList, IonCol, IonRow, IonGrid, IonIcon, IonButton, IonInput,
    IonDatetime,

  ]
})
export class WodFormComponent  implements OnInit, OnChanges{
wod2Input=signal("")
updateWod($event: IonInputCustomEvent<InputChangeEventDetail>) {
const exercises =this.wod();
this.wod2Input.set("");
exercises.push(String($event.detail.value));
this.wod.set(exercises);
console.log("wod",$event.detail.value);
}
force2Input =""
updateForce($event: IonInputCustomEvent<InputChangeEventDetail>) {
const forza =this.force()
this.force2Input= "";
forza.push(String($event.detail.value));
this.force.set(forza);
console.log("force",this.force())

}
  @Output() submitWod = new EventEmitter<WodModel>()
  @Input({required:true})  Wod= new WodModel();
  date = signal(new Date());
  wod = signal<string[]>([]);
  force = signal<string[]>([]);
  title = signal("");
  note = signal("");

  constructor() {
    addIcons({saveOutline});
  }
  ngOnChanges(changes: SimpleChanges): void {

    this.date.set(new Date(this.Wod.date))
    this.title.set(this.Wod.title);
    this.note.set(this.Wod.note);
    this.force.set(this.Wod.force);
    this.wod.set(this.Wod.wod);
    this.force.set(this.Wod.force);
    this.wod.set(this.Wod.wod);
  }
submit() {
  this.Wod = new WodModel({
    date: this.date().getTime(),
    title: this.title(),
    note: this.note(),
    force: this.force(),
    wod: this.wod()
  })
  this.submitWod.emit(this.Wod);
console.log("submit wod",this.Wod);
}
updateNote($event: IonInputCustomEvent<InputChangeEventDetail>) {
console.log("note",$event.detail.value);
this.note.set(String($event.detail.value));
}
updateName($event: IonInputCustomEvent<InputChangeEventDetail>) {
this.title.set(String($event.detail.value));
}
updateDate($event: IonDatetimeCustomEvent<DatetimeChangeEventDetail>) {
console.log("date",$event);
this.date.set(new Date(String( $event.detail.value)));
}

  ngOnInit() {
    console.log("init wod form");
    this.date.set(new Date(this.Wod.date))
    this.title.set(this.Wod.title);
    this.note.set(this.Wod.note);
    this.force.set(this.Wod.force);
    this.wod.set(this.Wod.wod);
    this.force.set(this.Wod.force);
    this.wod.set(this.Wod.wod);
  }
  formatDate4Picker() {

    return  this.date().toISOString().split('T')[0];
  }

}
