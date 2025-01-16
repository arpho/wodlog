import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ActivitiesListComponent } from "../../../components/activitiesList/activities-list/activities-list.component";
import { UserModel } from 'src/app/models/userModel';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-pr-list',
  templateUrl: './pr-list.page.html',
  styleUrls: ['./pr-list.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ActivitiesListComponent]
})
export class PrListPage implements OnInit {
user: UserModel = new UserModel();
title ="";

  constructor(
    private users: UsersService
  ) { }

  ngOnInit() {
    this.users.getLoggedUser().then((user) => {
      this.user = user;
      this.title = `pr di ${user.firstName} ${user.lastName}`
    });
  }

}
