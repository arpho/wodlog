export class PrModel{
id = 0;
unity:" kg "|" sec " = " kg ";
date = new Date().getTime();
$prestazione  = 0;
note = "";


set prestazione(prestazione:number){
  this.$prestazione = prestazione
}
get prestazione(){
  return this.$prestazione
}
constructor(args?:{}){
  this.build(args)
}
build(args?:{}){
  Object.assign(this,args);
  return this
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
