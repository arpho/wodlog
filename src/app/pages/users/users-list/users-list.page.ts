import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonSearchbar,
  IonBadge,
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonSpinner,
  IonButton,
  AlertController,
  LoadingController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline, peopleOutline, shieldCheckmarkOutline, alertCircleOutline, eyeOutline, trashOutline } from 'ionicons/icons';
import { UsersService } from 'src/app/services/users/users.service';
import { UserModel } from 'src/app/models/userModel';
import { UserMenuComponent } from 'src/app/components/userMenu/user-menu.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.page.html',
  styleUrls: ['./users-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonSearchbar,
    IonBadge,
    IonItem,
    IonList,
    IonSelect,
    IonSelectOption,
    IonIcon,
    IonSpinner,
    IonButton,
    UserMenuComponent
  ]
})
export class UsersListPage {
  private usersService = inject(UsersService);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);
  private loadingCtrl = inject(LoadingController);
  private toastCtrl = inject(ToastController);

  // Pure Signal proveniente da Firebase Realtime Database
  private usersRaw = toSignal(this.usersService.getUsersList(), { initialValue: null });
  
  isLoading = computed(() => this.usersRaw() === null);
  usersList = computed(() => this.usersRaw() || []);

  searchQuery = signal<string>('');
  roleFilter = signal<string>('all');
  enabledFilter = signal<string>('all');

  filteredUsers = computed(() => {
    return this.usersList().filter(user => {
      const nameMatch = (user.firstName + ' ' + user.lastName).toLowerCase();
      const matchesSearch = !this.searchQuery() || 
        nameMatch.includes(this.searchQuery().toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
        user.userName.toLowerCase().includes(this.searchQuery().toLowerCase());
      
      const matchesRole = this.roleFilter() === 'all' || user.role === this.roleFilter();
      
      // Legacy users with missing enabled field are considered enabled by default
      const userEnabled = user.enabled === undefined ? true : user.enabled;
      const matchesEnabled = this.enabledFilter() === 'all' || 
        (this.enabledFilter() === 'true' && userEnabled) ||
        (this.enabledFilter() === 'false' && !userEnabled);
      
      return matchesSearch && matchesRole && matchesEnabled;
    });
  });

  constructor() {
    addIcons({
      searchOutline,
      peopleOutline,
      shieldCheckmarkOutline,
      alertCircleOutline,
      eyeOutline,
      trashOutline
    });
  }

  viewUserPrivileges(user: UserModel) {
    this.router.navigate(['/users', user.key, 'privilegies']);
  }

  async confirmDeleteUser(event: Event, athlete: UserModel) {
    event.stopPropagation();

    const alert = await this.alertCtrl.create({
      header: 'Conferma Eliminazione',
      message: `Sei sicuro di voler eliminare definitivamente l'atleta "${athlete.firstName} ${athlete.lastName}" (${athlete.email})? Questa azione non può essere annullata.`,
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Elimina',
          role: 'destructive',
          cssClass: 'danger',
          handler: () => {
            this.deleteUser(athlete);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteUser(athlete: UserModel) {
    const loading = await this.loadingCtrl.create({
      message: 'Eliminazione atleta in corso...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      await this.usersService.deleteUser(athlete.key);
      await loading.dismiss();

      const toast = await this.toastCtrl.create({
        message: `Utente ${athlete.firstName} ${athlete.lastName} eliminato.`,
        duration: 3000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();
    } catch (error: any) {
      console.error('Errore durante l\'eliminazione:', error);
      await loading.dismiss();

      const toast = await this.toastCtrl.create({
        message: `Errore: ${error.message || 'Impossibile eliminare l\'utente.'}`,
        duration: 4000,
        color: 'danger',
        position: 'bottom'
      });
      await toast.present();
    }
  }
}
