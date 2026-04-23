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
  lockClosedOutline,
  personOutline,
  keyOutline,
  listOutline,
  checkmark
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
    IonText
  ]
})
export class UserMenuComponent implements OnInit {
  private usersService = inject(UsersService);
  private router = inject(Router);

  loggedUser = signal<UserModel>(new UserModel());
  gravatarUrl = signal<string>('');
  triggerId = `user-menu-trigger-${Math.random().toString(36).substring(2, 9)}`;

  constructor() {
    addIcons({
      personCircleOutline,
      logOutOutline,
      lockClosedOutline,
      personOutline,
      keyOutline,
      listOutline,
      checkmark
    });
  }

  async ngOnInit() {
    try {
      const user = await this.usersService.getLoggedUser();
      if (user) {
        this.loggedUser.set(user);
        if (user.email) {
          const hash = Md5.hashStr(user.email.trim().toLowerCase());
          this.gravatarUrl.set(`https://www.gravatar.com/avatar/${hash}?d=mp&s=200`);
        }
      }
    } catch (error) {
      console.error('Error fetching logged user:', error);
    }
  }

  openProfile() {
    const userKey = this.loggedUser()?.key;
    if (userKey) {
      // Note: profile route might not exist in wodLog yet
      this.router.navigate(['/home']); 
    }
  }

  async logout() {
    try {
      await this.usersService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  }
}
