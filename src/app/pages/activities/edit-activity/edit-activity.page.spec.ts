import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditActivityPage } from './edit-activity.page';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { UsersService } from 'src/app/services/users/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('EditActivityPage', () => {
  let component: EditActivityPage;
  let fixture: ComponentFixture<EditActivityPage>;
  let mockActivityService: any;
  let mockUsersService: any;

  beforeEach(async () => {
    mockActivityService = jasmine.createSpyObj('ActivityService', ['updateActivity', 'getActivityByKey']);
    mockActivityService.getActivityByKey.and.returnValue(Promise.resolve({}));
    
    mockUsersService = jasmine.createSpyObj('UsersService', ['getLoggedUser']);
    mockUsersService.getLoggedUser.and.returnValue(Promise.resolve({ key: 'test' }));

    await TestBed.configureTestingModule({
      imports: [EditActivityPage],
      providers: [
        { provide: ActivityService, useValue: mockActivityService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ activityKey: '123' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditActivityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
