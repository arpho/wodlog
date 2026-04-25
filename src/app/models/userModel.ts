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
  weight: number | null = null
  height: number | null = null
  gender: string = ''
  featuredPrs: string[] = []
  photoUrl: string = ''
  constructor(args?:{}){
    this.build(args);
  }

  build(args?:{}){
    Object.assign(this, args)
    const pr:ActivityModel[] = []
    if (this.prList) {
      Object.entries(this.prList).forEach(([key, value]) => {
        pr.push(new ActivityModel(value).setKey(key))
      })
    }
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
    userName: this.userName,
    weight: this.weight,
    height: this.height,
    gender: this.gender,
    featuredPrs: this.featuredPrs || [],
    photoUrl: this.photoUrl || ''
  }
}
}
