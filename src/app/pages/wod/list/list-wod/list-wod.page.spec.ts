import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListWodPage } from './list-wod.page';
<<<<<<< HEAD
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { WodService } from 'src/app/services/wod/wod.service';
import { UsersService } from 'src/app/services/users/users.service';
=======
import { Auth } from '@angular/fire/auth';
import { UsersService } from 'src/app/services/users/users.service';
import { WodService } from 'src/app/services/wod/wod.service';
>>>>>>> origin/reorder

describe('ListWodPage', () => {
  let component: ListWodPage;
  let fixture: ComponentFixture<ListWodPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListWodPage],
      providers: [
<<<<<<< HEAD
        provideRouter([]), 
        provideIonicAngular(),
        { provide: WodService, useValue: { fetchWodsRealtime: () => {} } },
        { provide: UsersService, useValue: { getLoggedUser: () => Promise.resolve(null) } }
=======
        { provide: Auth, useValue: {} },
        { provide: UsersService, useValue: { getLoggedUser: () => Promise.resolve({ name: 'Test User', key: 'test-key' }) } },
        { provide: WodService, useValue: { fetchWodsRealtime: () => {} } }
>>>>>>> origin/reorder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListWodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
