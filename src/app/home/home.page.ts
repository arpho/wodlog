import { UserMenuComponent } from '../components/userMenu/user-menu.component';
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonPopover, IonItem, IonList, IonCard, IonImg, IonLabel, IonGrid, IonRow, IonCol, IonButtons } from '@ionic/angular/standalone';
import { HeaderComponent } from "../components/headerComponent/header/header.component";
import { UsersService } from '../services/users/users.service';
import { PrTableComponent } from "../components/prTable/pr-table/pr-table.component";
import { UserModel } from '../models/userModel';
import { ActivityService } from '../services/activity/activity.service';
import { ActivitiesListComponent } from '../components/activitiesList/activities-list/activities-list.component';
import { menu, alertCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { HomeSquareComponent } from '../components/home-square/home-square.component';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../services/notification/notification.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonButtons, UserMenuComponent, IonCol, IonRow, IonGrid, IonLabel, IonImg, IonCard, IonList, IonItem, IonPopover, IonIcon,
    ActivitiesListComponent,HomeSquareComponent, CommonModule,
    IonButton, IonHeader, IonToolbar, IonTitle, IonContent,IonList, HeaderComponent, PrTableComponent, ],
})
export class HomePage implements OnInit, OnDestroy {
  user = new UserModel({key:"bubba"});
  title = "";
  pendingNotificationsCount = signal<number>(0);
  private notificationsSubscription?: Subscription;

  async makeTitle() {
    const user = await this.users.getLoggedUser();
    return `Benvenuto ${user.firstName} ${user.lastName}`;
  }

  constructor(
    private users: UsersService,
    private service: ActivityService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    addIcons({ menu, alertCircleOutline });
  }

  async ngOnInit(): Promise<void> {
    this.user = await this.users.getLoggedUser();
    this.service.realtimeFetchAllActivities(this.user.key, (res) => console.log("**data", res));
    this.title = await this.makeTitle();

    if (this.user.role === 'editor') {
      this.notificationsSubscription = this.users.getPendingNotifications().subscribe((notifs) => {
        const pending = notifs.filter(n => !n.read);
        
        if (pending.length > this.pendingNotificationsCount()) {
          this.notificationService.showNotification(
            'WodLog - Utenti da abilitare',
            `Ci sono ${pending.length} utenti in attesa di essere abilitati!`
          );
        }
        
        this.pendingNotificationsCount.set(pending.length);
      });
    }
  }

  ngOnDestroy() {
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }
  }

  goToUserManagement() {
    this.router.navigate(['/users']);
  }
}
