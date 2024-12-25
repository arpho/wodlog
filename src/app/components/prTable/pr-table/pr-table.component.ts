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
@Input({required:true})  prList:ActivityModel[] = []

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
console.log("changes",changes)
this.prList = changes['prList'].currentValue
  console.log("We have a prList",this.prList)
  if(this.prList.length >0){
    console.log("prList",this.prList)
    this.prList.forEach((pr:ActivityModel) => {
      console.log("max **",pr.getMaxPr())
    })
  }
}


  ngOnInit() {

    console.log(" got user's key",this.prList);
  }

}
