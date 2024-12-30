import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateWodPage } from './create-wod.page';

describe('CreateWodPage', () => {
  let component: CreateWodPage;
  let fixture: ComponentFixture<CreateWodPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
