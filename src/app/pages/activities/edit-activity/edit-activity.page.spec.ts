import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditActivityPage } from './edit-activity.page';
<<<<<<< HEAD
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { UsersService } from 'src/app/services/users/users.service';
=======
import { ActivatedRoute } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { UsersService } from 'src/app/services/users/users.service';
import { ModalController } from '@ionic/angular/standalone';
>>>>>>> origin/reorder

describe('EditActivityPage', () => {
  let component: EditActivityPage;
  let fixture: ComponentFixture<EditActivityPage>;

<<<<<<< HEAD
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditActivityPage],
      providers: [
        provideRouter([]), 
        provideIonicAngular(),
        { provide: ActivityService, useValue: { realtimeFetchAllActivities: () => {} } },
        { provide: UsersService, useValue: { getLoggedUser: () => Promise.resolve(null) } }
      ]
    }).compileComponents();

=======
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} }, queryParams: { subscribe: (fn: any) => { fn({}); return { unsubscribe: () => {} }; } } } },
        { provide: Auth, useValue: {} },
        { provide: UsersService, useValue: { getLoggedUser: () => Promise.resolve({key: '123'}) } },
        { provide: ModalController, useValue: { create: () => ({ present: () => {}, onDidDismiss: () => ({ data: null }) }), dismiss: () => {} } }
      ]
    });
>>>>>>> origin/reorder
    fixture = TestBed.createComponent(EditActivityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
