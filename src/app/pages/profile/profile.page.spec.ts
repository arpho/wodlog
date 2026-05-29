import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePage } from './profile.page';
import { UsersService } from 'src/app/services/users/users.service';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { Storage } from '@angular/fire/storage';
import { signal } from '@angular/core';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;
  let mockUsersService: any;
  let mockActivityService: any;
  let mockThemeService: any;
  let mockStorage: any;

  beforeEach(async () => {
    mockUsersService = jasmine.createSpyObj('UsersService', ['getLoggedUser', 'updateUser']);
    mockUsersService.getLoggedUser.and.returnValue(Promise.resolve({ key: 'test', firstName: 'Test', lastName: 'User' }));

    mockActivityService = jasmine.createSpyObj('ActivityService', ['realtimeFetchAllActivities']);

    mockThemeService = jasmine.createSpyObj('ThemeService', [], {
      currentTheme: signal('system')
    });

    mockStorage = jasmine.createSpyObj('Storage', ['']);

    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: ActivityService, useValue: mockActivityService },
        { provide: ThemeService, useValue: mockThemeService },
        { provide: Storage, useValue: mockStorage }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
