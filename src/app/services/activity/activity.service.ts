import { ActivityModel } from './../../models/activityModel';
import { getDatabase, ref, set,push, get,onValue, remove } from 'firebase/database';
import { Injectable } from '@angular/core';
import { user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  update(userKey:string, activity: ActivityModel) {
   return new Promise((resolve, reject) => {
    const refActivity = ref(this.db,`activities/${userKey}/${activity.key}`);
   })
  }
  delete(userKey:string, activity: ActivityModel) {
const refActivity = ref(this.db,`activities/${userKey}/${activity.key}`);
return remove(refActivity)
  }
  async getActivityByKey(activityKey: string, userKey:string) {
console.log ("getting activity by key",activityKey);
const refActivity = ref(this.db,`activities/${userKey}/${activityKey}`);

const snapshot = await get(refActivity);
const activity = new ActivityModel(snapshot.val()).setKey(activityKey)
console.log("just got activity",activity);
return activity;
  }
  db = getDatabase()

  constructor() { }

  set(userKey:string, activity:ActivityModel){
return set(ref(this.db,`activities/${userKey}/${activity.key}`),activity.serialize())
  }



  create(userKey:string, activity:ActivityModel){
    return push(ref(this.db,`activities/${userKey}`),activity.serialize())
  }

  realtimeFetchAllActivities(userKey:string, callback:(data:{data:ActivityModel[],total:number})=>void){
const activitiesRef = ref(this.db,`activities/${userKey}`)
onValue(activitiesRef, (snapshot) => {
  if(snapshot.exists()){
    const data = snapshot.val();
    const activities:ActivityModel[] = [];
    Object.entries(data).forEach(([key, value]) => {
    if(value)
      activities.push(new ActivityModel(value).setKey(key))
    })
    callback({data:activities,total:activities.length})
  }
})

  }
}
