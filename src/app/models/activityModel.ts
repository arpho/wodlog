import { PrModel } from "./Pr"

export class ActivityModel{
  description = ""
  date: number = new Date().getTime()
  key = ""
  girl = false
  hero = false
  typePr: "regular"|"benchmark" = "regular";
  PrList:PrModel[] = [];
  constructor(args?:{}){

    this.build(args);

  }
  build(args?:{}){
   Object.assign(this, args);
   if(args){
this.PrList = this.PrList?.map((pr:PrModel) => new PrModel(pr));
   }
   return this
  }
  setKey(key:string){
    this.key = key;
    return this;
  }
  serialize(){
    return {
      key: this.key,
      description:this.description,
      date: this.date,
      girl: this.girl,
      hero:this.hero,
      typePr:this.typePr
    }
  }
  get stringifiedDate(){
    return new Date(this.date).toLocaleDateString();
  }

}
