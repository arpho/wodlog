import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActivitiesListComponent } from './activities-list.component';
import { Auth } from '@angular/fire/auth';
import { UsersService } from 'src/app/services/users/users.service';

describe('ActivitiesListComponent', () => {
  let component: ActivitiesListComponent;
  let fixture: ComponentFixture<ActivitiesListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ActivitiesListComponent],
      providers: [
        { provide: Auth, useValue: {} },
        { provide: UsersService, useValue: { getLoggedUser: () => Promise.resolve({key: '123'}) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivitiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
