import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActivitiesListComponent } from './activities-list.component';

describe('ActivitiesListComponent', () => {
  let component: ActivitiesListComponent;
  let fixture: ComponentFixture<ActivitiesListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ActivitiesListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivitiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
