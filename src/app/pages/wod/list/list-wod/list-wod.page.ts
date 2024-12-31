import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonItem, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { WodService } from 'src/app/services/wod/wod.service';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { Router } from '@angular/router';
import { WodModel } from 'src/app/models/wod';

@Component({
  selector: 'app-list-wod',
  templateUrl: './list-wod.page.html',
  styleUrls: ['./list-wod.page.scss'],
  standalone: true,
  imports: [IonIcon, IonFabButton, IonFab, IonItem, IonCol, IonRow, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ListWodPage implements OnInit {
createWod() {
console.log("create wod");
this.router.navigateByUrl(`/create-wod`);

}
fetchResult4wod(_t26: any) {
console.log("fetching result");
return  "result ?"
}
showDate(wod: WodModel) {
console.log("show date",wod);
return new Date( wod.date).toLocaleDateString();
}
editWod(wod: WodModel
) {
throw new Error('Method not implemented.');
}
  wods = signal<WodModel[]>([]);

  constructor(
    private service:WodService,
    private router:Router
  ) {
    addIcons({add});
  }

  ngOnInit() {
const callback = (data:{wods:WodModel[], total:number}) => {
  this.wods.set(data.wods);
  console.log("wods",this.wods());

}
    this.service.fetchWodsRealtime(callback);
  }

}
