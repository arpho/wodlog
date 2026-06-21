import { UserMenuComponent } from '../../../../components/userMenu/user-menu.component';
import { Component, OnInit, signal, computed, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonBreadcrumbs,
  IonItem,
  IonFab,
  IonFabButton,
  IonIcon,
   IonBreadcrumb,
  IonThumbnail, IonImg, IonButtons,
  IonItemSliding, IonItemOptions, IonItemOption, IonSearchbar, IonChip, AlertController, ModalController } from '@ionic/angular/standalone';
import { WodService } from 'src/app/services/wod/wod.service';
import { addIcons } from 'ionicons';
import { add, trash, create, clipboard, star } from 'ionicons/icons';
import { Router } from '@angular/router';
import { WodModel } from 'src/app/models/wod';
import { ResultsService } from 'src/app/services/results/results.service';
import { ResultHandlerComponent } from "../../../../components/resultHandler/result-handler/result-handler.component";
import { WodRatingComponent } from "../../../../components/wodRating/wod-rating.component";
import { UsersService } from 'src/app/services/users/users.service';
import { CustomSorterPipe } from 'src/app/components/pipes/customSorter.pipe';
import { UserModel } from 'src/app/models/userModel';

@Component({
  selector: 'app-list-wod',
  templateUrl: './list-wod.page.html',
  styleUrls: ['./list-wod.page.scss'],
  standalone: true,
  imports: [IonButtons, UserMenuComponent, IonImg, IonBreadcrumb,
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
    IonBreadcrumb,
    IonBreadcrumbs,
    IonToolbar,
    CommonModule,
    FormsModule,
    ResultHandlerComponent,
    IonThumbnail,
    CustomSorterPipe,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonSearchbar,
    IonChip
],
})
export class ListWodPage implements OnInit {
  user!: UserModel;

  sorter = (a: WodModel, b: WodModel) => {
    return b.date -  a.date; //a.date - b.date;
  };
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

  async deleteWod(wod: WodModel) {
    const alert = await this.alertCtrl.create({
      header: 'Conferma',
      message: `Sei sicuro di voler eliminare il WOD "${wod.title}"?`,
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel'
        },
        {
          text: 'Elimina',
          role: 'destructive',
          handler: () => {
            this.service.deleteWod(wod);
          }
        }
      ]
    });
    await alert.present();
  }

  async rateWod(wod: WodModel) {
    const modal = await this.modalCtrl.create({
      component: WodRatingComponent,
      componentProps: {
        wodTitle: wod.title || (wod.wod ? wod.wod.join(', ') : 'WOD')
      },
      cssClass: 'rating-modal'
    });
    
    await modal.present();
    
    const { data, role } = await modal.onWillDismiss();
    
    if (role === 'confirm' && data?.rating) {
      const rating = Number(data.rating);
      if (rating >= 1 && rating <= 5) {
        this.service.rateWod(wod.key, this.user.key, rating);
      }
    }
  }

  @ViewChildren(ResultHandlerComponent) resultHandlers!: QueryList<ResultHandlerComponent>;

  triggerResultHandler(wodKey: string) {
    const handler = this.resultHandlers.find(h => h.wodKey === wodKey);
    if (handler) {
      if (handler.Result() && handler.Result().result) {
         handler.updateResult();
      } else {
         handler.setResult();
      }
    }
  }

  wods = signal<WodModel[]>([]);

  searchText = signal<string>('');
  filterHero = signal<boolean>(false);
  filterGirl = signal<boolean>(false);
  filterBenchmark = signal<boolean>(false);
  filterDate = signal<string>('');

  filteredWods = computed(() => {
    let list = this.wods();

    if (this.filterHero()) list = list.filter(w => w.hero);
    if (this.filterGirl()) list = list.filter(w => w.girl);
    if (this.filterBenchmark()) list = list.filter(w => w.benchmark);

    const date = this.filterDate();
    if (date) {
      list = list.filter(w => {
        const wodDate = new Date(w.date).toISOString().split('T')[0];
        return wodDate === date;
      });
    }

    const search = this.searchText().toLowerCase().trim();
    if (search) {
      list = list.filter(w => {
        const inForce = w.force?.some(f => f.toLowerCase().includes(search));
        const inWod = w.wod?.some(x => x.toLowerCase().includes(search));
        return inForce || inWod;
      });
    }

    return list;
  });

  constructor(private service: WodService, private router: Router, private resultService:ResultsService, private users:UsersService, private alertCtrl: AlertController, private modalCtrl: ModalController) {
    addIcons({ add, trash, create, clipboard, star });
  }

  async ngOnInit() {
    console.log("loading wods")
    this.user = await this.users.getLoggedUser()
    this.title = `pr di ${this.user.firstName}`
    console.log("user",this.user);
    const callback = (data: { wods: WodModel[]; total: number }) => {
      console.log('data', data);
      this.wods.set(data.wods);
      console.log('wods', this.wods());
      console.log("sorted wods", this.wods().sort(this.sorter));
    };
    this.service.fetchWodsRealtime(callback);
  }
}
