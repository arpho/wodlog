import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ToastController } from '@ionic/angular/standalone';
import { ActivityFormComponent } from "../../../../components/activityForm/activity-form/activity-form.component";
import { ActivityModel } from 'src/app/models/activityModel';
import { UsersService } from 'src/app/services/users/users.service';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-activity',
  templateUrl: './create-activity.page.html',
  styleUrls: ['./create-activity.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ActivityFormComponent]
})
export class CreateActivityPage implements OnInit {
  async createActivity(activity: ActivityModel) {
console.log("create activity",activity);
this.activity.set(activity)
const loggedUser = await this.users.getLoggedUser()
this.activities.create(loggedUser.key,activity).then(async res=>{

const toast = await this.toaster.create({
message: 'creeata attività',
duration: 2000
});
toast.present()
}).catch(err=>{console.log("error",err)
  const toast = this.toaster.create({
    message: 'attività non creata',
    duration: 2000
  });
  toast.then(res=>{
    res.present()
  })
}).finally(()=>{
  this.router.navigateByUrl('/home')

})
}
activity = signal(new ActivityModel())

  constructor(
    private activities:ActivityService,
    private users:UsersService,
    private toaster:ToastController,
    private router:Router
  ) { }

  ngOnInit() {
    console.log("ciao")
  }

}
