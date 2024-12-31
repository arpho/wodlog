import { UserModel } from 'src/app/models/userModel';
import { UsersService } from './../../../services/users/users.service';
import { Component, OnInit } from '@angular/core';
import { IonButton, IonIcon, IonPopover, IonItem, IonList,IonContent } from "@ionic/angular/standalone";
import { logOutOutline, menu, medal, fitness } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports:[
    IonButton,
    IonIcon,
    IonPopover,
    IonItem,
    IonList,
    IonContent
  ],
  standalone: true,
})
export class HeaderComponent  implements OnInit {
gotoWod() {
console.log("goto wod");
this.router.navigateByUrl(`/wods`)
}
gotoPR() {
  console.log("goto pr");
  this.router.navigateByUrl(`/home`)
}
logout() {
console.log("logout");
this.users.logout();
}

  constructor(
    private users:UsersService,
    private router:Router
  ) {
    addIcons({logOutOutline,menu, medal,fitness});
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
