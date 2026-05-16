import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserMenuComponent } from './user-menu.component';
import { UsersService } from 'src/app/services/users/users.service';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/userModel';
import { signal } from '@angular/core';

describe('UserMenuComponent', () => {
  let component: UserMenuComponent;
  let fixture: ComponentFixture<UserMenuComponent>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockUsersService = jasmine.createSpyObj('UsersService', ['getLoggedUser', 'logout']);
    mockUsersService.getLoggedUser.and.returnValue(Promise.resolve(new UserModel({ email: 'test@example.com' })));
    
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [UserMenuComponent],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to settings on openSettings', () => {
    component.openSettings();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/settings']);
  });
});
