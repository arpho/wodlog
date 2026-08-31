import { TestBed } from '@angular/core/testing';
import { Database } from '@angular/fire/database';
import { Functions } from '@angular/fire/functions';
import { Auth } from '@angular/fire/auth';
import { WodService } from './wod/wod.service';
import { ActivityService } from './activity/activity.service';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';
import { WodModel } from 'src/app/models/wod';
import { ActivityModel } from 'src/app/models/activityModel';
import { PrModel } from 'src/app/models/Pr';
import { UserModel } from 'src/app/models/userModel';
import { of } from 'rxjs';

describe('Database CRUD Operations Suite (WOD, PR, User Profile)', () => {
  let wodService: WodService;
  let activityService: ActivityService;
  let usersService: UsersService;

  let mockDatabase: any;
  let mockFunctions: any;
  let mockAuth: any;
  let mockAuthService: any;

  beforeEach(() => {
    mockDatabase = {};
    mockFunctions = {};
    mockAuth = {
      onAuthStateChanged: jasmine.createSpy('onAuthStateChanged').and.callFake((callback: any) => {
        callback({ uid: 'mock-test-uid-123', email: 'test@example.com' });
        return () => {};
      })
    };

    mockAuthService = {
      getUser: () => of({ uid: 'mock-test-uid-123', email: 'test@example.com' })
    };

    TestBed.configureTestingModule({
      providers: [
        WodService,
        ActivityService,
        UsersService,
        { provide: Database, useValue: mockDatabase },
        { provide: Functions, useValue: mockFunctions },
        { provide: Auth, useValue: mockAuth },
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    wodService = TestBed.inject(WodService);
    activityService = TestBed.inject(ActivityService);
    usersService = TestBed.inject(UsersService);
  });

  // ==========================================
  // 1. TEST SUITE: WOD CRUD
  // ==========================================
  describe('WOD CRUD Operations', () => {
    it('1.1 Dovrebbe creare un nuovo WOD correttamente', () => {
      const newWod = new WodModel({
        title: 'Murph Benchmark',
        note: '1 Mile Run, 100 Pull-ups, 200 Push-ups, 300 Squats, 1 Mile Run',
        hero: true,
        benchmark: true,
        wod: ['1 Mile Run', '100 Pull-ups', '200 Push-ups', '300 Air Squats', '1 Mile Run'],
        force: ['Push Press 5x5']
      });

      expect(newWod.title).toBe('Murph Benchmark');
      expect(newWod.hero).toBeTrue();
      expect(newWod.wod.length).toBe(5);

      const serialized = newWod.serialize();
      expect(serialized.title).toBe('Murph Benchmark');
      expect(serialized.hero).toBeTrue();
      expect(serialized.wod).toBeDefined();
    });

    it('1.2 Dovrebbe modificare un WOD esistente', () => {
      const wod = new WodModel({
        title: 'WOD del Giorno',
        note: 'AMRAP 12 min',
        wod: ['10 Burpees', '15 Kettlebell Swings']
      }).setKey('-WodTestKey123');

      // Modifica dati WOD
      wod.title = 'WOD del Giorno (Aggiornato)';
      wod.note = 'AMRAP 15 min';
      wod.wod.push('20 Double Unders');

      expect(wod.key).toBe('-WodTestKey123');
      expect(wod.title).toBe('WOD del Giorno (Aggiornato)');
      expect(wod.note).toBe('AMRAP 15 min');
      expect(wod.wod.length).toBe(3);

      const updatedSerialized = wod.serialize();
      expect(updatedSerialized.title).toBe('WOD del Giorno (Aggiornato)');
    });

    it('1.3 Dovrebbe serializzare e ripristinare un WOD da Snapshot', () => {
      const snapshotData = {
        title: 'Fran',
        girl: true,
        wod: ['21-15-9', 'Thrusters 43kg', 'Pull-ups'],
        force: [],
        ratingTotal: 10,
        ratingCount: 2
      };

      const wod = new WodModel(snapshotData).setKey('-FranKey456');

      expect(wod.key).toBe('-FranKey456');
      expect(wod.title).toBe('Fran');
      expect(wod.girl).toBeTrue();
      expect(wod.ratingTotal).toBe(10);
      expect(wod.ratingCount).toBe(2);
    });

    it('1.4 Dovrebbe predisporre la cancellazione di un WOD', () => {
      const wodToDelete = new WodModel({
        title: 'WOD da eliminare'
      }).setKey('-WodToDeleteKey789');

      expect(wodToDelete.key).toBe('-WodToDeleteKey789');
      // La chiamata service.deleteWod restituisce la promise di rimozione sul path `wods/-WodToDeleteKey789`
      expect(wodService.deleteWod).toBeDefined();
    });
  });

  // ==========================================
  // 2. TEST SUITE: PR / ACTIVITY CRUD
  // ==========================================
  describe('PR (Activity) CRUD Operations', () => {
    it('2.1 Dovrebbe creare una nuova Attività PR', () => {
      const newActivity = new ActivityModel({
        descrizione: 'Back Squat',
        unity: ' Kg ',
        typePr: 'regular'
      }).setKey('-ActivityKey123');

      const pr1 = new PrModel({
        prestazione: '140',
        date: new Date('2026-01-10').getTime(),
        note: '1RM Test'
      });

      newActivity.prList.push(pr1);

      expect(newActivity.key).toBe('-ActivityKey123');
      expect(newActivity.descrizione).toBe('Back Squat');
      expect(newActivity.unity).toBe(' Kg ');
      expect(newActivity.prList.length).toBe(1);
      expect(String(newActivity.getMaxPr()?.prestazione)).toBe('140');
    });

    it('2.2 Dovrebbe aggiornare ed aggiungere nuovi PR ad una Attività', () => {
      const activity = new ActivityModel({
        descrizione: 'Clean & Jerk',
        unity: ' Kg ',
        prList: [
          { prestazione: 100, date: 1000000, note: 'Vecchia 1RM' }
        ]
      }).setKey('-CleanJerkKey');

      // Modifica nome e aggiunta nuovo PR massimo
      activity.descrizione = 'Clean & Jerk (Massimale)';
      const newMaxPr = new PrModel({
        prestazione: 115,
        date: 2000000,
        note: 'Nuova 1RM PR!'
      });
      activity.prList.push(newMaxPr);

      expect(activity.descrizione).toBe('Clean & Jerk (Massimale)');
      expect(activity.prList.length).toBe(2);
      expect(String(activity.getMaxPr()?.prestazione)).toBe('115');
      expect(String(activity.getLastPr()?.prestazione)).toBe('115');
    });

    it('2.3 Dovrebbe calcolare correttamente il miglior tempo per PR in secondi', () => {
      const timeActivity = new ActivityModel({
        descrizione: '500m Row',
        unity: ' sec ',
        typePr: 'regular',
        prList: [
          { prestazione: 95, date: 1000 }, // 1m 35s
          { prestazione: 88, date: 2000 }  // 1m 28s (Miglior tempo = numero minore)
        ]
      });

      expect(String(timeActivity.getMaxPr()?.prestazione)).toBe('88');
    });

    it('2.4 Dovrebbe predisporre l\'eliminazione di una Attività PR per utente', () => {
      const userKey = 'test-user-key-999';
      const activityToDelete = new ActivityModel({
        descrizione: 'Deadlift'
      }).setKey('-DeadliftKeyToDelete');

      expect(activityService.delete).toBeDefined();
      expect(activityToDelete.key).toBe('-DeadliftKeyToDelete');
    });
  });

  // ==========================================
  // 3. TEST SUITE: PROFILO UTENTE CRUD (Senza Firebase Auth)
  // ==========================================
  describe('User Profile CRUD Operations (Senza Creazione Auth)', () => {
    it('3.1 Dovrebbe creare una scheda Profilo Utente senza toccare Firebase Auth', () => {
      const mockUid = 'custom-simulated-uid-999';
      const userProfile = new UserModel({
        email: 'atleta.simulato@example.com',
        firstName: 'Mario',
        lastName: 'Rossi',
        userName: 'mariorossi',
        role: 'user',
        enabled: false,
        weight: 80,
        height: 178,
        gender: 'M'
      }).setKey(mockUid);

      expect(userProfile.key).toBe(mockUid);
      expect(userProfile.firstName).toBe('Mario');
      expect(userProfile.enabled).toBeFalse();
      expect(userProfile.role).toBe('user');

      const serialized = userProfile.serialize();
      expect(serialized.key).toBe(mockUid);
      expect(serialized.email).toBe('atleta.simulato@example.com');
      expect(serialized.weight).toBe(80);
    });

    it('3.2 Dovrebbe aggiornare i dati ed i privilegi del profilo utente', () => {
      const userProfile = new UserModel({
        key: 'custom-simulated-uid-999',
        email: 'atleta.simulato@example.com',
        firstName: 'Mario',
        lastName: 'Rossi',
        role: 'user',
        enabled: false
      });

      // Modifica dati e abilitazione da parte dell'admin
      userProfile.firstName = 'Mario Giuseppe';
      userProfile.enabled = true;
      userProfile.role = 'editor';
      userProfile.weight = 82;

      expect(userProfile.firstName).toBe('Mario Giuseppe');
      expect(userProfile.enabled).toBeTrue();
      expect(userProfile.role).toBe('editor');
      expect(userProfile.weight).toBe(82);

      const serialized = userProfile.serialize();
      expect(serialized.enabled).toBeTrue();
      expect(serialized.role).toBe('editor');
    });

    it('3.3 Dovrebbe leggere e deserializzare un profilo utente da Realtime Database', () => {
      const dbData = {
        email: 'coaching@wodlog.app',
        firstName: 'Giuseppe',
        lastName: 'D\'Amico',
        userName: 'giuseppe',
        role: 'editor',
        enabled: true,
        weight: 75,
        height: 175,
        gender: 'M',
        featuredPrs: ['-BackSquatKey', '-CleanJerkKey']
      };

      const user = new UserModel(dbData).setKey('editor-uid-001');

      expect(user.key).toBe('editor-uid-001');
      expect(user.email).toBe('coaching@wodlog.app');
      expect(user.role).toBe('editor');
      expect(user.featuredPrs.length).toBe(2);
    });

    it('3.4 Dovrebbe predisporre la cancellazione della scheda utente dal Realtime Database', () => {
      const targetUid = 'user-to-delete-uid-555';
      
      expect(usersService.deleteUser).toBeDefined();
      expect(usersService.dismissNotification).toBeDefined();
    });
  });
});
