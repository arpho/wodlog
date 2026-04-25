import { 
  IonFab, 
  IonToggle, 
  IonButtons, 
  IonToolbar,
  IonDatetime,
  IonInput,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem, 
  IonFabButton,
  IonReorderGroup,
  IonReorder,
  IonLabel,
  ModalController
} from '@ionic/angular/standalone';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { WodModel } from 'src/app/models/wod';
import {
  InputChangeEventDetail,
  IonDatetimeCustomEvent,
  IonInputCustomEvent,
  IonToggleCustomEvent,
} from '@ionic/core';
import { addIcons } from 'ionicons';
import { saveOutline, add, checkmarkOutline, addCircleOutline, checkmarkDoneOutline, createOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { ExerciseModalComponent } from '../../../../components/exerciseModal/exercise-modal/exercise-modal.component';

@Component({
  selector: 'app-wod-form',
  templateUrl: './wod-form.component.html',
  styleUrls: ['./wod-form.component.scss'],
  standalone: true,
  imports: [
    IonToolbar, 
    IonButtons, 
    IonToggle, 
    IonFabButton,
    IonItem,
    IonList,
    IonCol,
    IonRow,
    IonGrid,
    IonIcon,
    IonButton,
    IonInput,
    IonLabel,
    CommonModule,
    IonDatetime,
    IonReorder,
    IonReorderGroup,
    IonFab
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WodFormComponent implements OnInit, OnChanges {
  test = false;

  updateHero(event: any) {
    this.hero.set(event.detail.checked);
  }

  updateGirl(event: any) {
    this.girl.set(event.detail.checked);
  }

  updateBenchmark(event: any) {
    this.benchmark.set(event.detail.checked);
  }

  updateOpen(event: any) {
    this.open.set(event.detail.checked);
  }

  updateQF(event: any) {
    this.QF.set(event.detail.checked);
  }

  handleForceReorder(event: any) {
    const force = this.force();
    const itemMoved = force.splice(event.detail.from, 1)[0];
    force.splice(event.detail.to, 0, itemMoved);
    event.detail.complete();
    this.force.set([...force]);
    this.emitChange();
  }

  handleReorder(event: any) {
    const wod = this.wod();
    const itemMoved = wod.splice(event.detail.from, 1)[0];
    wod.splice(event.detail.to, 0, itemMoved);
    event.detail.complete();
    this.wod.set([...wod]);
    this.emitChange();
  }

  private emitChange() {
    const wodObj = new WodModel({
      date: this.date().getTime(),
      key: this.Wod.key,
      title: this.title(),
      note: this.note(),
      force: this.force(),
      wod: this.wod(),
      open: this.open(),
      girl: this.girl(),
      hero: this.hero(),
      benchmark: this.benchmark(),
      QF: this.QF()
    });
    this.changedWod.emit(wodObj);
  }

  async addActivity() {
    const modal = await this.modalCtrl.create({
      component: ExerciseModalComponent,
      componentProps: {
        title: 'Aggiungi attività',
        exerciseName: '',
        isEditing: false
      }
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'save' && data) {
      const wodSet = this.wod() || [];
      wodSet.push(data);
      this.wod.set([...wodSet]);
      this.emitChange();
    }
  }

  async addForce() {
    const modal = await this.modalCtrl.create({
      component: ExerciseModalComponent,
      componentProps: {
        title: 'Aggiungi forza',
        exerciseName: '',
        isEditing: false
      }
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'save' && data) {
      const forceSet = this.force() || [];
      forceSet.push(data);
      this.force.set([...forceSet]);
      this.emitChange();
    }
  }

  constructor(private modalCtrl: ModalController) {
    addIcons({ 
      add, 
      checkmarkOutline, 
      saveOutline, 
      addCircleOutline, 
      checkmarkDoneOutline,
      createOutline 
    });
  }

  async editWod(name: string, index: number) {
    const modal = await this.modalCtrl.create({
      component: ExerciseModalComponent,
      componentProps: {
        title: 'Modifica attività',
        exerciseName: name,
        isEditing: true
      }
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    const wodSet = this.wod() || [];

    if (role === 'save' && data) {
      wodSet[index] = data;
      this.wod.set([...wodSet]);
      this.emitChange();
    } else if (role === 'remove') {
      wodSet.splice(index, 1);
      this.wod.set([...wodSet]);
      this.emitChange();
    }
  }

  async editForce(name: string, index: number) {
    const modal = await this.modalCtrl.create({
      component: ExerciseModalComponent,
      componentProps: {
        title: 'Modifica forza',
        exerciseName: name,
        isEditing: true
      }
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    const forceSet = this.force() || [];

    if (role === 'save' && data) {
      forceSet[index] = data;
      this.force.set([...forceSet]);
      this.emitChange();
    } else if (role === 'remove') {
      forceSet.splice(index, 1);
      this.force.set([...forceSet]);
      this.emitChange();
    }
  }

  @Output() submitWod = new EventEmitter<WodModel>();
  @Output() changedWod = new EventEmitter<WodModel>();
  @Input({ required: true }) Wod = new WodModel();
  
  date = signal(new Date());
  wod = signal<string[]>([]);
  force = signal<string[]>([]);
  title = signal('');
  note = signal('');
  hero = signal(false);
  girl = signal(false);
  open = signal(false);
  benchmark = signal(false);
  QF = signal(false);
  wod2Input = signal('');
  force2Input = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['Wod'] && this.Wod) {
      this.date.set(new Date(this.Wod.date));
      this.title.set(this.Wod.title || '');
      this.note.set(this.Wod.note || '');
      this.force.set(this.Wod.force || []);
      this.wod.set(this.Wod.wod || []);
      this.hero.set(this.Wod.hero || false);
      this.girl.set(this.Wod.girl || false);
      this.open.set(this.Wod.open || false);
      this.benchmark.set(this.Wod.benchmark || false);
      this.QF.set(this.Wod.QF || false);
    }
  }

  submit() {
    this.emitChange();
    this.submitWod.emit(this.Wod);
  }

  updateNote($event: any) {
    this.note.set(String($event.detail.value));
    this.emitChange();
  }

  updateName($event: any) {
    this.title.set(String($event.detail.value));
    this.emitChange();
  }

  updateDate($event: any) {
    this.date.set(new Date(String($event.detail.value)));
    this.emitChange();
  }

  updateWod($event: any) {
    const exercises = this.wod() || [];
    this.wod2Input.set('');
    exercises.push(String($event.detail.value));
    this.wod.set([...exercises]);
    this.emitChange();
  }

  updateForce($event: any) {
    const forza = this.force() || [];
    this.force2Input = '';
    forza.push(String($event.detail.value));
    this.force.set([...forza]);
    this.emitChange();
  }

  ngOnInit() {
    this.date.set(new Date(this.Wod.date));
    this.title.set(this.Wod.title || '');
    this.note.set(this.Wod.note || '');
    this.wod.set(this.Wod.wod || []);
    this.force.set(this.Wod.force || []);
    this.hero.set(this.Wod.hero || false);
    this.girl.set(this.Wod.girl || false);
    this.open.set(this.Wod.open || false);
    this.benchmark.set(this.Wod.benchmark || false);
    this.QF.set(this.Wod.QF || false);
  }

  formatDate4Picker() {
    return this.date().toISOString().split('T')[0];
  }
}
