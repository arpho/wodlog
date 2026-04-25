import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateActivityPage } from './create-activity.page';
<<<<<<< HEAD
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { UsersService } from 'src/app/services/users/users.service';
=======
import { UsersService } from 'src/app/services/users/users.service';
import { Auth } from '@angular/fire/auth';
import { ModalController } from '@ionic/angular/standalone';
>>>>>>> origin/reorder

describe('CreateActivityPage', () => {
  let component: CreateActivityPage;
  let fixture: ComponentFixture<CreateActivityPage>;

<<<<<<< HEAD
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

=======
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: UsersService, useValue: { getLoggedUser: () => {} } },
        { provide: Auth, useValue: {} },
        { provide: ModalController, useValue: { create: () => ({ present: () => {}, onDidDismiss: () => ({ data: null }) }), dismiss: () => {} } }
      ]
    });
>>>>>>> origin/reorder
    fixture = TestBed.createComponent(CreateActivityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
