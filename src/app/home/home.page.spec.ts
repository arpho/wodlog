import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { UsersService } from '../services/users/users.service';
import { ActivityService } from '../services/activity/activity.service';
import { ThemeService } from '../services/theme/theme.service';
import { Router } from '@angular/router';
import { signal } from '@angular/core';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let mockUsersService: any;
  let mockActivityService: any;
  let mockThemeService: any;

  beforeEach(async () => {
    mockUsersService = jasmine.createSpyObj('UsersService', ['getLoggedUser']);
    mockUsersService.getLoggedUser.and.returnValue(Promise.resolve({ key: 'test', firstName: 'Test', lastName: 'User' }));

    mockActivityService = jasmine.createSpyObj('ActivityService', ['realtimeFetchAllActivities']);
    
    mockThemeService = jasmine.createSpyObj('ThemeService', [], {
      currentTheme: signal('system')
    });

    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: ActivityService, useValue: mockActivityService },
        { provide: ThemeService, useValue: mockThemeService },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
