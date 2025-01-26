import { Injectable } from '@angular/core';
import { get, getDatabase, onValue, push, ref, remove, set, update } from '@firebase/database';
import { WodModel } from 'src/app/models/wod';

@Injectable({
  providedIn: 'root'
})
export class WodService {

  url = "wods"

  constructor() { }
  updateWod($wod: WodModel) {
    const wodRef = ref(this.db, `${this.url}/${$wod.key}`);
    return update(wodRef, $wod.serialize());

  }
  deleteWod(Wod: WodModel) {
const wodRef = ref(this.db, `${this.url}/${Wod.key}`);
return remove(wodRef);
  }
  async getWodByKey( key: string): Promise<WodModel> {
    const url = `${this.url}/${key}`
const wodRef = ref(this.db, `${this.url}/${key}`);
const snapshot = await get(wodRef);
const wod = new WodModel(snapshot.val()).setKey(key);
return wod;
  }

  db = getDatabase()
  async createWod(wod: WodModel) {
    const wodRef = ref(this.db, this.url);

    const newWodRef = await push(wodRef);
    wod.setKey(newWodRef.key!);
    update(newWodRef, wod.serialize());


    return wod.key;
  }
  fetchWodsRealtime(callback: (data:{wods: WodModel[],total:number}) => void) {
    console.log("**fetching all wods");
    const wodRef = ref(this.db, this.url);
    onValue(wodRef, (snapshot) => {
      console.log("snapshot", snapshot.val());
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
}
