import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PrListComponent } from './pr-list.component';

describe('PrListComponent', () => {
  let component: PrListComponent;
  let fixture: ComponentFixture<PrListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PrListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
