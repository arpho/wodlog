import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonLabel, IonButton } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.page.html',
  styleUrls: ['./recover-password.page.scss'],
  standalone: true,
  imports: [IonButton, IonInput, IonItem, IonContent,
     IonHeader, 
     IonTitle,
      IonToolbar,
       CommonModule,
        FormsModule,
      ReactiveFormsModule
      ]
})
export class RecoverPasswordPage implements OnInit {
recoverForm: FormGroup
email="";
  constructor(
private fb:FormBuilder,
private toaster:ToastController,
private auth:AuthService
  ) { 
    this.recoverForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
  })
  }  ngOnInit(): void {

  }


  submit(){
    this.auth.sendPasswordResetEmail( this.recoverForm.get('email')!.value).then(res=>{
      console.log("email sent",res)
      this.toaster.create({message:"Recover pasword's Email sent",duration:2000}).then(res=>{
        console.log("toast created",res)
      })
    }).catch(err=>{console.log("error",err)})
  }
} 
