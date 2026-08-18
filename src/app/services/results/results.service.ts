import { Injectable } from '@angular/core';
import {
  ref,
  orderByChild,
  equalTo,
  onValue,
  get,
  push,
  update,
  query,
} from 'firebase/database';
import { ResultsModel } from 'src/app/models/results';
import { Database } from '@angular/fire/database';
@Injectable({
  providedIn: 'root',
})
export class ResultsService {
  updateResult(result: ResultsModel) {
const refResults = ref(this.db, `${this.url}/${result.key}`);
return update(refResults, result.serialize());
  }
  url = 'results';
  constructor(private db: Database) {}
  setResult(userKey: string, wodKey: string, prestazione: ResultsModel) {
    const refResults = ref(this.db, this.url);
    console.log('setting result', prestazione);
    const newResultRef = push(refResults, prestazione.serialize());
    prestazione.key = newResultRef.key as string;
    return update(newResultRef, prestazione.serialize());
  }

  getResult(userKey: string, wodKey: string): Promise<ResultsModel[]> {
    return new Promise((resolve, reject) => {
      const resultsRef = ref(this.db, this.url);
      const userResultsQuery = query(
        resultsRef,
        orderByChild('userKey'),
        equalTo(userKey)
      );
      get(userResultsQuery).then((snapshot) => {
        const out: ResultsModel[] = [];
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            if (childSnapshot.val().wodKey == wodKey) {
              const res = new ResultsModel(childSnapshot.val()).setKey(
                childSnapshot.key
              );
              out.push(res);
            }
          });
        }
        resolve(out);
      }).catch((error) => {
        reject(error);
      });
    });
  }
}
