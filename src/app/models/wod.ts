export class WodModel {
  key = '';
  force: string[] = [];
  girl= false
  hero= false
  benchmark= false
  wod: string[] = [];
  date: number = new Date().getTime();
  title = '';
  note = '';
  ratingTotal = 0;
  ratingCount = 0;
  userKey = '';
  creatorName = '';
  constructor(args?: {}) {
    this.loadFields(args);
  }
  loadFields(args?: any) {
    Object.assign(this, args);
    if (args) {
      this.wod = args['wod'];
      this.force = args['force'];
    }
    return this;
  }

  setKey(key: string) {
    this.key = key;
    return this;
  }

  serialize() {
    const data: any = {
      key: this.key,
      date: this.date,
      title: this.title,
      note: this.note,
      hero: this.hero,
      girl: this.girl,
      benchmark: this.benchmark,
      ratingTotal: this.ratingTotal || 0,
      ratingCount: this.ratingCount || 0,
      userKey: this.userKey || '',
      creatorName: this.creatorName || ''
    };
    if (this.force && this.force.length > 0) {
      data.force = Object.assign({}, this.force);
    }
    if (this.wod && this.wod.length > 0) {
      data.wod = Object.assign({}, this.wod);
    }
    return data;
  }
}
