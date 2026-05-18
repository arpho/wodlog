import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivitiesListComponent } from './activities-list.component';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { UsersService } from 'src/app/services/users/users.service';
import { Router } from '@angular/router';

describe('ActivitiesListComponent', () => {
  let component: ActivitiesListComponent;
  let fixture: ComponentFixture<ActivitiesListComponent>;
  let mockActivityService: any;
  let mockUsersService: any;

  beforeEach(waitForAsync(() => {
    mockActivityService = jasmine.createSpyObj('ActivityService', ['realtimeFetchAllActivities']);
    
    mockUsersService = jasmine.createSpyObj('UsersService', ['getLoggedUser']);
    mockUsersService.getLoggedUser.and.returnValue(Promise.resolve({ key: 'test' }));

    TestBed.configureTestingModule({
      imports: [ActivitiesListComponent],
      providers: [
        { provide: ActivityService, useValue: mockActivityService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivitiesListComponent);
    component = fixture.componentInstance;
    component.userKey = 'test';
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
