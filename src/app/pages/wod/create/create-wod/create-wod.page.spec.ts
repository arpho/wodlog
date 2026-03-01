import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateWodPage } from './create-wod.page';
import { ModalController } from '@ionic/angular/standalone';

describe('CreateWodPage', () => {
  let component: CreateWodPage;
  let fixture: ComponentFixture<CreateWodPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ModalController, useValue: { create: () => ({ present: () => {}, onDidDismiss: () => ({ data: null }) }) } }
      ]
    });
    fixture = TestBed.createComponent(CreateWodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
