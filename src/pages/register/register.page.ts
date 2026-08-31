import { ChangeDetectorRef, Component, OnInit, Optional, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, LoadingController } from '@ionic/angular/standalone';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Auth } from '@angular/fire/auth';
import { Router, RouterModule } from '@angular/router';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { environment } from 'src/environments/environment';

declare var grecaptcha: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonInput,
    IonLabel,
    IonItem,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  email = "";
  password = "";
  error: boolean = false;
  errorMessage: any;

  private functions = inject(Functions);
  private loadingCtrl = inject(LoadingController);

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private afAuth: AngularFireAuth,
    @Optional() private auth: Auth
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {
    console.log("init register page");
  }

  async register() {
    if (!this.registerForm.valid) return;

    const loading = await this.loadingCtrl.create({
      message: 'Verifica registrazione in corso...',
      spinner: 'crescent'
    });
    await loading.present();

    let recaptchaToken = '';

    try {
      // 1. Ottieni il token reCAPTCHA v3 se la chiave ed il SDK grecaptcha sono presenti
      const siteKey = (environment as any).recaptchaSiteKey;
      if (siteKey && typeof grecaptcha !== 'undefined') {
        recaptchaToken = await new Promise<string>((resolve) => {
          grecaptcha.ready(() => {
            grecaptcha.execute(siteKey, { action: 'register' }).then((token: string) => {
              resolve(token);
            }).catch(() => resolve(''));
          });
        });
      }

      // 2. Chiamata alla Cloud Function per la verifica anti-bot e la registrazione sicura
      const verifyFn = httpsCallable(this.functions, 'verifyRecaptchaAndRegister');
      await verifyFn({
        email: this.email,
        password: this.password,
        recaptchaToken: recaptchaToken
      });

      // 3. Login dell'utente appena registrato
      await this.afAuth.signInWithEmailAndPassword(this.email, this.password);

      await loading.dismiss();
      console.log("Registrazione ed autenticazione completate con successo!");
      this.error = false;
      this.errorMessage = '';
      this.router.navigate(['/home']);
    } catch (error: any) {
      await loading.dismiss();
      console.error("Errore durante la registrazione:", error);
      this.error = true;
      this.errorMessage = error?.message || 'Impossibile completare la registrazione.';
      this.cdr.detectChanges();
    }
  }
}
