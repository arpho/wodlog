import { PrModel } from "./Pr"

export class ActivityModel{
  descrizione = ""
  date: number = new Date().getTime()
  id = ""
  girl = false
  hero = false
  typePr: "regular"|"benchmark" = "regular";
  PrList:PrModel[] = [];
  unity:" kg "|" sec " = " kg ";
  constructor(args?:{}){

    this.build(args);

  }
  build(args?:{}){
   Object.assign(this, args);
   if(args){
this.PrList = this.PrList?.map((pr)=>{
  return new PrModel(pr)});

   }
   return this
  }
  setKey(key:string){
    this.id = key;
    return this;
  }

  getMax4Kg(){
    return this.PrList.sort((a,b) => {
      return b.prestazione - a.prestazione})[0];
  }
  getMax4Sec(){
    return this.PrList.sort((a,b) => a.prestazione - b.prestazione)[0];
  }
  getMaxPr(){

return this.unity==" sec " ? this.getMax4Sec() : this.getMax4Kg();
  }
  serialize(){
    return {
      id: this.id,
      descrizione:this.descrizione,
      date: this.date,
      girl: this.girl,
      hero:this.hero,
      unity: this.unity,
      typePr:this.typePr
    }
  }
  get stringifiedDate(){
    return new Date(this.date).toLocaleDateString();
  }
  set stringifiedDate(date:string){
    this.date = new Date(date).getTime();
  }

}
