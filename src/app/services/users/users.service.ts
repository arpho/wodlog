import { Injectable } from '@angular/core';
import { Auth, authState, signInAnonymously, signOut, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { AuthService } from '../auth/auth.service';
import { getDatabase, onValue, ref } from "firebase/database";
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

   getLoggedUser(){
    this.MyAuth.getUser() .subscribe((user) => {
  if(user){
    console.log("user uid",user.uid);
    this.getUserByUid(user.uid)
  }

   }
  )
}

getUserByUid(uid:string){
const UsewrRef = ref(this.db,`userProfile/uid` );
onValue(UsewrRef, (snapshot) => {
  if(snapshot.exists()){
    const data = snapshot.val();
    console.log("user data",data);
  }else{console.log("no data found");}
})
}
}
