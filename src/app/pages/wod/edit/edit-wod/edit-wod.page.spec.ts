import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditWodPage } from './edit-wod.page';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { WodService } from 'src/app/services/wod/wod.service';
import { UsersService } from 'src/app/services/users/users.service';
import { ResultsService } from 'src/app/services/results/results.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { ModalController, provideIonicAngular, NavController } from '@ionic/angular/standalone';
import { Functions } from '@angular/fire/functions';
import { signal } from '@angular/core';

describe('EditWodPage', () => {
  let component: EditWodPage;
  let fixture: ComponentFixture<EditWodPage>;
  let mockWodService: any;
  let mockUsersService: any;
  let mockResultsService: any;
  let mockThemeService: any;
  let mockModalCtrl: any;
  let mockFunctions: any;
  let mockNavCtrl: any;

  beforeEach(async () => {
    mockWodService = jasmine.createSpyObj('WodService', ['getWodByKey']);
    mockWodService.getWodByKey.and.returnValue(Promise.resolve({}));

    mockUsersService = jasmine.createSpyObj('UsersService', ['getLoggedUser']);
    mockUsersService.getLoggedUser.and.returnValue(Promise.resolve({ key: 'test' }));

    mockResultsService = jasmine.createSpyObj('ResultsService', ['fetchResultByWodKey']);
    
    mockThemeService = jasmine.createSpyObj('ThemeService', [], {
      currentTheme: signal('system')
    });

    mockModalCtrl = jasmine.createSpyObj('ModalController', ['create']);
    mockFunctions = jasmine.createSpyObj('Functions', ['']);
    mockNavCtrl = jasmine.createSpyObj('NavController', ['navigateBack', 'navigateForward']);

    await TestBed.configureTestingModule({
      imports: [EditWodPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ wodKey: '123' })
          }
        },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: WodService, useValue: mockWodService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: ResultsService, useValue: mockResultsService },
        { provide: ThemeService, useValue: mockThemeService },
        { provide: ModalController, useValue: mockModalCtrl },
        { provide: Functions, useValue: mockFunctions },
        { provide: NavController, useValue: mockNavCtrl },
        provideIonicAngular()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditWodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
