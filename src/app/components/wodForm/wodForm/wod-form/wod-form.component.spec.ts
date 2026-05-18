import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WodFormComponent } from './wod-form.component';
import { ModalController, LoadingController, AlertController } from '@ionic/angular/standalone';
import { Functions } from '@angular/fire/functions';
import { WodModel } from 'src/app/models/wod';

describe('WodFormComponent', () => {
  let component: WodFormComponent;
  let fixture: ComponentFixture<WodFormComponent>;
  let mockModalCtrl: any;
  let mockFunctions: any;
  let mockLoadingCtrl: any;
  let mockAlertCtrl: any;
  let mockLoadingElement: any;
  let mockAlertElement: any;

  beforeEach(waitForAsync(() => {
    mockModalCtrl = jasmine.createSpyObj('ModalController', ['create']);
    mockFunctions = jasmine.createSpyObj('Functions', ['']);
    mockLoadingElement = jasmine.createSpyObj('LoadingElement', ['present', 'dismiss']);
    mockLoadingCtrl = jasmine.createSpyObj('LoadingController', {
      create: Promise.resolve(mockLoadingElement)
    });
    mockAlertElement = jasmine.createSpyObj('AlertElement', ['present']);
    mockAlertCtrl = jasmine.createSpyObj('AlertController', {
      create: Promise.resolve(mockAlertElement)
    });

    TestBed.configureTestingModule({
      imports: [WodFormComponent],
      providers: [
        { provide: ModalController, useValue: mockModalCtrl },
        { provide: Functions, useValue: mockFunctions },
        { provide: LoadingController, useValue: mockLoadingCtrl },
        { provide: AlertController, useValue: mockAlertCtrl }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WodFormComponent);
    component = fixture.componentInstance;
    component.Wod = new WodModel();
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
