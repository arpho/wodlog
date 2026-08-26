import { Injectable } from '@angular/core';
import { get, onValue, push, ref, remove, set, update } from '@angular/fire/database';
import { Database } from '@angular/fire/database';
import { WodModel } from 'src/app/models/wod';

@Injectable({
  providedIn: 'root'
})
export class WodService {

  url = "wods"

  constructor(private db: Database) { }
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

  async createWod(wod: WodModel) {
    const wodRef = ref(this.db, this.url);
    const newWodRef = push(wodRef);
    wod.setKey(newWodRef.key!);
    const plainwod = JSON.parse(JSON.stringify({...wod.serialize()}));
    
    const rootRef = ref(this.db);
    const updates: any = {};
    updates[`${this.url}/${wod.key}`] = plainwod;
    
    await update(rootRef, updates);
    return wod.key;
  }
  fetchWodsRealtime(callback: (data:{wods: WodModel[],total:number}) => void) {
    console.log("**fetching all wods");
    const wodRef = ref(this.db, this.url);
    onValue(wodRef, (snapshot) => {
      console.log("snapshot", snapshot.val());
      if (snapshot.exists()) {
        const data = snapshot.val();
        const wods: WodModel[] = [];
        Object.entries(data).forEach(([key, value]) => {
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

  async rateWod(wodKey: string, userKey: string, rating: number) {
    const ratingRef = ref(this.db, `wodRatings/${wodKey}/${userKey}`);
    return set(ratingRef, {
      rating,
      date: new Date().getTime(),
      wodKey,
      userKey
    });
  }
}
