import { PrModel } from "./Pr"

export class ActivityModel{
  descrizione = ""
  date: number = new Date().getTime()
  key = ""
  girl = false
  hero = false
  typePr: "regular"|"benchmark" = "regular";
  prList:PrModel[] = [];
  unity:" kg "|" sec " = " kg ";
  constructor(args?:{}){

    this.build(args);

  }
  set id(id:string){
    this.key = id
  }

  get id(){
    return this.key
  }
  build(args?:{}){
   Object.assign(this, args);
   if(args){
this.prList = this.prList?.map((pr)=>{
  return new PrModel(pr)});

   }
   return this
  }
  setKey(key:string){
    this.id = key;
    return this;
  }

  getMax4Kg(){
    return this.prList.sort((a,b) => {
      return b.prestazione - a.prestazione})[0];
  }
  getMax4Sec(){
    return this.prList.sort((a,b) => a.prestazione - b.prestazione)[0];
  }
  getMaxPr(){

return this.unity==" sec " ? this.getMax4Sec() : this.getMax4Kg();
  }
  serialize(){
    return {
      key: this.id,
      descrizione:this.descrizione,
      date: this.date,
      girl: this.girl,
      hero:this.hero,
      unity: this.unity,
      typePr:this.typePr,
      prList: this.prList.map((pr) => pr.serialize()
    )
    }
  }
  get stringifiedDate(){
    return new Date(this.date).toLocaleDateString();
  }
  set stringifiedDate(date:string){
    this.date = new Date(date).getTime();
  }

}
