import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrListPage } from './pr-list.page';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { UsersService } from 'src/app/services/users/users.service';

describe('PrListPage', () => {
  let component: PrListPage;
  let fixture: ComponentFixture<PrListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrListPage],
      providers: [
        provideRouter([]), 
        provideIonicAngular(),
        { provide: UsersService, useValue: { getLoggedUser: () => Promise.resolve(null) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PrListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
