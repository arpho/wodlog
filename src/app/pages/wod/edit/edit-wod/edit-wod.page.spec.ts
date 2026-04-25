import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditWodPage } from './edit-wod.page';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { WodService } from 'src/app/services/wod/wod.service';
import { UsersService } from 'src/app/services/users/users.service';

describe('EditWodPage', () => {
  let component: EditWodPage;
  let fixture: ComponentFixture<EditWodPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditWodPage],
      providers: [
        provideRouter([]), 
        provideIonicAngular(),
        { provide: WodService, useValue: { getWodByKey: () => Promise.resolve(null) } },
        { provide: UsersService, useValue: { getLoggedUser: () => Promise.resolve(null) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditWodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
