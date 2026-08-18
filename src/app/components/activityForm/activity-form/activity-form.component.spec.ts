import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivityFormComponent } from './activity-form.component';
import { ActivityModel } from 'src/app/models/activityModel';
import { Router } from '@angular/router';

describe('ActivityFormComponent', () => {
  let component: ActivityFormComponent;
  let fixture: ComponentFixture<ActivityFormComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ActivityFormComponent],
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityFormComponent);
    component = fixture.componentInstance;
    component.activity = new ActivityModel();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
