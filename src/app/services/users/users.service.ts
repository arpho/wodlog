import { Injectable } from '@angular/core';
import { Auth, getAuth } from '@angular/fire/auth';
import { AuthService } from '../auth/auth.service';
import { getDatabase, get, ref, set } from "firebase/database";
import { UserModel } from 'src/app/models/userModel';
import { firstValueFrom, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  db = getDatabase();

  constructor(
    private auth: Auth,
    private MyAuth: AuthService
  ) { }

  isUserAuthenticated(): Promise<boolean> {
    return new Promise((resolve) => {
      const unsubscribe = this.auth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(!!user);
      }, () => {
        resolve(false);
      });
    });
  }

  async getLoggedUser(): Promise<UserModel> {
    const user = await firstValueFrom(this.MyAuth.getUser().pipe(take(1)));
    if (user) {
      return this.getUserByUid(user.uid);
    } else {
      throw new Error("No user is logged");
    }
  }

  logout() {
    const auth = getAuth();
    console.log("auth", auth);
    auth.signOut();
  }

  updateUser(user: UserModel): Promise<void> {
    const userRef = ref(this.db, `userProfile/${user.key}`);
    return set(userRef, user.serialize());
  }

  async getUserByUid(uid: string): Promise<UserModel> {
    const userRef = ref(this.db, `userProfile/${uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return new UserModel(data).setKey(uid);
    } else {
      console.log("No user found");
      throw new Error("no data found");
    }
  }
}
