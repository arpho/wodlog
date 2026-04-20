import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditWodPage } from './edit-wod.page';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { UsersService } from 'src/app/services/users/users.service';
import { ModalController } from '@ionic/angular/standalone';

import { of } from 'rxjs';
import { WodService } from 'src/app/services/wod/wod.service';

describe('EditWodPage', () => {
  let component: EditWodPage;
  let fixture: ComponentFixture<EditWodPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditWodPage],
      providers: [
        { 
          provide: ActivatedRoute, 
          useValue: { 
            queryParams: of({ wodKey: 'test-key' }),
            snapshot: { params: {} } 
          } 
        },
        { provide: Auth, useValue: {} },
        { 
          provide: UsersService, 
          useValue: { 
            getLoggedUser: () => Promise.resolve({ name: 'Test User', key: 'user-key' }) 
          } 
        },
        { 
          provide: WodService, 
          useValue: { 
            getWodByKey: () => Promise.resolve({ title: 'Test WOD', key: 'test-key', date: Date.now() }) 
          } 
        },
        { provide: ModalController, useValue: { create: () => ({ present: () => {}, onDidDismiss: () => ({ data: null }) }), dismiss: () => {} } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditWodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
