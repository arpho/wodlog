export class PrModel{
id = 0;
unity:" kg "|" sec " = " kg ";
date = new Date().getTime();
prestazione  = 0;
note = "";
stringifiedDate=""



constructor(args?:{}){
  this.build(args)
}
build(args?:{}){
  Object.assign(this,args);
  this.prestazione= Number (this.prestazione);
  this.date = new Date(this.date).getTime();
if(Number.isNaN(this.date))
this.date = new Date(this.stringifiedDate).getTime();
  return this
}
getDate(){
  return new Date(this.date).toLocaleDateString();
}
serialize(){
  return {
    prestazione: this.prestazione,
    id:this.id,
    date:this.date,
    unity:this.unity,
    note:this.note
  }
}

}
