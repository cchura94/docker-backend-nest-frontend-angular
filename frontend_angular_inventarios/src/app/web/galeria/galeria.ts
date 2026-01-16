import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-galeria',
  imports: [],
  templateUrl: './galeria.html',
  styleUrl: './galeria.scss',
})
export class Galeria {

  router = inject(Router)
  funLogin(){
    this.router.navigate(["/auth/login"]);
  }

}
