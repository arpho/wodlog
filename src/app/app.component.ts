import { Component, OnInit } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet, ToastController } from '@ionic/angular/standalone';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';
import { ThemeService } from './services/theme/theme.service';
import { getDatabase, ref, onValue } from 'firebase/database';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private dbUnsubscribe: (() => void) | null = null;

  constructor(
    private _auth: AngularFireAuth,
    private router: Router,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
    private themeService: ThemeService
  ) {
    this.themeService.initializeTheme();

    let previousEnabledState: boolean | null = null;

    _auth.onAuthStateChanged((user) => {
      if (this.dbUnsubscribe) {
        this.dbUnsubscribe();
        this.dbUnsubscribe = null;
      }

      if (user) {
        console.log("user is logged", user);

        const db = getDatabase();
        const userRef = ref(db, `userProfile/${user.uid}`);

        this.dbUnsubscribe = onValue(userRef, async (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const isEnabled = data.enabled === undefined ? true : data.enabled;

            // Se lo stato dell'utente cambia da disabilitato (false) ad abilitato (true)
            if (previousEnabledState === false && isEnabled === true) {
              console.log("User enabled state transitioned from false to true!");

              // 1. Forza il refresh del token di autenticazione per aggiornare i claims locali
              try {
                await user.getIdToken(true);
                console.log("Auth token refreshed successfully.");
              } catch (tokenErr) {
                console.error("Errore durante il refresh del token:", tokenErr);
              }

              // 2. Mostra la notifica Toast istantanea riportante il nome dell'app "WodLog"
              const toast = await this.toastCtrl.create({
                message: 'WodLog: Il tuo account è stato abilitato! Tutte le funzionalità sono ora attive.',
                position: 'top',
                duration: 6000,
                color: 'success',
                buttons: [
                  {
                    text: 'Ok',
                    role: 'cancel'
                  }
                ]
              });
              await toast.present();
            }

            previousEnabledState = isEnabled;
          } else {
            previousEnabledState = false;
          }
        }, (err) => {
          console.error("Errore nell'ascolto del profilo utente:", err);
        });

      }
      else {
        console.log("user is not logged")
        this.router.navigate(['/login'])
        previousEnabledState = null;
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
