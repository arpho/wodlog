import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditActivityPage } from './edit-activity.page';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { UsersService } from 'src/app/services/users/users.service';
import { ModalController } from '@ionic/angular/standalone';

describe('EditActivityPage', () => {
  let component: EditActivityPage;
  let fixture: ComponentFixture<EditActivityPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} }, queryParams: { subscribe: (fn: any) => { fn({}); return { unsubscribe: () => {} }; } } } },
        { provide: Auth, useValue: {} },
        { provide: UsersService, useValue: { getLoggedUser: () => Promise.resolve({key: '123'}) } },
        { provide: ModalController, useValue: { create: () => ({ present: () => {}, onDidDismiss: () => ({ data: null }) }), dismiss: () => {} } }
      ]
    });
    fixture = TestBed.createComponent(EditActivityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
