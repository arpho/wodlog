import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateActivityPage } from './create-activity.page';
import { UsersService } from 'src/app/services/users/users.service';
import { Auth } from '@angular/fire/auth';
import { ModalController } from '@ionic/angular/standalone';

describe('CreateActivityPage', () => {
  let component: CreateActivityPage;
  let fixture: ComponentFixture<CreateActivityPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: UsersService, useValue: { getLoggedUser: () => {} } },
        { provide: Auth, useValue: {} },
        { provide: ModalController, useValue: { create: () => ({ present: () => {}, onDidDismiss: () => ({ data: null }) }), dismiss: () => {} } }
      ]
    });
    fixture = TestBed.createComponent(CreateActivityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
