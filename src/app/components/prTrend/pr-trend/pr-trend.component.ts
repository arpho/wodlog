import { Component, OnInit, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonIcon, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle, 
  IonCardContent,
  IonText,
  IonNote
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowUpOutline, arrowDownOutline, removeOutline } from 'ionicons/icons';
import { ActivityModel } from 'src/app/models/activityModel';
import { PrestazionePipe } from 'src/app/pipes/prestazione/prestazione.pipe';

@Component({
  selector: 'app-pr-trend',
  templateUrl: './pr-trend.component.html',
  styleUrls: ['./pr-trend.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonIcon, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardSubtitle, 
    IonCardContent,
    IonText,
    IonNote,
    PrestazionePipe
  ]
})
export class PrTrendComponent implements OnInit {
  activity = input<ActivityModel>();

  trendDetail = computed(() => {
    const act = this.activity();
    if (!act || !act.prList || act.prList.length === 0) return null;

    const sortedPrs = [...act.prList].sort((a, b) => (b.date ?? 0) - (a.date ?? 0));
    const latest = sortedPrs[0];
    const previous = sortedPrs[1];

    let trend: 'better' | 'worse' | 'equal' | 'none' = 'none';

    if (previous) {
      const latestVal = Number(latest?.prestazione ?? 0);
      const prevVal = Number(previous?.prestazione ?? 0);

      if (act.unity === ' sec ') {
        if (latestVal < prevVal) trend = 'better';
        else if (latestVal > prevVal) trend = 'worse';
        else trend = 'equal';
      } else {
        if (latestVal > prevVal) trend = 'better';
        else if (latestVal < prevVal) trend = 'worse';
        else trend = 'equal';
      }
    }

    return {
      descrizione: act.descrizione,
      value: latest?.prestazione,
      unity: act.unity,
      date: latest?.date,
      note: latest?.note,
      trend: trend
    };
  });

  constructor() {
    addIcons({ arrowUpOutline, arrowDownOutline, removeOutline });
  }

  ngOnInit() {}
}
