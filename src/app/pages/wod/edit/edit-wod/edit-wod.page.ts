import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/services/users/users.service';
import { WodModel } from 'src/app/models/wod';
import { WodService } from 'src/app/services/wod/wod.service';
import { WodFormComponent } from "../../../../components/wodForm/wodForm/wod-form/wod-form.component";
import { ResultHandlerComponent } from 'src/app/components/resultHandler/result-handler/result-handler.component';
import { UserModel } from '/home/giuseppe/Documenti/projects/wodLog/src/app/models/userModel';

@Component({
  selector: 'app-edit-wod',
  templateUrl: './edit-wod.page.html',
  styleUrls: ['./edit-wod.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, WodFormComponent,
    ResultHandlerComponent
  ]
})
export class EditWodPage implements OnInit {
  loggedUser: import("/home/giuseppe/Documenti/projects/wodLog/src/app/models/userModel").UserModel = new UserModel()
updateWod($event: WodModel) {
throw new Error('Method not implemented.');
}
  subscriptions = new Subscription()
  Wod = new WodModel()

  constructor(
    private route:ActivatedRoute,
    private users:UsersService,
    private wods:WodService
  ) { }

  async ngOnInit() {
  this.loggedUser = await this.users.getLoggedUser()
    this.subscriptions.add(this.route.queryParams.subscribe(async params=>{
      console.log("params", params);
      const loggedUser = await this.users.getLoggedUser()
      this.Wod = await this.wods.getWodByKey(params["wodKey"]);
      console.log("wod", this.Wod);

      })
    )
  }

}
