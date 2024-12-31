import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WodFormComponent } from './wod-form.component';

describe('WodFormComponent', () => {
  let component: WodFormComponent;
  let fixture: ComponentFixture<WodFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [WodFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WodFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
