import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline, peopleOutline, shieldCheckmarkOutline, alertCircleOutline, eyeOutline } from 'ionicons/icons';
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
    UserMenuComponent
  ]
})
export class UsersListPage implements OnInit {
  usersList = signal<UserModel[]>([]);
  isLoading = signal<boolean>(true);
  
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

  constructor(
    private usersService: UsersService,
    private router: Router
  ) {
    addIcons({
      searchOutline,
      peopleOutline,
      shieldCheckmarkOutline,
      alertCircleOutline,
      eyeOutline
    });
  }

  async ngOnInit() {
    await this.loadUsers();
  }

  async loadUsers() {
    this.isLoading.set(true);
    try {
      const list = await this.usersService.getAllUsers();
      this.usersList.set(list);
    } catch (error) {
      console.error('Errore nel caricamento degli utenti:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  viewUserPrivileges(user: UserModel) {
    this.router.navigate(['/users', user.key, 'privilegies']);
  }
}
