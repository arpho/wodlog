import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PrGraphComponent } from './pr-graph.component';
import { Component, Input } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'p-chart',
  template: '',
  standalone: true
})
class MockChartComponent {
  @Input() type: string = '';
  @Input() data: any;
  @Input() options: any;
}

describe('PrGraphComponent', () => {
  let component: PrGraphComponent;
  let fixture: ComponentFixture<PrGraphComponent>;

  beforeEach(waitForAsync(async () => {
    TestBed.configureTestingModule({
      imports: [PrGraphComponent],
    });

    TestBed.overrideComponent(PrGraphComponent, {
      remove: { imports: [ChartModule] },
      add: { imports: [MockChartComponent] }
    });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(PrGraphComponent);
    component = fixture.componentInstance;
    component.prList = []; // Initialize required input
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
