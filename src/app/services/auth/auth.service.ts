import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { firstValueFrom, take } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; // Import the authentication module
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth,
    private http: HttpClient
  ) {
  }
/*   async googleLogin(): Promise<void> {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    await this.sendTokenToBackend(credential.user as firebase.User); // Ensure type is correctly cast
  } */
  async logout(): Promise<void> {
    await this.afAuth.signOut();
    //TODO initialize firebase
  }

  getUser(): Observable<firebase.User | null> {
    console.log("getting user");
    return this.afAuth.authState;
  }

  async isUserLogged(): Promise<boolean> {
    const user = await firstValueFrom(this.getUser().pipe(take(1)));
    if (user) {
      console.log("user is logged", user);
      return true;
    } else {
      return false;
    }
  }

  sendPasswordResetEmail(email: string): Promise<void> { // Add this method
    return this.afAuth.sendPasswordResetEmail(email);
  }
}