import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePage } from './profile.page';
import { UsersService } from 'src/app/services/users/users.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { signal } from '@angular/core';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;
  let mockUsersService: any;
  let mockThemeService: any;

  beforeEach(async () => {
    mockUsersService = jasmine.createSpyObj('UsersService', ['getLoggedUser', 'updateUser']);
    mockUsersService.getLoggedUser.and.returnValue(Promise.resolve({ key: 'test', firstName: 'Test', lastName: 'User' }));

    mockThemeService = jasmine.createSpyObj('ThemeService', [], {
      currentTheme: signal('system')
    });

    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: ThemeService, useValue: mockThemeService }
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
