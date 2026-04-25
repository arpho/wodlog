import { Component, OnInit, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  IonButton,
  IonIcon,
  IonPopover,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personCircleOutline,
  logOutOutline,
  personOutline,
  listOutline
} from 'ionicons/icons';
import { UsersService } from 'src/app/services/users/users.service';
import { UserModel } from 'src/app/models/userModel';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    IonButton,
    IonIcon,
    IonPopover,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonAvatar,
    IonText,
    IonThumbnail
  ]
})
export class UserMenuComponent implements OnInit {
  private usersService = inject(UsersService);
  private router = inject(Router);

  loggedUser = signal<UserModel>(new UserModel());
  gravatarUrl = signal<string>('');

  constructor() {
    addIcons({
      personCircleOutline,
      logOutOutline,
      personOutline,
      listOutline
    });
  }

  async ngOnInit() {
    const user = await this.usersService.getLoggedUser();
    if (user) {
      this.loggedUser.set(user);
      if (user.email) {
        const hash = Md5.hashStr(user.email.trim().toLowerCase());
        this.gravatarUrl.set(`https://www.gravatar.com/avatar/${hash}?d=mp&s=200`);
      }
    }
  }

  openProfile() {
    this.router.navigate(['/profile']);
  }

  openChangelog() {
    this.router.navigate(['/changelog']);
  }

  openPrList() {
    this.router.navigate(['/pr-list']);
  }

  openWodList() {
    this.router.navigate(['/wods-list']);
  }

  logout() {
    try {
      this.usersService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  }
}
