import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateWodPage } from './create-wod.page';
import { Router } from '@angular/router';
import { WodService } from 'src/app/services/wod/wod.service';
import { UsersService } from 'src/app/services/users/users.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { ModalController, provideIonicAngular } from '@ionic/angular/standalone';
import { Functions } from '@angular/fire/functions';
import { signal } from '@angular/core';

describe('CreateWodPage', () => {
  let component: CreateWodPage;
  let fixture: ComponentFixture<CreateWodPage>;
  let mockWodService: any;
  let mockUsersService: any;
  let mockThemeService: any;
  let mockModalCtrl: any;
  let mockFunctions: any;

  beforeEach(async () => {
    mockWodService = jasmine.createSpyObj('WodService', ['create']);
    mockUsersService = jasmine.createSpyObj('UsersService', ['getLoggedUser']);
    mockUsersService.getLoggedUser.and.returnValue(Promise.resolve({ key: 'test' }));

    mockThemeService = jasmine.createSpyObj('ThemeService', [], {
      currentTheme: signal('system')
    });

    mockModalCtrl = jasmine.createSpyObj('ModalController', ['create']);
    mockFunctions = jasmine.createSpyObj('Functions', ['']);

    await TestBed.configureTestingModule({
      imports: [CreateWodPage],
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: WodService, useValue: mockWodService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: ThemeService, useValue: mockThemeService },
        { provide: ModalController, useValue: mockModalCtrl },
        { provide: Functions, useValue: mockFunctions },
        provideIonicAngular()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateWodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
