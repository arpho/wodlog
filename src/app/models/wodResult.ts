export class WodResultsModel{
wodKey= ""
date= new Date().getTime()
result = ""
note = ""
cnstructor( args?:{}){
  this.build(args)
}
build(args?:{}){
  Object.assign(this, args);
  return this;
}
}
