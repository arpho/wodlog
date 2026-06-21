import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListWodPage } from './list-wod.page';
import { Router } from '@angular/router';
import { WodService } from 'src/app/services/wod/wod.service';
import { UsersService } from 'src/app/services/users/users.service';
import { ResultsService } from 'src/app/services/results/results.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { signal } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';

describe('ListWodPage', () => {
  let component: ListWodPage;
  let fixture: ComponentFixture<ListWodPage>;
  let mockWodService: any;
  let mockUsersService: any;
  let mockResultsService: any;
  let mockThemeService: any;

  beforeEach(async () => {
    mockWodService = jasmine.createSpyObj('WodService', ['fetchWodsRealtime']);
    mockUsersService = jasmine.createSpyObj('UsersService', ['getLoggedUser']);
    mockUsersService.getLoggedUser.and.returnValue(Promise.resolve({ name: 'test' }));
    
    mockResultsService = jasmine.createSpyObj('ResultsService', ['fetchResultByWodKey']);
    
    mockThemeService = jasmine.createSpyObj('ThemeService', [], {
      currentTheme: signal('system')
    });

    await TestBed.configureTestingModule({
      imports: [ListWodPage],
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate'), navigateByUrl: jasmine.createSpy('navigateByUrl') } },
        { provide: WodService, useValue: mockWodService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: ResultsService, useValue: mockResultsService },
        { provide: ThemeService, useValue: mockThemeService },
        { provide: ModalController, useValue: jasmine.createSpyObj('ModalController', ['create']) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListWodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
