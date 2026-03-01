import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListWodPage } from './list-wod.page';
import { Auth } from '@angular/fire/auth';
import { UsersService } from 'src/app/services/users/users.service';

describe('ListWodPage', () => {
  let component: ListWodPage;
  let fixture: ComponentFixture<ListWodPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Auth, useValue: {} },
        { provide: UsersService, useValue: { getLoggedUser: () => {} } }
      ]
    });
    fixture = TestBed.createComponent(ListWodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
