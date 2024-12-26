import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/services/users/users.service';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { ActivityModel } from 'src/app/models/activityModel';
import { ActivityFormComponent } from "../../../components/activityForm/activity-form/activity-form.component";

@Component({
  selector: 'app-edit-activity',
  templateUrl: './edit-activity.page.html',
  styleUrls: ['./edit-activity.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ActivityFormComponent]
})
export class EditActivityPage implements OnInit,OnDestroy {
subscriptions= new Subscription()
activity= signal(new ActivityModel())
  constructor(
    private route:ActivatedRoute,
    private users:UsersService,
    private activities:ActivityService
  ) { }
  ngOnDestroy(): void {
this.subscriptions.unsubscribe()
  }

  ngOnInit() {
    this.subscriptions.add(this.route.queryParams.subscribe(async params=>{
      console.log("params", params);
      const loggedUser = await this.users.getLoggedUser()
      const activity = await this.activities.getActivityByKey(params["activityKey"],loggedUser.key)
      console.log("activity", activity);
      this.activity.set(activity)
      })
    )
  }

}
