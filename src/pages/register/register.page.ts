import { ChangeDetectorRef, Component, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Auth } from '@angular/fire/auth';
import { Router, RouterModule } from '@angular/router';

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

  register() {
    if (this.registerForm.valid) {
      this.afAuth
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((data) => {
          console.log("registration successful");
          this.router.navigate(['/home']);
          this.error = false;
          this.errorMessage = '';
        })
        .catch((error) => {
          console.log(error.message);
          this.error = true;
          this.errorMessage = error.message;
          this.cdr.detectChanges();
        });
    }
  }
}
