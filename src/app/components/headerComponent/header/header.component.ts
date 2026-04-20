import { UserModel } from 'src/app/models/userModel';
import { UsersService } from './../../../services/users/users.service';
import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonButtons } from "@ionic/angular/standalone";
import { Router } from '@angular/router';
import { UserMenuComponent } from '../../user-menu/user-menu.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports:[
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    UserMenuComponent
  ],
  standalone: true,
})
export class HeaderComponent  implements OnInit {
  user = new UserModel()

  constructor(
    private users:UsersService,
    private router:Router
  ) {}

  async ngOnInit() {
    this.user = await this.users.getLoggedUser()
  }

  showName(){
    return this.user.userName ? this.user.userName : `${this.user.firstName} ${this.user.lastName}`
  }
}
