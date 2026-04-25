import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActivityFormComponent } from './activity-form.component';
import { ModalController } from '@ionic/angular/standalone';

describe('ActivityFormComponent', () => {
  let component: ActivityFormComponent;
  let fixture: ComponentFixture<ActivityFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ActivityFormComponent],
      providers: [
        { provide: ModalController, useValue: { create: () => ({ present: () => {}, onDidDismiss: () => ({ data: null }) }), dismiss: () => {} } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
