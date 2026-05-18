import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangelogPage } from './changelog.page';
import { UsersService } from 'src/app/services/users/users.service';
import { Router } from '@angular/router';

describe('ChangelogPage', () => {
  let component: ChangelogPage;
  let fixture: ComponentFixture<ChangelogPage>;
  let mockUsersService: any;

  beforeEach(async () => {
    mockUsersService = jasmine.createSpyObj('UsersService', ['getLoggedUser']);
    mockUsersService.getLoggedUser.and.returnValue(Promise.resolve({}));

    await TestBed.configureTestingModule({
      imports: [ChangelogPage],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangelogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
