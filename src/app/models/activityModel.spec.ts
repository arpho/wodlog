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
        "unity": " Kg ",
        "prList": [
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
    expect(test.prList[0]).toBeTruthy();
    console.log("test.prList[0]",test.prList[0], typeof test.prList[0]);
    expect( test.prList[0]).toBeInstanceOf(PrModel);
    expect(test.prList.length).toEqual(2);

});



it('should load data from server',()=>{

  const test = new ActivityModel(
    {
      "descrizione": "1 RM deadlift",
      "date": 1735142356681,
      "id": "-LQVtqlSj34v0scWMxlV",
      "girl": false,
      "hero": false,
      "typePr": "generic",
      "unity": " Kg ",
      "prList": [
          {
              "date": "2018-11-01T23:00:00.000Z",
              "id": 0,
              "prestazione": 140,
              "stringifiedDate": "2018-11-02 "
          },
          {
              "date": "2019-04-18T22:00:00.000Z",
              "id": 1,
              "prestazione": 150,
              "stringifiedDate": "2019-04-19 "
          },
          {
              "date": "2022-10-12T22:00:00.000Z",
              "id": 2,
              "prestazione": 152.5,
              "stringifiedDate": "2022-10-13 "
          },
          {
              "date": "2024-03-22T00:00:00.000Z",
              "id": 3,
              "note": "",
              "prestazione": "157.5",
              "stringifiedDate": "2024-03-22 "
          },
          {
              "date": "2024-07-20T00:00.000Z",
              "id": 4,
              "prestazione": 157.5,
              "stringifiedDate": "2024-07-20"
          }
      ]
  }

  )

  expect(test.prList.length).toEqual(5);
 expect(test.getMaxPr().prestazione).toEqual(157.5);
})


it('should find the max pr',()=>{
  const test = new ActivityModel(
    {
      "date": "2019-04-23T22:00:00.000Z",
      "id": 0,
      "prestazione": 60,
      "stringifiedDate": "2019-04-24 ",
      "typePr": "regular",
      "unity": " Kg ",
      "prList": [
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
    "prList": [
      {
        "date": "2019-04-24T22:00:00.000Z",
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
expect(test4sec.getMaxPr().date).toEqual(new Date("2019-04-24T22:00:00.000Z").getTime());

});
});
