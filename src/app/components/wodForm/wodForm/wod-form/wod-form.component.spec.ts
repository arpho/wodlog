import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WodFormComponent } from './wod-form.component';
import { ModalController } from '@ionic/angular/standalone';
import { Functions } from '@angular/fire/functions';
import { WodModel } from 'src/app/models/wod';

describe('WodFormComponent', () => {
  let component: WodFormComponent;
  let fixture: ComponentFixture<WodFormComponent>;
  let mockModalCtrl: any;
  let mockFunctions: any;

  beforeEach(waitForAsync(() => {
    mockModalCtrl = jasmine.createSpyObj('ModalController', ['create']);
    mockFunctions = jasmine.createSpyObj('Functions', ['']);

    TestBed.configureTestingModule({
      imports: [WodFormComponent],
      providers: [
        { provide: ModalController, useValue: mockModalCtrl },
        { provide: Functions, useValue: mockFunctions }
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
