import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListWodPage } from './list-wod.page';

describe('ListWodPage', () => {
  let component: ListWodPage;
  let fixture: ComponentFixture<ListWodPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
