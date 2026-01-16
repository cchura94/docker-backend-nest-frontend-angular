import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {

  miPerfil= signal<any>({});
  authService = inject(AuthService);
  router = inject(Router)

  constructor(){
    this.authService.funGetPerfil().subscribe(
      (res: any) => {
        this.miPerfil.set(res)
      }
    )
  }

  funSalir(){
    localStorage.removeItem("access_token");
    this.router.navigate(["/auth/login"]);
  }

}
