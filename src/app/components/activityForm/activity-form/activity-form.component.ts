import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { ActivityModel } from 'src/app/models/activityModel';
import { PrModel } from 'src/app/models/Pr';
import { IonInput, IonToggle, } from "@ionic/angular/standalone";
import { IonDatetime } from '@ionic/angular/standalone';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.scss'],
  standalone: true,
  imports:[
    IonInput,
    ReactiveFormsModule,
    FormsModule,
    IonToggle,
    IonDatetime
  ]
})
export class ActivityFormComponent  implements OnInit {

myForm:FormGroup = new FormGroup({
  descrizione:new FormControl(""),
  hero:new FormControl(false),
  girl:new FormControl(false),
  prList:new FormControl([]),
  unity:new FormControl(" kg "),
  typePr:new FormControl("regular"),
  date: new FormControl( new Date().getTime()),

})
prDate = new Date().toISOString()
  constructor(
    private fb:FormBuilder
  ) { }
setValue($event: Event) {
console.log("value",$event);
}
setDescrizione($event: Event) {
  console.log("descrizione",$event);
  console.log("target",$event);
}
  @Input({required:true})activity:ActivityModel = new ActivityModel();

  @Output()submitActivity = new EventEmitter<ActivityModel>();

  ngOnInit() {
    console.log("activity",this.activity);
    this.myForm = this.fb.group ({
      descrizione:new FormControl(this.activity.descrizione),
      hero:new FormControl(this.activity.hero),
      girl:new FormControl(this.activity.girl),
      prList:new FormControl(this.activity.prList),
      unity:new FormControl(this.activity.unity),
      typePr:new FormControl(this.activity.typePr),

    })
    this.myForm.valueChanges.subscribe((value) => {
console.log("value changed",value,this.activity,this.prDate)
    })
  }

}
