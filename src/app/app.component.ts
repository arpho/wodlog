import { Component, OnInit } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet, ToastController } from '@ionic/angular/standalone';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(
    private _auth: AngularFireAuth,
    private router: Router,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController
  ) {


    _auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("user is logged", user);
      }
      else {
        console.log("user is not logged")
        this.router.navigate(['/login'])
      }
    })
  }

  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
        .subscribe(async () => {
          const toast = await this.toastCtrl.create({
            message: 'Nuova versione dell\'app disponibile!',
            position: 'bottom',
            duration: 0,
            buttons: [
              {
                text: 'Ricarica',
                role: 'cancel',
                handler: () => {
                  window.location.reload();
                }
              }
            ]
          });
          await toast.present();
        });
    }
  }
}
