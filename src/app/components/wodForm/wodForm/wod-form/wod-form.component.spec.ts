import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WodFormComponent } from './wod-form.component';
import { ModalController, LoadingController, AlertController } from '@ionic/angular/standalone';
import { Functions } from '@angular/fire/functions';
import { WodModel } from 'src/app/models/wod';
import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'ion-icon',
  template: '',
  standalone: true
})
class MockIonIconComponent {
  @Input() name: string = '';
  @Input() src: string = '';
  @Input() color: string = '';
}

describe('WodFormComponent', () => {
  let component: WodFormComponent;
  let fixture: ComponentFixture<WodFormComponent>;
  let mockModalCtrl: any;
  let mockFunctions: any;
  let mockLoadingCtrl: any;
  let mockAlertCtrl: any;
  let mockLoadingElement: any;
  let mockAlertElement: any;

  beforeEach(waitForAsync(async () => {
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
    });

    TestBed.overrideComponent(WodFormComponent, {
      remove: { imports: [IonIcon] },
      add: { imports: [MockIonIconComponent] }
    });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(WodFormComponent);
    component = fixture.componentInstance;
    component.Wod = new WodModel();
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
