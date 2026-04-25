import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateActivityPage } from './create-activity.page';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { UsersService } from 'src/app/services/users/users.service';

describe('CreateActivityPage', () => {
  let component: CreateActivityPage;
  let fixture: ComponentFixture<CreateActivityPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateActivityPage],
      providers: [
        provideRouter([]), 
        provideIonicAngular(),
        { provide: ActivityService, useValue: { createActivity: () => Promise.resolve('') } },
        { provide: UsersService, useValue: { getLoggedUser: () => Promise.resolve(null) } }
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
