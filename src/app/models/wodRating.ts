export class WodRatingModel {
  wodKey = '';
  userKey = '';
  rating = 0;
  date: number = new Date().getTime();

  constructor(args?: any) {
    if (args) {
      Object.assign(this, args);
    }
  }

  serialize() {
    return {
      wodKey: this.wodKey,
      userKey: this.userKey,
      rating: this.rating,
      date: this.date
    };
  }
}
