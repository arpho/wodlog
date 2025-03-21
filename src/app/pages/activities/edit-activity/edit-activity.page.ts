import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,ToastController } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/services/users/users.service';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { ActivityModel } from 'src/app/models/activityModel';
import { ActivityFormComponent } from "../../../components/activityForm/activity-form/activity-form.component";
import { PrestazionePipe } from 'src/app/pipes/prestazione/prestazione.pipe';

@Component({
  selector: 'app-edit-activity',
  templateUrl: './edit-activity.page.html',
  styleUrls: ['./edit-activity.page.scss'],
  standalone: true,
  imports: [
    IonContent,
     IonHeader,
     IonTitle,
      IonToolbar,
       CommonModule,
        FormsModule,
         ActivityFormComponent,
         PrestazionePipe
        ]
})
export class EditActivityPage implements OnInit,OnDestroy {
  async updateActivity(activity: ActivityModel) {
console.log("update activity",activity);
const loggedUser =await  this.users.getLoggedUser()

this.service.set(loggedUser.key,activity).then(async res=>{

const toast = await this.toater.create({
  message: 'Pr aggiornato',
  duration: 2000
});
toast.present()
}).catch(err=>{console.log("error",err)

  const toast = this.toater.create({
    message: 'Pr non aggiornato',
    duration: 2000
  });
  toast.then(res=>res.present())
}).finally(()=>{
this.router.navigateByUrl('/pr-list')
})


}
subscriptions= new Subscription()
activity= signal(new ActivityModel())
  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private users:UsersService,
    private activities:ActivityService,
    private service:ActivityService,
    private toater:ToastController
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
