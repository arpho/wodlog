import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { HeaderComponent } from "../components/headerComponent/header/header.component";
import { UsersService } from '../services/users/users.service';
import { PrTableComponent } from "../components/prTable/pr-table/pr-table.component";
import { UserModel } from '../models/userModel';
import { ActivityService } from '../services/activity/activity.service';
import { ActivitiesListComponent } from '../components/activitiesList/activities-list/activities-list.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonIcon,
    ActivitiesListComponent,
    IonButton, IonHeader, IonToolbar, IonTitle, IonContent, HeaderComponent, PrTableComponent],
})
export class HomePage implements OnInit {
moveData() {
this.user.prList.forEach((pr) => this.service.create(this.user.key, pr).then((res) => console.log("data moved", res)).catch((err) => console.log("error", err)))
}
  user = new UserModel({key:"bubba"})
  title = "";
  async makeTitle() {
  const user = await this.users.getLoggedUser()
  return `pr di ${user.firstName} ${user.lastName}`

}
  constructor(
    private users:UsersService,
    private service:ActivityService
  ) {
 this.ngOnInit();
  }
  async ngOnInit(): Promise<void> {
    this.user = await this.users.getLoggedUser()
 this.service.realtimeFetchAllActivities(this.user.key, (res) => console.log("**data", res))
this.title = await this.makeTitle()
  }
}
