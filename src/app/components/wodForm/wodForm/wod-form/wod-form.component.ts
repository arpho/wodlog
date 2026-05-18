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
  IonItem, IonFabButton,
  LoadingController,
  AlertController
} from '@ionic/angular/standalone';
import {
  InputChangeEventDetail,
  IonDatetimeCustomEvent,
  IonInputCustomEvent,
  IonToggleCustomEvent,
  ToggleChangeEventDetail,
} from '@ionic/core';
import { addIcons } from 'ionicons';
import { saveOutline, add, checkmarkOutline, camera } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { ExerciseModalComponent } from '../../../../components/exerciseModal/exercise-modal/exercise-modal.component';
import { inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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
  private functions = inject(Functions);
  
  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    addIcons({ add, checkmarkOutline, saveOutline, camera });
  }

  async scanForce() {
    let loading: any;
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt
      });

      if (image.base64String) {
        loading = await this.loadingCtrl.create({
          message: 'Analisi Forza in corso con Genkit...',
          spinner: 'crescent',
          translucent: true
        });
        await loading.present();

        const analyzeFunction = httpsCallable(this.functions, 'analyzeForceImage');
        console.log("Analisi Forza in corso...");
        const result = await analyzeFunction({
          imageBufferBase64: image.base64String,
          mimeType: `image/${image.format}`
        });

        const newForceLines = result.data as string[];
        const currentForce = this.force() || [];
        this.force.set([...currentForce, ...newForceLines]);
        console.log("Forza aggiornata:", this.force());

        await loading.dismiss();
        loading = null;

        const alertMessage = newForceLines.length > 0 
          ? `Esercizi di forza inseriti con successo:\n${newForceLines.map(item => `• ${item}`).join('\n')}`
          : 'Non è stato possibile identificare alcun esercizio di forza dall\'immagine.';
        
        const alert = await this.alertCtrl.create({
          header: 'Forza Rilevata!',
          message: alertMessage,
          buttons: ['Ottimo']
        });
        await alert.present();
      }
    } catch (error: any) {
      console.error("Errore durante la scansione della forza:", error);
      if (loading) {
        await loading.dismiss();
      }
      if (error?.message !== 'User cancelled photos app' && error !== 'User cancelled photos app') {
        const alert = await this.alertCtrl.create({
          header: 'Errore Scansione',
          message: 'Si è verificato un errore durante l\'analisi dell\'immagine della forza. Riprova.',
          buttons: ['Chiudi']
        });
        await alert.present();
      }
    }
  }

  async scanWod() {
    let loading: any;
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt
      });

      if (image.base64String) {
        loading = await this.loadingCtrl.create({
          message: 'Analisi WOD in corso con Genkit...',
          spinner: 'crescent',
          translucent: true
        });
        await loading.present();

        const analyzeFunction = httpsCallable(this.functions, 'analyzeWodImage');
        console.log("Analisi WOD in corso...");
        const result = await analyzeFunction({
          imageBufferBase64: image.base64String,
          mimeType: `image/${image.format}`
        });

        const newWodLines = result.data as string[];
        const currentWod = this.wod() || [];
        this.wod.set([...currentWod, ...newWodLines]);
        console.log("WOD aggiornato:", this.wod());

        await loading.dismiss();
        loading = null;

        const alertMessage = newWodLines.length > 0 
          ? `Esercizi del WOD inseriti con successo:\n${newWodLines.map(item => `• ${item}`).join('\n')}`
          : 'Non è stato possibile identificare alcun esercizio del WOD dall\'immagine.';
        
        const alert = await this.alertCtrl.create({
          header: 'WOD Rilevato!',
          message: alertMessage,
          buttons: ['Ottimo']
        });
        await alert.present();
      }
    } catch (error: any) {
      console.error("Errore durante la scansione del WOD:", error);
      if (loading) {
        await loading.dismiss();
      }
      if (error?.message !== 'User cancelled photos app' && error !== 'User cancelled photos app') {
        const alert = await this.alertCtrl.create({
          header: 'Errore Scansione',
          message: 'Si è verificato un errore durante l\'analisi dell\'immagine del WOD. Riprova.',
          buttons: ['Chiudi']
        });
        await alert.present();
      }
    }
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
