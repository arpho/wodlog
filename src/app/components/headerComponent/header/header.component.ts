import { UserModel } from 'src/app/models/userModel';
import { UsersService } from './../../../services/users/users.service';
import { Component, OnInit } from '@angular/core';
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { logOutOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports:[
    IonButton,
    IonIcon,
  ],
  standalone: true,
})
export class HeaderComponent  implements OnInit {
logout() {
console.log("logout");
this.users.logout();
}

  constructor(
    private users:UsersService
  ) {
    addIcons({ logOutOutline });
  }
  user = new UserModel()

  async ngOnInit() {
    this.user = await this.users.getLoggedUser()
    console.log("user",this.user);
  }
  makeTitle(){
    return `pr di ${this.showName()}`
  }
  showName(){
    return this.user.userName?this.user.userName:`${this.user.firstName} ${this.user.lastName}`
  }

}
