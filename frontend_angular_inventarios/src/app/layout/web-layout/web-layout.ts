import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-web-layout',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './web-layout.html',
  styleUrl: './web-layout.scss',
})
export class WebLayout {

  router = inject(Router)
  funIngresar(){
    this.router.navigate(["/auth/login"])
  }
}
