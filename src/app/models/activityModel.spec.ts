import { TestBed } from '@angular/core/testing';
import { ActivityModel } from './activityModel';
import { PrModel } from './Pr';


describe('activityModel ', () => {


  beforeEach(() => {
    TestBed.configureTestingModule({});

  });

  it('should be created', () => {

    expect(new ActivityModel()).toBeTruthy();

    const test = new ActivityModel(
      {
        "date": "2019-04-23T22:00:00.000Z",
        "id": 0,
        "prestazione": 60,
        "stringifiedDate": "2019-04-24 ",
        "typePr": "regular",
        "unity": " kg ",
        "PrList": [
          {
            "date": "2019-04-23T22:00:00.000Z",
            "id": 0,
            "prestazione": 60,
            "stringifiedDate": "2019-04-24 "
        },
        {
          "date": "2019-04-23T22:00:00.000Z",
          "id": 1,
          "prestazione": 65,
          "stringifiedDate": "2019-04-25 "
      }
        ]
    })
    expect(test).toBeTruthy();
    expect(test.date).toEqual(new Date("2019-04-23T22:00:00.000Z").getTime());
    expect(test.PrList[0]).toBeTruthy();
    console.log("test.PrList[0]",test.PrList[0], typeof test.PrList[0]);
    expect( test.PrList[0]).toBeInstanceOf(PrModel);
    expect(test.PrList.length).toEqual(2);

});

it('should find the max pr',()=>{
  const test = new ActivityModel(
    {
      "date": "2019-04-23T22:00:00.000Z",
      "id": 0,
      "prestazione": 60,
      "stringifiedDate": "2019-04-24 ",
      "typePr": "regular",
      "unity": " kg ",
      "PrList": [
        {
          "date": "2019-04-23T22:00:00.000Z",
          "id": 0,
          "prestazione": 60,
          "stringifiedDate": "2019-04-24 "
      },
      {
        "date": "2019-04-23T22:00:00.000Z",
        "id": 1,
        "prestazione": 65,
        "stringifiedDate": "2019-04-25 "
    }
      ]
  })
  expect(test.getMaxPr()).toBeTruthy();
  expect(test.getMaxPr().prestazione).toEqual(65);
const test4sec = new ActivityModel(
  {
    "date": "2019-04-23T22:00:00.000Z",
    "id": 0,
    "prestazione": 60,
    "stringifiedDate": "2019-04-24 ",
    "typePr": "regular",
    "unity": " sec ",
    "PrList": [
      {
        "date": "2019-04-23T22:00:00.000Z",
        "id": 0,
        "prestazione": 60,
        "stringifiedDate": "2019-04-24 "
    },
    {
      "date": "2019-04-23T22:00:00.000Z",
      "id": 1,
      "prestazione": 65,
      "stringifiedDate": "2019-04-25 "
  }
    ]
})
expect(test4sec.getMaxPr()).toBeTruthy();
expect(test4sec.getMaxPr().prestazione).toEqual(60);


})

});
