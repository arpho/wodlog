import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditWodPage } from './edit-wod.page';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { UsersService } from 'src/app/services/users/users.service';
import { ModalController } from '@ionic/angular/standalone';

describe('EditWodPage', () => {
  let component: EditWodPage;
  let fixture: ComponentFixture<EditWodPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
        { provide: Auth, useValue: {} },
        { provide: UsersService, useValue: { getLoggedUser: () => {} } },
        { provide: ModalController, useValue: { create: () => ({ present: () => {}, onDidDismiss: () => ({ data: null }) }), dismiss: () => {} } }
      ]
    });
    fixture = TestBed.createComponent(EditWodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
