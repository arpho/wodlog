import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrListPage } from './pr-list.page';
<<<<<<< HEAD
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
=======
import { Auth } from '@angular/fire/auth';
>>>>>>> origin/reorder
import { UsersService } from 'src/app/services/users/users.service';

describe('PrListPage', () => {
  let component: PrListPage;
  let fixture: ComponentFixture<PrListPage>;

<<<<<<< HEAD
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrListPage],
      providers: [
        provideRouter([]), 
        provideIonicAngular(),
        { provide: UsersService, useValue: { getLoggedUser: () => Promise.resolve(null) } }
      ]
    }).compileComponents();

=======
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Auth, useValue: {} },
        { provide: UsersService, useValue: { getLoggedUser: () => Promise.resolve({key: '123'}) } }
      ]
    });
>>>>>>> origin/reorder
    fixture = TestBed.createComponent(PrListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
