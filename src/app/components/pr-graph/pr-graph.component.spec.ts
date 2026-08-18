import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrGraphComponent } from './pr-graph.component';

describe('PrGraphComponent', () => {
  let component: PrGraphComponent;
  let fixture: ComponentFixture<PrGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrGraphComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrGraphComponent);
    component = fixture.componentInstance;
    component.prList = []; // Initialize required input
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
