export class  WodModel {
  key = "";
  description: string[] = [];
  date:number = new Date().getTime();
  title = "";
constructor(args?:{}){
  this.build(args);
}
  get wodDate(){
    return new Date(this.date).toLocaleDateString();
  }

  build(args?:{}){
    Object.assign(this, args)
    return this
  }

  setKey(key:string){
    this.key = key;
    return this;
  }
  serialize(){
    return{
      key: this.key,
      description: this.description,
      date: this.date,
      title: this.title
    }
  }
}
