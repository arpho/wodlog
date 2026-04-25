import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateWodPage } from './create-wod.page';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { WodService } from 'src/app/services/wod/wod.service';

describe('CreateWodPage', () => {
  let component: CreateWodPage;
  let fixture: ComponentFixture<CreateWodPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateWodPage],
      providers: [
        provideRouter([]), 
        provideIonicAngular(),
        { provide: WodService, useValue: { createWod: () => Promise.resolve('') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateWodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
