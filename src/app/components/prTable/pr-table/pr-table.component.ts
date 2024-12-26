import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivityModel } from 'src/app/models/activityModel';
import { IonGrid, IonRow, IonCol, IonCard } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pr-table',
  templateUrl: './pr-table.component.html',
  styleUrls: ['./pr-table.component.scss'],
  standalone: true,
  imports: [IonCard,
     IonCol,
      IonRow,
    IonGrid,
    CommonModule

  ],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class PrTableComponent  implements OnInit,OnChanges {
showPr(_t16: ActivityModel) {
}
@Input({required:true})  prList:ActivityModel[] = []

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
this.prList = changes['prList'].currentValue
  if(this.prList.length >0){
  }
}


  ngOnInit() {

    console.log(" got user's key",this.prList);
  }

}
