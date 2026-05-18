import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HomeSquareComponent } from './home-square.component';
import { Router } from '@angular/router';

describe('HomeSquareComponent', () => {
  let component: HomeSquareComponent;
  let fixture: ComponentFixture<HomeSquareComponent>;
  let mockRouter: any;

  beforeEach(waitForAsync(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      imports: [ HomeSquareComponent ],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeSquareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
