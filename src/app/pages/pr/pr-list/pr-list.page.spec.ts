import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrListPage } from './pr-list.page';
import { Auth } from '@angular/fire/auth';
import { UsersService } from 'src/app/services/users/users.service';

describe('PrListPage', () => {
  let component: PrListPage;
  let fixture: ComponentFixture<PrListPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Auth, useValue: {} },
        { provide: UsersService, useValue: { getLoggedUser: () => Promise.resolve({key: '123'}) } }
      ]
    });
    fixture = TestBed.createComponent(PrListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
