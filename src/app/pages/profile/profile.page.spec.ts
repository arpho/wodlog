import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePage } from './profile.page';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { UsersService } from 'src/app/services/users/users.service';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { Storage } from '@angular/fire/storage';
import { of } from 'rxjs';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        provideRouter([]), 
        provideIonicAngular(),
        { provide: Storage, useValue: {} },
        { provide: UsersService, useValue: { getLoggedUser: () => Promise.resolve(null) } },
        { provide: ActivityService, useValue: { realtimeFetchAllActivities: () => {} } }
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
