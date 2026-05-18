import { TestBed } from '@angular/core/testing';
import { WodService } from './wod.service';

describe('WodService', () => {
  let service: WodService;
  let mockWodService: any;

  beforeEach(() => {
    mockWodService = jasmine.createSpyObj('WodService', ['fetchWodsRealtime', 'createWod', 'getWodByKey']);

    TestBed.configureTestingModule({
      providers: [
        { provide: WodService, useValue: mockWodService }
      ]
    });
    service = TestBed.inject(WodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
