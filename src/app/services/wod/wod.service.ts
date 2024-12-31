import { Injectable } from '@angular/core';
import { getDatabase, onValue, push, ref } from '@firebase/database';
import { WodModel } from 'src/app/models/wod';

@Injectable({
  providedIn: 'root'
})
export class WodService {
  url = "wods"

  db = getDatabase()
  createWod(wod: WodModel) {
    const wodRef = ref(this.db, this.url);
    return push(wodRef, wod.serialize());
  }
  fetchWodsRealtime(callback: (data:{wods: WodModel[],total:number}) => void) {
    console.log("**fetching all wods");
    const wodRef = ref(this.db, this.url);
    onValue(wodRef, (snapshot) => {
      console.log("snapshot", snapshot);
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("data", data);
        const wods: WodModel[] = [];
        Object.entries(data).forEach(([key, value]) => {
console.log("value",value)
          if (value) {
            wods.push(new WodModel(value).setKey(key));
          }
        });
        callback({ wods: wods, total: wods.length });
      }
      else {
        console.log("no wods found");
        callback({ wods: [], total: 0 });
      }
    },
  (error)=>{
    console.log("error",error)

  })


  }
  constructor() { }
}
