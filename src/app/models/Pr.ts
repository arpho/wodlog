export class PrModel{
id = 0;
unity:"kg"|"sec" = "kg";
date = new Date().getTime();
prestazione  = 0;
note = "";

constructor(args?:{}){
  this.build(args)
}
build(args?:{}){
  Object.assign(this,args);
  return this
}
serialize(){
  return {}
}

}
