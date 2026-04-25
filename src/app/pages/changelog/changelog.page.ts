import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButtons, 
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonIcon,
  IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { rocketOutline, colorPaletteOutline, trendingUpOutline, buildOutline, bugOutline, starOutline } from 'ionicons/icons';

interface Change {
  type: 'feature' | 'ui' | 'fix' | 'refactor';
  description: string;
}

interface Version {
  version: string;
  date: string;
  changes: Change[];
}

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.page.html',
  styleUrls: ['./changelog.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonButtons, 
    IonBackButton, 
    IonList, 
    IonItem, 
    IonLabel, 
    IonBadge,
    IonIcon,
    IonText,
    CommonModule
  ]
})
export class ChangelogPage implements OnInit {

  changelog: Version[] = [
    {
      version: '2.0.0',
      date: '25 Aprile 2026',
      changes: [
        { type: 'ui', description: 'Restyle completo con design Glassmorphism Premium' },
        { type: 'feature', description: 'Caricamento immagine profilo personalizzata via Firebase Storage' },
        { type: 'feature', description: 'Nuovo sistema di tracciamento Trend PR con note e indicatori' },
        { type: 'ui', description: 'Migliorata la visibilità e il contrasto delle card prestazione' },
        { type: 'ui', description: 'Dashboard Home ridisegnata per accesso rapido' },
        { type: 'refactor', description: 'Refactoring dei moduli WOD e liste in componenti standalone' },
        { type: 'fix', description: 'Risolti problemi di importazione e registrazione icone' }
      ]
    },
    {
      version: '1.2.0',
      date: 'Aprile 2026',
      changes: [
        { type: 'feature', description: 'Implementazione menu utente con integrazione Gravatar' },
        { type: 'refactor', description: 'Ottimizzazione caricamento dati in tempo reale da Firebase' }
      ]
    }
  ];

  constructor() {
    addIcons({ 
      rocketOutline, 
      colorPaletteOutline, 
      trendingUpOutline, 
      buildOutline, 
      bugOutline, 
      starOutline 
    });
  }

  getIconForType(type: string) {
    switch (type) {
      case 'feature': return 'rocket-outline';
      case 'ui': return 'color-palette-outline';
      case 'fix': return 'bug-outline';
      case 'refactor': return 'build-outline';
      default: return 'star-outline';
    }
  }

  getColorForType(type: string) {
    switch (type) {
      case 'feature': return 'success';
      case 'ui': return 'tertiary';
      case 'fix': return 'danger';
      case 'refactor': return 'warning';
      default: return 'medium';
    }
  }

  ngOnInit() {
  }

}
