import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateActivityPage } from './create-activity.page';

describe('CreateActivityPage', () => {
  let component: CreateActivityPage;
  let fixture: ComponentFixture<CreateActivityPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateActivityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
