import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonButton,
  IonIcon,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  LoadingController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { saveOutline, shieldOutline, checkmarkCircleOutline, lockOpenOutline } from 'ionicons/icons';
import { UsersService } from 'src/app/services/users/users.service';
import { UserModel } from 'src/app/models/userModel';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { UserMenuComponent } from 'src/app/components/userMenu/user-menu.component';

@Component({
  selector: 'app-user-privileges',
  templateUrl: './user-privileges.page.html',
  styleUrls: ['./user-privileges.page.scss'],
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
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonToggle,
    IonButton,
    IonIcon,
    IonSpinner,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    UserMenuComponent
  ]
})
export class UserPrivilegesPage implements OnInit {
  targetUid: string = '';
  userProfile = signal<UserModel | null>(null);
  isLoading = signal<boolean>(true);

  selectedRole = signal<string>('user');
  isEnabled = signal<boolean>(true);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private usersService = inject(UsersService);
  private functions = inject(Functions);
  private loadingCtrl = inject(LoadingController);
  private toastCtrl = inject(ToastController);

  constructor() {
    addIcons({
      saveOutline,
      shieldOutline,
      checkmarkCircleOutline,
      lockOpenOutline
    });
  }

  async ngOnInit() {
    this.targetUid = this.route.snapshot.paramMap.get('uid') || '';
    if (!this.targetUid) {
      this.router.navigate(['/users']);
      return;
    }
    await this.loadUserProfile();
  }

  async loadUserProfile() {
    this.isLoading.set(true);
    try {
      const user = await this.usersService.getUserByUid(this.targetUid);
      this.userProfile.set(user);
      this.selectedRole.set(user.role || 'user');
      
      // Default to true for legacy users without enabled property
      this.isEnabled.set(user.enabled === undefined ? true : user.enabled);
    } catch (error) {
      console.error('Errore nel caricamento del profilo utente:', error);
      const toast = await this.toastCtrl.create({
        message: 'Impossibile caricare il profilo utente.',
        duration: 3000,
        color: 'danger',
        position: 'bottom'
      });
      await toast.present();
      this.router.navigate(['/users']);
    } finally {
      this.isLoading.set(false);
    }
  }

  async savePrivileges() {
    const user = this.userProfile();
    if (!user) return;

    const loading = await this.loadingCtrl.create({
      message: 'Salvataggio privilegi in corso...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      // 1. Invoca la Cloud Function "setClaims"
      const setClaimsFn = httpsCallable(this.functions, 'setClaims');
      await setClaimsFn({
        email: user.email,
        role: this.selectedRole(),
        enabled: this.isEnabled()
      });

      // 2. Dismiss della notifica pending registrata nel database per questo utente
      await this.usersService.dismissNotification(user.key);

      await loading.dismiss();

      const toast = await this.toastCtrl.create({
        message: 'Privilegi aggiornati con successo!',
        duration: 3000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();

      this.router.navigate(['/users']);
    } catch (error: any) {
      console.error('Errore durante il salvataggio dei privilegi:', error);
      await loading.dismiss();

      const toast = await this.toastCtrl.create({
        message: `Errore: ${error.message || 'Impossibile salvare i privilegi.'}`,
        duration: 4000,
        color: 'danger',
        position: 'bottom'
      });
      await toast.present();
    }
  }
}
