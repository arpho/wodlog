import { UserMenuComponent } from '../../components/userMenu/user-menu.component';
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
  IonListHeader,
  IonIcon,
  IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline, closeOutline, trophyOutline, personOutline, checkmarkOutline, cameraOutline } from 'ionicons/icons';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { UsersService } from 'src/app/services/users/users.service';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { UserModel } from 'src/app/models/userModel';
import { ActivityModel } from 'src/app/models/activityModel';
import { PrestazionePipe } from 'src/app/pipes/prestazione/prestazione.pipe';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [UserMenuComponent, 
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
    IonListHeader,
    IonIcon,
    IonSpinner,
    PrestazionePipe
  ]
})
export class ProfilePage implements OnInit {
  private usersService = inject(UsersService);
  private activityService = inject(ActivityService);
  private storage = inject(Storage);
  private toastCtrl = inject(ToastController);

  user = signal<UserModel>(new UserModel());
  
  // Modalità modifica e caricamento
  isEditMode = signal(false);
  isUploading = signal(false);
  
  // Campi gestiti come signal
  firstName = signal('');
  lastName = signal('');
  userName = signal('');
  weight = signal<number | null>(null);
  height = signal<number | null>(null);
  gender = signal('');
  email = signal('');
  photoUrl = signal('');
  
  // Gestione PR significativi
  availablePrs = signal<ActivityModel[]>([]);
  featuredPrs = signal<string[]>([]);

  constructor() {
    addIcons({ createOutline, closeOutline, trophyOutline, personOutline, checkmarkOutline, cameraOutline });
  }

  async ngOnInit() {
    try {
      const loggedUser = await this.usersService.getLoggedUser();
      if (loggedUser) {
        this.user.set(loggedUser);
        this.loadSignals(loggedUser);
        this.activityService.realtimeFetchAllActivities(loggedUser.key, (res) => {
          this.availablePrs.set(res.data);
        });
      }
    } catch (error) {
      console.error('Errore nel caricamento del profilo:', error);
    }
  }

  toggleEditMode() {
    if (this.isEditMode()) {
      this.loadSignals(this.user());
      this.isEditMode.set(false);
    } else {
      this.isEditMode.set(true);
    }
  }

  async onPhotoSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Dimensione massima: 2MB (2 * 1024 * 1024 bytes)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      const toast = await this.toastCtrl.create({
        message: 'La foto non deve superare i 2MB.',
        duration: 3000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    this.isUploading.set(true);
    try {
      const fileRef = ref(this.storage, `userProfile/${this.user().key}/avatar.jpg`);
      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);
      this.photoUrl.set(downloadUrl);
      
      const toast = await this.toastCtrl.create({
        message: 'Foto caricata con successo! Ricorda di salvare il profilo.',
        duration: 2500,
        color: 'success'
      });
      await toast.present();
    } catch (error) {
      console.error('Errore durante il caricamento dell\'immagine:', error);
      const toast = await this.toastCtrl.create({
        message: 'Errore durante il caricamento dell\'immagine.',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
    } finally {
      this.isUploading.set(false);
    }
  }

  getFeaturedPrValue(prKey: string): string {
    const activity = this.availablePrs().find(a => a.key === prKey);
    if (!activity) return '-';
    const maxPr = activity.getMaxPr();
    if (!maxPr) return 'Nessun record';
    return this.formatPrValue(maxPr, activity.unity);
  }

  getFeaturedPrName(prKey: string): string {
    const activity = this.availablePrs().find(a => a.key === prKey);
    return activity ? activity.descrizione : '';
  }

  getFeaturedActivity(prKey: string): ActivityModel | undefined {
    return this.availablePrs().find(a => a.key === prKey);
  }

  formatPrValue(pr: any, unity: string): string {
    if (!pr) return '-';
    const val = Number(pr.prestazione);
    if (unity.trim() === 'sec') {
      const minutes = Math.floor(val / 60);
      const seconds = val % 60;
      return `${minutes} min ${seconds} sec`;
    }
    return `${val} Kg`;
  }

  private loadSignals(user: UserModel) {
    this.firstName.set(user.firstName || '');
    this.lastName.set(user.lastName || '');
    this.userName.set(user.userName || '');
    this.weight.set(user.weight);
    this.height.set(user.height);
    this.gender.set(user.gender || '');
    this.email.set(user.email || '');
    this.photoUrl.set(user.photoUrl || '');
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
      featuredPrs: this.featuredPrs(),
      photoUrl: this.photoUrl()
    });
    
    try {
      await this.usersService.updateUser(updatedUser);
      this.user.set(updatedUser);
      this.isEditMode.set(false);
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
