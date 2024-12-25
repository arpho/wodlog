import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { HeaderComponent } from "../components/headerComponent/header/header.component";
import { UsersService } from '../services/users/users.service';
import { PrTableComponent } from "../components/prTable/pr-table/pr-table.component";
import { UserModel } from '../models/userModel';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, HeaderComponent, PrTableComponent],
})
export class HomePage implements OnInit {
  user = new UserModel({key:"bubba"})
  title = "";
  async makeTitle() {
  const user = await this.users.getLoggedUser()
  console.log("user in home title",user);
  return `pr di ${user.firstName} ${user.lastName}`

}
  constructor(
    private users:UsersService
  ) {
 this.ngOnInit();
 this.makeTitle().then((res) => console.log("title", res))
  }
  async ngOnInit(): Promise<void> {
    this.user = await this.users.getLoggedUser()
    console.log("init user in home", this.user.prList);
this.title = await this.makeTitle()
  }
}
