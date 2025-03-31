import { Component, EventEmitter, Input, OnChanges, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { ActivityModel } from 'src/app/models/activityModel';
import { PrModel } from 'src/app/models/Pr';
import { IonInput, IonToggle, IonButton, IonIcon, IonToolbar, ToggleChangeEventDetail, IonTab, IonTabBar, IonTabs, IonHeader,IonTitle,IonContent, IonFab, IonFabButton, IonFabList } from "@ionic/angular/standalone";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { saveOutline, chevronForwardCircle, document, colorPalette, globe, chevronBackCircle, add } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { PrListComponent } from "../../prList/pr-list/pr-list.component";
import { IonToggleCustomEvent } from '@ionic/core';
import { PrGraphComponent } from "../../pr-graph/pr-graph.component";
@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.scss'],
  standalone: true,
  //preserveWhitespaces: false
  imports: [
    IonHeader,
     IonTabs,
      IonTab,
    IonInput,
    ReactiveFormsModule,
    FormsModule,
    IonToggle,
    IonButton,
    IonIcon,
    PrListComponent,
    IonTitle,
    IonToolbar,
    IonFab,
    IonFabButton,
    IonFabList,
    IonContent,
    PrGraphComponent
  ]

})
export class ActivityFormComponent  implements OnInit, OnChanges {
showView() {
return this.showList? "list":"graph"
}
switchView($event: IonToggleCustomEvent<ToggleChangeEventDetail<any>>) {
this.showList= !this.showList
}
  showList = true;
save() {
console.log("save");
}
setUnity($event: IonToggleCustomEvent<ToggleChangeEventDetail<any>>) {
console.log("unity",$event);
this.unity.set($event.detail.checked?" sec ":" Kg ");
this.editdActivity.emit(this.activity);
}
showUnity() {
 return this.unity()
}
showPrType() {
return this.typePr() === "benchmark"? "benchmark":"regular"
}
setTypePr($event: IonToggleCustomEvent<ToggleChangeEventDetail<any>>) {
console.log("typePr",$event);
this.editdActivity.emit(this.activity);
this.typePr.set($event.detail.checked?"benchmark":"regular")
}
setPrList($event: any) {
console.log("prList",$event);
this.prList.set($event);
this.editdActivity.emit(this.activity);
this.activity.prList = $event
}
submit() {
  console.log("prList",this.prList());
  this.activity.build({//store the changes in the model
    descrizione: this.descrizione(),
    hero: this.hero(),
    girl: this.girl(),
    prList: this.prList(),
    unity: this.unity(),
    typePr: this.typePr(),

  });
  this.submitActivity.emit(this.activity);
}


prDate = new Date().toISOString()
  constructor(

  )
  {

    addIcons({saveOutline,chevronBackCircle,document,add,colorPalette,globe});
   }
  ngOnChanges(changes: SimpleChanges): void {
    this.descrizione.set(this.activity.descrizione)
    this.hero.set(this.activity.hero)
    this.girl.set(this.activity.girl)
    this.prList.set(this.activity.prList)
    this.unity.set(this.activity.unity)
    this.typePr.set(this.activity.typePr)
    console.log("changed activity",this.activity);
  }
setValue($event: Event) {
console.log("value",$event);
}
setDescrizione($event: any) {
  console.log("descrizione",$event);
  this.editdActivity.emit(this.activity);
this.descrizione.set($event.target.value)
}
setHero($event: any) {
  console.log("hero",$event.detail.checked);
  this.editdActivity.emit(this.activity);
  this.hero.set($event.detail.checked);
}
setGirl($event: any) {
  console.log("hero",$event.detail.checked);
  this.girl.set($event.detail.checked);
  this.editdActivity.emit(this.activity);
}
  @Input({required:true})activity:ActivityModel = new ActivityModel();
  @Output ()editdActivity = new EventEmitter<ActivityModel>();

  @Output()submitActivity = new EventEmitter<ActivityModel>();
  test = signal("test")
  descrizione = signal("");
  hero = signal(false);
  girl = signal(false);
  prList = signal<PrModel[]>([]);
  unity = signal(" Kg ");
  typePr = signal("regular");
  ngOnInit() {
    console.log("got activity",this.activity);

    this.descrizione.set(this.activity.descrizione)
    this.hero.set(this.activity.hero)
    this.girl.set(this.activity.girl)
    this.prList.set(this.activity.prList)
    this.unity.set(this.activity.unity)
    this.typePr.set(this.activity.typePr)

  }

}
