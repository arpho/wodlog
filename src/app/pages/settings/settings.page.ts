import { UserMenuComponent } from '../../components/userMenu/user-menu.component';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonIcon
} from '@ionic/angular/standalone';
import { ThemeService, ThemeMode, ColorTheme } from 'src/app/services/theme/theme.service';
import { addIcons } from 'ionicons';
import { colorPaletteOutline, brushOutline } from 'ionicons/icons';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    UserMenuComponent, 
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonIcon,
    CommonModule,
    FormsModule
  ]
})
export class SettingsPage {
  private themeService = inject(ThemeService);

  constructor() {
    addIcons({ colorPaletteOutline, brushOutline });
  }

  get currentTheme(): ThemeMode {
    return this.themeService.currentTheme();
  }

  get currentColorTheme(): ColorTheme {
    return this.themeService.currentColorTheme();
  }

  onThemeChange(event: any) {
    const newTheme = event.detail.value as ThemeMode;
    this.themeService.setTheme(newTheme);
  }

  onColorThemeChange(event: any) {
    const newColor = event.detail.value as ColorTheme;
    this.themeService.setColorTheme(newColor);
  }
}
