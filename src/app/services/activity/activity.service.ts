import { ActivityModel } from './../../models/activityModel';
import { getDatabase, ref, set,push, onValue } from 'firebase/database';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  db = getDatabase()

  constructor() { }

  set(userKey:string, activity:ActivityModel){
return set(ref(this.db,`activities/${userKey}/${activity.key}`),activity.serialize())
  }



  create(userKey:string, activity:ActivityModel){
    return push(ref(this.db,`activities/${userKey}`),activity.serialize())
  }

  realtimeFetchAllActivities(userKey:string, callback:(data:{data:ActivityModel[],total:number})=>void){
    console.log("**fetching all activities for ", userKey)
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
