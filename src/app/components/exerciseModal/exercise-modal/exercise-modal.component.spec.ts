import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ExerciseModalComponent } from './exercise-modal.component';
import { ModalController } from '@ionic/angular/standalone';

describe('ExerciseModalComponent', () => {
  let component: ExerciseModalComponent;
  let fixture: ComponentFixture<ExerciseModalComponent>;
  let mockModalCtrl: any;

  beforeEach(waitForAsync(() => {
    mockModalCtrl = jasmine.createSpyObj('ModalController', ['dismiss']);

    TestBed.configureTestingModule({
      imports: [ExerciseModalComponent],
      providers: [
        { provide: ModalController, useValue: mockModalCtrl }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
