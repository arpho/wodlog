import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrListPage } from './pr-list.page';

describe('PrListPage', () => {
  let component: PrListPage;
  let fixture: ComponentFixture<PrListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PrListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
