import { Component } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(
    private _auth: AngularFireAuth,
    private router:Router
  ) {


    _auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("user is logged", user);
      }
      else  {
        console.log("user is not logged")
        this.router.navigate(['/login'])
      }
    })
  }
}
