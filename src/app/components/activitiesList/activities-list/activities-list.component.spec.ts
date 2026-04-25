import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivitiesListComponent } from './activities-list.component';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { UsersService } from 'src/app/services/users/users.service';

describe('ActivitiesListComponent', () => {
  let component: ActivitiesListComponent;
  let fixture: ComponentFixture<ActivitiesListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ActivitiesListComponent],
      providers: [
        provideIonicAngular(),
        { 
          provide: ActivityService, 
          useValue: { 
            realtimeFetchAllActivities: () => {},
            fetchAllActivities: () => {} 
          } 
        },
        { 
          provide: UsersService, 
          useValue: { 
            getLoggedUser: () => Promise.resolve({ key: 'test-user' }) 
          } 
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivitiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
