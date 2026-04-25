import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons } from '@ionic/angular/standalone';
import { UsersService } from '../services/users/users.service';
import { UserModel } from '../models/userModel';
import { ActivityService } from '../services/activity/activity.service';
import { Router } from '@angular/router';
import { HomeSquareComponent } from '../components/home-square/home-square.component';
import { UserMenuComponent } from '../components/userMenu/user-menu.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    HomeSquareComponent,
    UserMenuComponent
  ],
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
    private users: UsersService,
    private service: ActivityService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    this.user = await this.users.getLoggedUser();
    this.service.realtimeFetchAllActivities(this.user.key, (res) => console.log("**data", res));
    this.title = await this.makeTitle();
  }
}
