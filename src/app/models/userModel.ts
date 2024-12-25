import { ActivityModel } from "./activityModel";

export class UserModel{
  setKey(uid: string) {
  this.key = uid;
  return this
  }
  key = ''
  birthDate: string|number = ''
  email = ''
  firstName = ''
  lastName = ''
  password = ''
  phoneNumber = ''
  role = ''
  prList: ActivityModel[] = []
  userName = ''
  constructor(args?:{}){
    this.build(args);
  }

  build(args?:{}){
    Object.assign(this, args)
    console.log("**prList", this.prList, typeof this.prList)
    console.log("** keys", Object.keys(this.prList));
    const pr:ActivityModel[] = []
Object.entries(this.prList).forEach(([key, value]) => {
  pr.push(new ActivityModel(value).setKey(key))
})
console.log("**prList array", pr);
this.prList= pr

    return this

}
serialize(){
  return{
    key: this.key,
    birthDate: this.birthDate,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    password: this.password,
    phoneNumber: this.phoneNumber,
    role: this.role,
    userName: this.userName
  }
}
}
