import { UserMenuComponent } from '../../../components/userMenu/user-menu.component';
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonNav, IonButtons,IonBackButton, IonButton,IonBreadcrumb,IonBreadcrumbs} from '@ionic/angular/standalone';
import { ActivitiesListComponent } from "../../../components/activitiesList/activities-list/activities-list.component";
import { UserModel } from 'src/app/models/userModel';
import { UsersService } from 'src/app/services/users/users.service';
import { HomePage } from 'src/app/home/home.page';
import { Router } from '@angular/router';
import { FilterPipe } from 'src/app/components/pipes/customFilter/filterPipe.pipe';

@Component({
  selector: 'app-pr-list',
  templateUrl: './pr-list.page.html',
  styleUrls: ['./pr-list.page.scss'],
  standalone: true,
  imports: [UserMenuComponent, IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonBreadcrumb,
    IonBreadcrumbs,
    IonButtons,
    ActivitiesListComponent]
})
export class PrListPage {
  private users = inject(UsersService);
  private router = inject(Router);

  user = signal<UserModel>(new UserModel());
  title = signal<string>("");
  component = HomePage;
  loading = signal<boolean>(true);

  constructor() {
    this.users.getLoggedUser().then((user) => {
      this.user.set(user);
      this.title.set(`pr di ${user.firstName} ${user.lastName}`);
      this.loading.set(false);
    });
  }

  goBack() {
    this.router.navigate(["/home"]);
  }
}
