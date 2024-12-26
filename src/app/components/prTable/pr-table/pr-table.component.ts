import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivityModel } from 'src/app/models/activityModel';
import { IonGrid, IonRow, IonCol, IonCard, IonButton, IonIcon } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pr-table',
  templateUrl: './pr-table.component.html',
  styleUrls: ['./pr-table.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonCard,
     IonCol,
      IonRow,
    IonGrid,
    CommonModule

  ],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class PrTableComponent  implements OnInit,OnChanges {
editPr(activity: ActivityModel) {
console.log("edit pr",activity)
this.router.navigateByUrl(`/edit-activity?activityKey=${activity.key}`)
}
showPr(_t16: ActivityModel) {
}
@Input({required:true})  prList:ActivityModel[] = []

  constructor(
    private router:Router
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
