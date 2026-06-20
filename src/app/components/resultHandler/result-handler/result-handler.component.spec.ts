import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ResultHandlerComponent } from './result-handler.component';
import { ResultsService } from 'src/app/services/results/results.service';
import { UsersService } from 'src/app/services/users/users.service';
import { AlertController, ToastController, ModalController } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('ResultHandlerComponent', () => {
  let component: ResultHandlerComponent;
  let fixture: ComponentFixture<ResultHandlerComponent>;
  let mockResultsService: any;
  let mockUsersService: any;

  beforeEach(waitForAsync(() => {
    mockResultsService = jasmine.createSpyObj('ResultsService', ['fetchResultByWodKey', 'getResult']);
    mockResultsService.getResult.and.returnValue(Promise.resolve([]));
    
    mockUsersService = jasmine.createSpyObj('UsersService', ['getLoggedUser']);
    mockUsersService.getLoggedUser.and.returnValue(Promise.resolve({ key: 'test' }));

    TestBed.configureTestingModule({
      imports: [ ResultHandlerComponent ],
      providers: [
        { provide: ResultsService, useValue: mockResultsService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: AlertController, useValue: jasmine.createSpyObj('AlertController', ['create']) },
        { provide: ToastController, useValue: jasmine.createSpyObj('ToastController', ['create']) },
        { provide: ModalController, useValue: jasmine.createSpyObj('ModalController', ['create']) },
        { provide: Router, useValue: { navigateByUrl: jasmine.createSpy('navigateByUrl') } },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({})
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultHandlerComponent);
    component = fixture.componentInstance;
    component.userKey = 'test';
    component.wodKey = 'wod';
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
