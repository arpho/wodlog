import { Injectable } from '@angular/core';
import { getDatabase, ref, orderByChild, equalTo, once } from "firebase/database";
import { ResultsModel } from 'src/app/models/results';
@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  url = "results"
db = getDatabase()
  constructor() { }

  getResult(userKey:string,wodKey:string):Promise<ResultsModel>{

    return new Promise((resolve, reject) => {

    const resultsRef = ref(this.db, this.url);
    once(ref,orderByChild("userKey"),equalTo(userKey),(snapshot: any[])=>{
      const out:ResultsModel[] = [];
      snapshot.forEach((childSnapshot) => {
        if(childSnapshot.val().wodKey == wodKey){
          const res = new ResultsModel(childSnapshot.val()).setKey(childSnapshot.key);
          out.push(res);
        }
      })
      resolve(out[0]);
    })
    })
  }
}


