import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonNav, IonButtons,IonBackButton, IonButton,IonBreadcrumb,IonBreadcrumbs} from '@ionic/angular/standalone';
import { ActivitiesListComponent } from "../../../components/activitiesList/activities-list/activities-list.component";
import { UserModel } from 'src/app/models/userModel';
import { UsersService } from 'src/app/services/users/users.service';
import { HomePage } from 'src/app/home/home.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pr-list',
  templateUrl: './pr-list.page.html',
  styleUrls: ['./pr-list.page.scss'],
  standalone: true,
  imports: [IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonBreadcrumb,
    IonBreadcrumbs,

    IonButtons,  ActivitiesListComponent]
})
export class PrListPage implements OnInit {
goBack() {
this.router.navigate(["/home"])
}
user: UserModel = new UserModel();
title ="";
component= HomePage;

  constructor(
    private users: UsersService, private router: Router
  ) { }

  ngOnInit() {
    this.users.getLoggedUser().then((user) => {
      this.user = user;
      this.title = `pr di ${user.firstName} ${user.lastName}`
    });
  }

}
