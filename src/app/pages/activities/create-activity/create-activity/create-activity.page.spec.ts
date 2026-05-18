import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateActivityPage } from './create-activity.page';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { UsersService } from 'src/app/services/users/users.service';
import { Router } from '@angular/router';

describe('CreateActivityPage', () => {
  let component: CreateActivityPage;
  let fixture: ComponentFixture<CreateActivityPage>;
  let mockActivityService: any;
  let mockUsersService: any;

  beforeEach(async () => {
    mockActivityService = jasmine.createSpyObj('ActivityService', ['createActivity']);
    mockUsersService = jasmine.createSpyObj('UsersService', ['getLoggedUser']);
    mockUsersService.getLoggedUser.and.returnValue(Promise.resolve({ key: 'test' }));

    await TestBed.configureTestingModule({
      imports: [CreateActivityPage],
      providers: [
        { provide: ActivityService, useValue: mockActivityService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateActivityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
