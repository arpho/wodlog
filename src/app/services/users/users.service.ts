import { Injectable } from '@angular/core';
import { Auth, getAuth } from '@angular/fire/auth';
import { AuthService } from '../auth/auth.service';
import { get, ref, set, onValue, remove } from '@angular/fire/database';
import { Database as FireDatabase } from '@angular/fire/database';
import { UserModel } from 'src/app/models/userModel';
import { firstValueFrom, take, Observable } from 'rxjs';
import { Functions, httpsCallable } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private auth: Auth,
    private MyAuth: AuthService,
    private db: FireDatabase,
    private functions: Functions
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

  async getAllUsers(): Promise<UserModel[]> {
    const usersRef = ref(this.db, 'userProfile');
    const snapshot = await get(usersRef);
    const out: UserModel[] = [];
    if (snapshot.exists()) {
      Object.entries(snapshot.val()).forEach(([key, value]) => {
        out.push(new UserModel(value as any).setKey(key));
      });
    }
    return out;
  }

  getUsersList(): Observable<UserModel[]> {
    return new Observable((subscriber) => {
      const usersRef = ref(this.db, 'userProfile');
      const unsubscribe = onValue(usersRef, (snapshot) => {
        const out: UserModel[] = [];
        if (snapshot.exists()) {
          Object.entries(snapshot.val()).forEach(([key, value]) => {
            out.push(new UserModel(value as any).setKey(key));
          });
        }
        subscriber.next(out);
      }, (error) => {
        subscriber.error(error);
      });
      return () => unsubscribe();
    });
  }

  getPendingNotifications(): Observable<any[]> {
    return new Observable((subscriber) => {
      const notificationsRef = ref(this.db, 'notifications');
      const unsubscribe = onValue(notificationsRef, (snapshot) => {
        const out: any[] = [];
        if (snapshot.exists()) {
          Object.entries(snapshot.val()).forEach(([key, value]) => {
            out.push({ ...(value as any), key });
          });
        }
        subscriber.next(out);
      }, (error) => {
        subscriber.error(error);
      });
      return () => unsubscribe();
    });
  }

  dismissNotification(userKey: string): Promise<void> {
    const notificationRef = ref(this.db, `notifications/${userKey}`);
    return remove(notificationRef);
  }

  async deleteUser(targetUid: string): Promise<any> {
    const deleteUserFn = httpsCallable(this.functions, 'deleteUser');
    const response = await deleteUserFn({ targetUid });
    return response.data;
  }
}
