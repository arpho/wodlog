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
    console.log("prList",this.prList)
    if(this.prList.length >0)
      this.prList = this.prList?.map((pr:ActivityModel) => new ActivityModel(pr));
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
