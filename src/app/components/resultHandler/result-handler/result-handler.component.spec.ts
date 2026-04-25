import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ResultHandlerComponent } from './result-handler.component';
<<<<<<< HEAD
import { UsersService } from 'src/app/services/users/users.service';
import { ResultsService } from 'src/app/services/results/results.service';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
=======
import { Auth } from '@angular/fire/auth';
import { UsersService } from 'src/app/services/users/users.service';
import { ActivatedRoute } from '@angular/router';
>>>>>>> origin/reorder

describe('ResultHandlerComponent', () => {
  let component: ResultHandlerComponent;
  let fixture: ComponentFixture<ResultHandlerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), ResultHandlerComponent],
      providers: [
<<<<<<< HEAD
        provideRouter([]),
        provideIonicAngular(),
        { provide: UsersService, useValue: { getLoggedUser: () => Promise.resolve({ key: 'test' }) } },
        { provide: ResultsService, useValue: { getResult: () => Promise.resolve([]) } }
=======
        { provide: Auth, useValue: {} },
        { provide: UsersService, useValue: { getLoggedUser: () => Promise.resolve({key: '123'}) } },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} }, queryParams: { subscribe: (fn: any) => fn({}) }, params: { subscribe: (fn: any) => fn({}) } } }
>>>>>>> origin/reorder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
