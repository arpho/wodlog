import { ChangeDetectorRef, Component, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Auth, authState, signInAnonymously, signOut, User, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { RouterModule } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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
    IonLabel,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class LoginPage implements OnInit {
loginForm: FormGroup
email="";
password="";
  error: boolean= false;
  errorMessage: any;
  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    @Optional() private auth: Auth
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    }); }

  ngOnInit() {
console.log("init login page")
  }
  login() {
    if (this.loginForm.valid) {
    console.log( this.email,this.password);
      console.log('Login form submitted:', this.loginForm.value);

    this.afAuth
      .signInWithEmailAndPassword(this.email, this.password)
      .catch((error) => {
        console.log(error.message);
        this.error = true;
        this.errorMessage = error.message;
        this.cdr.detectChanges();
      })
      .then((data) => {
        console.log("login successfull")
        console.log(data);
        if (data) {
          this.error = false;
          this.errorMessage = '';

        } else {
          console.log('login failed');
        }
        // window.location.reload();
      });

    } else {
      console.log('Login form is invalid');
    }
  }

}
