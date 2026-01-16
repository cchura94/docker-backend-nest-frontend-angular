import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(40)])
  });

  authService = inject(AuthService);
  router = inject(Router)

  funLogin(){
    this.authService.funConectarConBackendLogin(this.loginForm.value).subscribe(
      (res: any) => {
        console.log(res);
        localStorage.setItem("access_token", res.access_token);

        this.router.navigate(["/admin/users"]);
        // alert("Bienvenido...")
      },
      (error) => {
        console.log(error);
        alert("Error al autenticar...")
      }
    )
  }

}
