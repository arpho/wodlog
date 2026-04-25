import { IonFab, IonToggle, } from '@ionic/angular/standalone';
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
  DatetimeChangeEventDetail,
  IonDatetime,
  IonInput,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  ModalController,
  IonItem, IonFabButton
} from '@ionic/angular/standalone';
import {
  InputChangeEventDetail,
  IonDatetimeCustomEvent,
  IonInputCustomEvent,
  IonToggleCustomEvent,
  ToggleChangeEventDetail,
} from '@ionic/core';
import { addIcons } from 'ionicons';
import { saveOutline, add, checkmarkOutline, addCircleOutline, checkmarkDoneOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { ExerciseModalComponent } from '../../../../components/exerciseModal/exercise-modal/exercise-modal.component';

@Component({
  selector: 'app-wod-form',
  templateUrl: './wod-form.component.html',
  styleUrls: ['./wod-form.component.scss'],
  standalone: true,
  imports: [IonToggle, IonFabButton,
    IonItem,
    IonList,
    IonCol,
    IonRow,
    IonGrid,
    IonIcon,
    IonIcon,
    IonButton,
    IonInput,
    CommonModule,
    IonDatetime,
    IonFab
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WodFormComponent implements OnInit, OnChanges {
  test = false
  updateHero(event: any) {
    console.log("hero", event.detail.checked);
    this.hero.set(event.detail.checked)
  }
  updateGirl(event: any) {
    console.log("girl", event.detail.checked);
    this.girl.set(event.detail.checked)
  }


  updateBenchmark(event: any) {
    console.log("benchmark", event.detail.checked);
    this.benchmark.set(event.detail.checked)
  }
  async addActivity() {
    console.log("adding activity")
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
      console.log("updated wodset", this.wod());
    }
  }
  async addForce() {
    console.log("adding force")
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
      console.log("updated forceset", this.force());
    }
  }
  index: any;
  constructor(
    private modalCtrl: ModalController
  ) {
    addIcons({ add, checkmarkOutline, saveOutline, addCircleOutline, checkmarkDoneOutline });
  }
  async editWod(_t38: string, index: number) {
    console.log("editing", _t38)
    const modal = await this.modalCtrl.create({
      component: ExerciseModalComponent,
      componentProps: {
        title: 'Modifica attività',
        exerciseName: _t38,
        isEditing: true
      }
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'save' && data) {
      const wodSet = this.wod() || [];
      wodSet[index] = data;
      this.wod.set([...wodSet]);
      console.log("updated wodset", this.wod());
    } else if (role === 'remove') {
      const wodSet = this.wod() || [];
      wodSet.splice(index, 1);
      this.wod.set([...wodSet]);
      console.log("remove index", index);
    }
  }
  async editForce(_t38: string, index: number) {
    console.log("editing", _t38)
    const modal = await this.modalCtrl.create({
      component: ExerciseModalComponent,
      componentProps: {
        title: 'Modifica forza',
        exerciseName: _t38,
        isEditing: true
      }
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'save' && data) {
      const forceSet = this.force() || [];
      forceSet[index] = data;
      this.force.set([...forceSet]);
      console.log("updated forceset", this.force());
    } else if (role === 'remove') {
      const forceSet = this.force() || [];
      forceSet.splice(index, 1);
      this.force.set([...forceSet]);
      console.log("remove index", index);
    }
  }
  wod2Input = signal('');
  updateWod($event: IonInputCustomEvent<InputChangeEventDetail>) {
    const exercises = this.wod() || [];
    this.wod2Input.set('');
    exercises.push(String($event.detail.value));
    this.wod.set(exercises);
    console.log('wod', $event.detail.value);
  }
  force2Input = '';
  updateForce($event: IonInputCustomEvent<InputChangeEventDetail>) {
    const forza = this.force() || [];
    this.force2Input = '';
    forza.push(String($event.detail.value));
    this.force.set(forza);
    console.log('force', this.force());
  }
  @Output() submitWod = new EventEmitter<WodModel>();
  @Input({ required: true }) Wod = new WodModel();
  date = signal(new Date());
  wod = signal<string[]>([]);
  force = signal<string[]>([]);
  title = signal('');
  note = signal('');
  hero = signal(false);
  girl = signal(false);
  benchmark = signal(false);


  ngOnChanges(changes: SimpleChanges): void {

    this.date.set(new Date(this.Wod.date));
    this.title.set(this.Wod.title);
    this.note.set(this.Wod.note);
    this.force.set(this.Wod.force);
    this.wod.set(this.Wod.wod);
    this.force.set(this.Wod.force);
    this.hero.set(this.Wod.hero);
    this.girl.set(this.Wod.girl);
    this.benchmark.set(this.Wod.benchmark);
  }
  submit() {
    this.Wod = new WodModel({
      date: this.date().getTime(),
      key: this.Wod.key,
      title: this.title(),
      note: this.note(),
      force: this.force(),
      wod: this.wod(),
      girl: this.girl(),
      hero: this.hero(),
      benchmark: this.benchmark()
    });
    this.submitWod.emit(this.Wod);
  }
  updateNote($event: IonInputCustomEvent<InputChangeEventDetail>) {
    console.log('note', $event.detail.value);
    this.note.set(String($event.detail.value));
  }
  updateName($event: IonInputCustomEvent<InputChangeEventDetail>) {
    console.log('name', $event.detail.value);
    this.title.set(String($event.detail.value));
  }
  updateDate($event: IonDatetimeCustomEvent<DatetimeChangeEventDetail>) {
    console.log('date', $event);
    this.date.set(new Date(String($event.detail.value)));
  }

  ngOnInit() {
    this.date.set(new Date(this.Wod.date));
    this.title.set(this.Wod.title);
    this.note.set(this.Wod.note);
    this.force.set(this.Wod.force);
    this.wod.set(this.Wod.wod || []);
    this.force.set(this.Wod.force || []);
    this.wod.set(this.Wod.wod);
    this.hero.set(this.Wod.hero);
    this.girl.set(this.Wod.girl);
    this.benchmark.set(this.Wod.benchmark);
  }
  formatDate4Picker() {
    return this.date().toISOString().split('T')[0];
  }
}
