export class WodModel{
  key = ""
  force:string[] = []
  exercises:string[] = []
  date:number = new Date().getTime()
  title = ""
  note = ""
  constructor(args?:{}){
    this.loadFields(args);
  }
  loadFields(args?:{}){
    Object.assign(this, args)
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
      exercises: this.exercises,
      date: this.date,
      title: this.title,
      note: this.note
    }
  }
}
