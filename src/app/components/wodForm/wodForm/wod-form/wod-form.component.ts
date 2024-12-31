import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { WodModel } from 'src/app/models/wod';
import { DatetimeChangeEventDetail, IonDatetime, IonInput, IonButton, IonIcon } from "@ionic/angular/standalone";
import { InputChangeEventDetail, IonDatetimeCustomEvent, IonInputCustomEvent } from '@ionic/core';
import { addIcons } from 'ionicons';
import { saveOutline } from 'ionicons/icons';

@Component({
  selector: 'app-wod-form',
  templateUrl: './wod-form.component.html',
  styleUrls: ['./wod-form.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonInput,
    IonDatetime,

  ]
})
export class WodFormComponent  implements OnInit {
  @Output() submitWod = new EventEmitter<WodModel>()
  @Input({required:true})  wod= new WodModel();
  date = signal(new Date());
  exercises = signal<string[]>([]);
  force = signal<string[]>([]);
  title = signal("");
  note = signal("");

  constructor() {
    addIcons({saveOutline});
  }
submit() {
  const wod = new WodModel({
    date: this.date().getTime(),
    title: this.title(),
    note: this.note(),
    force: this.force(),
    exercises: this.exercises()
  })
  this.submitWod.emit(wod);
console.log("submit wod",wod);
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
    this.date.set(new Date(this.wod.date))
  }
  formatDate4Picker() {

    return  this.date().toISOString().split('T')[0];
  }

}
