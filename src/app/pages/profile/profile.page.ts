import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonList, 
  IonItem, 
  IonInput, 
  IonButton, 
  IonLabel, 
  IonSelect, 
  IonSelectOption,
  IonButtons,
  IonBackButton,
  ToastController,
  IonGrid,
  IonRow,
  IonCol,
  IonListHeader
} from '@ionic/angular/standalone';
import { UsersService } from 'src/app/services/users/users.service';
import { UserModel } from 'src/app/models/userModel';
import { ActivityModel } from 'src/app/models/activityModel';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    FormsModule,
    IonList,
    IonItem,
    IonInput,
    IonButton,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonButtons,
    IonBackButton,
    IonGrid,
    IonRow,
    IonCol,
    IonListHeader
  ]
})
export class ProfilePage implements OnInit {
  private usersService = inject(UsersService);
  private toastCtrl = inject(ToastController);

  user = signal<UserModel>(new UserModel());
  
  // Campi gestiti come signal
  firstName = signal('');
  lastName = signal('');
  userName = signal('');
  weight = signal<number | null>(null);
  height = signal<number | null>(null);
  gender = signal('');
  email = signal('');
  
  // Gestione PR significativi
  availablePrs = signal<ActivityModel[]>([]);
  featuredPrs = signal<string[]>([]);

  constructor() { }

  async ngOnInit() {
    try {
      const loggedUser = await this.usersService.getLoggedUser();
      if (loggedUser) {
        this.user.set(loggedUser);
        this.loadSignals(loggedUser);
      }
    } catch (error) {
      console.error('Errore nel caricamento del profilo:', error);
    }
  }

  private loadSignals(user: UserModel) {
    this.firstName.set(user.firstName || '');
    this.lastName.set(user.lastName || '');
    this.userName.set(user.userName || '');
    this.weight.set(user.weight);
    this.height.set(user.height);
    this.gender.set(user.gender || '');
    this.email.set(user.email || '');
    this.availablePrs.set(user.prList || []);
    this.featuredPrs.set(user.featuredPrs || []);
  }

  updateFirstName(event: any) {
    this.firstName.set(event.detail.value);
  }
  updateLastName(event: any) {
    this.lastName.set(event.detail.value);
  }
  updateUserName(event: any) {
    this.userName.set(event.detail.value);
  }
  updateWeight(event: any) {
    this.weight.set(Number(event.detail.value));
  }
  updateHeight(event: any) {
    this.height.set(Number(event.detail.value));
  }
  updateGender(event: any) {
    this.gender.set(event.detail.value);
  }
  updateFeaturedPrs(event: any) {
    this.featuredPrs.set(event.detail.value);
  }

  async saveProfile() {
    const currentUser = this.user();
    
    const updatedUser = new UserModel({
      ...currentUser.serialize(),
      firstName: this.firstName(),
      lastName: this.lastName(),
      userName: this.userName(),
      weight: this.weight(),
      height: this.height(),
      gender: this.gender(),
      featuredPrs: this.featuredPrs()
    });
    
    try {
      await this.usersService.updateUser(updatedUser);
      this.user.set(updatedUser);
      const toast = await this.toastCtrl.create({
        message: 'Profilo aggiornato con successo!',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
    } catch (error) {
      console.error('Errore nel salvataggio del profilo:', error);
      const toast = await this.toastCtrl.create({
        message: 'Errore durante il salvataggio del profilo.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
  }
}
