import { Component, OnInit, ChangeDetectionStrategy, Input, signal, OnChanges, SimpleChanges } from '@angular/core';
import { ActivityModel } from 'src/app/models/activityModel';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { PrTableComponent } from "../../prTable/pr-table/pr-table.component";

@Component({
  selector: 'app-activities-list',
  templateUrl: './activities-list.component.html',
  styleUrls: ['./activities-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PrTableComponent]
})
export class ActivitiesListComponent  implements OnChanges {
  @Input({required:true})  userKey:string = ""
  data=[]
activities=   signal<{data:ActivityModel[],total:number}>({data:[],total:0})
  constructor(
    private service:ActivityService
  ) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("activities list  change for ",this.userKey)
    const callback= (activities:{data:ActivityModel[],total:number}) =>{
      console.log("got activities",activities)
      this.activities.set(activities)}
    this.service.realtimeFetchAllActivities(this.userKey,callback)
  }



}
