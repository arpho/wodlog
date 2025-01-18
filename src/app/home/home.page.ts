import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonPopover, IonItem, IonList, IonCard, IonImg, IonLabel } from '@ionic/angular/standalone';
import { HeaderComponent } from "../components/headerComponent/header/header.component";
import { UsersService } from '../services/users/users.service';
import { PrTableComponent } from "../components/prTable/pr-table/pr-table.component";
import { UserModel } from '../models/userModel';
import { ActivityService } from '../services/activity/activity.service';
import { ActivitiesListComponent } from '../components/activitiesList/activities-list/activities-list.component';
import { menu } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { HomeSquareComponent } from '../components/home-square/home-square.component';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonLabel, IonImg, IonCard, IonList, IonItem, IonPopover, IonIcon,
    ActivitiesListComponent,HomeSquareComponent,
    IonButton, IonHeader, IonToolbar, IonTitle, IonContent,IonList, HeaderComponent, PrTableComponent, ],
})
export class HomePage implements OnInit {
goToWodList() {
  console.log("ciao wod");
this.router.navigate(["/wods"]);
}
goToPrList() {
console.log("ciao");
this.router.navigate(["/pr-list"])
}
moveData() {
this.user.prList.forEach((pr) => this.service.create(this.user.key, pr).then((res) => console.log("data moved", res)).catch((err) => console.log("error", err)))
}
  user = new UserModel({key:"bubba"})
  title = "";
  async makeTitle() {
  const user = await this.users.getLoggedUser()
  return `Benvenuto ${user.firstName} ${user.lastName}`

}
  constructor(
    private users:UsersService,
    private service:ActivityService,
    private router:Router
  ) {
 this.ngOnInit();
 addIcons({ menu });
  }
  async ngOnInit(): Promise<void> {
    this.user = await this.users.getLoggedUser()
 this.service.realtimeFetchAllActivities(this.user.key, (res) => console.log("**data", res))
this.title = await this.makeTitle()
  }
}
