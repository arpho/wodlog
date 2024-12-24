import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { HeaderComponent } from "../components/headerComponent/header/header.component";
import { UsersService } from '../services/users/users.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [ IonHeader, IonToolbar, IonTitle, IonContent, HeaderComponent],
})
export class HomePage implements OnInit {
  title = "";
  async makeTitle() {
  const user = await this.users.getLoggedUser()
  console.log("user in home",user);
  return `pr di ${user.firstName} ${user.lastName}`

}
  constructor(
    private users:UsersService
  ) {
 this.makeTitle().then((res) => console.log("title", res))
  }
  async ngOnInit(): Promise<void> {
this.title = await this.makeTitle()
  }
}
