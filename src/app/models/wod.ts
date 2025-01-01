export class WodModel{
  key = ""
  force:string[] = []
  wod:string[] = []
  date:number = new Date().getTime()
  title = ""
  note = ""
  constructor(args?:{}){
    this.loadFields(args);
  }
  loadFields(args?:any){
    console.log("load fields",args);
    Object.assign(this, args)
    if(args){
    this.wod = args["wod"]
    this.force = args["force"]
  console.log("this is thw wod",this)
  }
    return this
  }

  setKey(key:string){
    this.key = key
    return this;
  }

  serialize(){
    return{
      key: this.key,
      force: this.force,
      wod: this.wod,
      date: this.date,
      title: this.title,
      note: this.note
    }
  }
}
