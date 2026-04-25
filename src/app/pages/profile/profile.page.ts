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
  IonAvatar,
  IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trendingUpOutline, trendingDownOutline, arrowUpOutline, arrowDownOutline, removeOutline, cameraOutline } from 'ionicons/icons';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { Md5 } from 'ts-md5';
import { UsersService } from 'src/app/services/users/users.service';
import { UserModel } from 'src/app/models/userModel';
import { ActivityModel } from 'src/app/models/activityModel';
import { PrTrendComponent } from 'src/app/components/prTrend/pr-trend/pr-trend.component';
import { ActivityService } from 'src/app/services/activity/activity.service';

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
    IonListHeader,
    IonIcon,
    IonAvatar,
    IonSpinner,
    PrTrendComponent
  ]
})
export class ProfilePage implements OnInit {
  private usersService = inject(UsersService);
  private activityService = inject(ActivityService);
  private toastCtrl = inject(ToastController);
  private storage = inject(Storage);

  user = signal<UserModel>(new UserModel());
  isUploading = signal(false);
  
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

  constructor() {
    addIcons({ trendingUpOutline, trendingDownOutline, cameraOutline });
  }

  async ngOnInit() {
    try {
      const loggedUser = await this.usersService.getLoggedUser();
      if (loggedUser) {
        this.user.set(loggedUser);
        this.loadSignals(loggedUser);
        
        // Fetch real activities
        this.activityService.realtimeFetchAllActivities(loggedUser.key, (res) => {
          this.availablePrs.set(res.data);
        });
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

  getProfileImage() {
    const user = this.user();
    if (user.photoUrl) return user.photoUrl;
    if (user.email) {
      const hash = Md5.hashStr(user.email.trim().toLowerCase());
      return `https://www.gravatar.com/avatar/${hash}?d=mp&s=200`;
    }
    return 'assets/icon/favicon.png';
  }

  async uploadImage(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const user = this.user();
    if (!user.key) return;

    this.isUploading.set(true);
    const filePath = `profileImages/${user.key}`;
    const storageRef = ref(this.storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      null,
      (error) => {
        console.error('Errore durante l\'upload:', error);
        this.isUploading.set(false);
      },
      async () => {
        const downloadUrl = await getDownloadURL(storageRef);
        this.user.update(u => {
          u.photoUrl = downloadUrl;
          return u;
        });
        this.isUploading.set(false);
        // Salvataggio immediato del profilo per aggiornare il photoUrl
        await this.saveProfile();
      }
    );
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

  getActivityByKey(key: string) {
    return this.availablePrs().find(a => a.key === key);
  }
}
