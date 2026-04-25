import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListWodPage } from './list-wod.page';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { WodService } from 'src/app/services/wod/wod.service';
import { UsersService } from 'src/app/services/users/users.service';

describe('ListWodPage', () => {
  let component: ListWodPage;
  let fixture: ComponentFixture<ListWodPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListWodPage],
      providers: [
        provideRouter([]), 
        provideIonicAngular(),
        { provide: WodService, useValue: { fetchWodsRealtime: () => {} } },
        { provide: UsersService, useValue: { getLoggedUser: () => Promise.resolve(null) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListWodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
