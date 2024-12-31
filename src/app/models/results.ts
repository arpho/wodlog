export class ResultsModel {
  key=""
  wodKey="" ;
  date = new Date().getTime();
  result = "";
  note = "";
  userKey = "";
  constructor(arg?:{}) {
    this.loadFields(arg);
  }
  loadFields(arg: {} | undefined) {
 Object.assign(this, arg);
 return this;
  }

  setKey(key:string){
    this.key = key
    return this;
  }
  serialize(){
    return{
      key: this.key,
      wodKey: this.wodKey,
      date: this.date,
      result: this.result,
      note: this.note,
      userKey: this.userKey
    }
  }
}
