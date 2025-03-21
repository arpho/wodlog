import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PrGraphComponent } from './pr-graph.component';

describe('PrGraphComponent', () => {
  let component: PrGraphComponent;
  let fixture: ComponentFixture<PrGraphComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PrGraphComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
