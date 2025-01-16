import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { WodService } from 'src/app/services/wod/wod.service';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { Router } from '@angular/router';
import { WodModel } from 'src/app/models/wod';
import { ResultsService } from 'src/app/services/results/results.service';
import { ResultHandlerComponent } from "../../../../components/resultHandler/result-handler/result-handler.component";
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-list-wod',
  templateUrl: './list-wod.page.html',
  styleUrls: ['./list-wod.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonFabButton,
    IonFab,
    IonItem,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ResultHandlerComponent
],
})
export class ListWodPage implements OnInit {
user: any;
title="";
  createWod() {
    console.log('create wod');
    this.router.navigateByUrl(`/create-wod`);
  }
  fetchResult4wod(_t26: any) {
    console.log('fetching result for ',_t26);


    return 'result ?';
  }
  showDate(wod: WodModel) {
    return new Date(wod.date).toLocaleDateString();
  }
  editWod(wod: WodModel) {
    console.log('edit wod', wod);
    this.router.navigateByUrl(`/edit-wod?wodKey=${wod.key}`);
  }
  wods = signal<WodModel[]>([]);

  constructor(private service: WodService, private router: Router, private resultService:ResultsService, private users:UsersService) {
    addIcons({ add });
  }

  async ngOnInit() {
    this.user = await this.users.getLoggedUser()
    this.title = `pr di ${this.user.name}`
    const callback = (data: { wods: WodModel[]; total: number }) => {
      console.log('data', data);
      this.wods.set(data.wods);
      console.log('wods', this.wods());
    };
    this.service.fetchWodsRealtime(callback);
  }
}
