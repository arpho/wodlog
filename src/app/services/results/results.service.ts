import { Injectable } from '@angular/core';
import {
  getDatabase,
  ref,
  orderByChild,
  equalTo,
  onValue,
  push,
  update,
} from 'firebase/database';
import { ResultsModel } from 'src/app/models/results';
@Injectable({
  providedIn: 'root',
})
export class ResultsService {
  updateResult(result: ResultsModel) {
const refResults = ref(this.db, `${this.url}/${result.key}`);
return update(refResults, result.serialize());
  }
  url = 'results';
  db = getDatabase();
  constructor() {}
  setResult(userKey: string, wodKey: string, prestazione: ResultsModel) {
    const refResults = ref(this.db, this.url);
    console.log('setting result', prestazione);
    const newResultRef = push(refResults, prestazione.serialize());
    return update(newResultRef, prestazione.serialize());
  }

  getResult(userKey: string, wodKey: string): Promise<ResultsModel[]> {
    return new Promise((resolve, reject) => {
      const resultsRef = ref(this.db, this.url);
      onValue(resultsRef, (snapshot) => {
        const out: ResultsModel[] = [];
        snapshot.forEach((childSnapshot) => {
          if (
            childSnapshot.val().wodKey == wodKey &&
            childSnapshot.val().userKey == userKey
          ) {
            const res = new ResultsModel(childSnapshot.val()).setKey(
              childSnapshot.key
            );
            out.push(res);
          }
        });
        resolve(out);
      });
    });
  }
}
