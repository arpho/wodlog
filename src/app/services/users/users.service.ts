import { Injectable } from '@angular/core';
import { Auth, authState, signInAnonymously, signOut, GoogleAuthProvider, signInWithPopup, getAuth } from '@angular/fire/auth';
import { AuthService } from '../auth/auth.service';
import { getDatabase, onValue, ref } from "firebase/database";
import { UserModel } from 'src/app/models/userModel';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  db = getDatabase();

  constructor( private auth:Auth,

    private MyAuth:AuthService
  ) { }
   isUserAuthenticated():Promise<boolean> {
 return new Promise((resolve, reject) => {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
   }

   getLoggedUser():Promise<UserModel>{

    return new Promise((resolve, reject) => {
      this.MyAuth.getUser().subscribe(async (user) => {
        if (user) {

         const loggedUser = await this.getUserByUid(user.uid)
          resolve(loggedUser);
        }
      })

    })
}
logout(){
  const auth = getAuth();
  console.log("auth",auth)
  auth.signOut();
}

getUserByUid(uid:string):Promise<UserModel>{
const UsewrRef = ref(this.db,`userProfile/${uid}` );
return new Promise((resolve, reject) =>{
onValue(UsewrRef, (snapshot) => {
  if(snapshot.exists()){
    const data = snapshot.val();
    const user = new UserModel(data).setKey(uid)
    resolve(user);
  }else{console.log("No user found")
    reject("no data found");
  }
})

})
}
}
