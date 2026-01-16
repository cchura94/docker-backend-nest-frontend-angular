import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  urlBase = environment.servidor;
  // urlBase = "https://laravue2.blumbit.net/back/public/api"

  http = inject(HttpClient);

  funConectarConBackendLogin(credenciales: any){
    return this.http.post(`${this.urlBase}/auth/login`, credenciales);
  }

  funGetPerfil(){
    return this.http.get(`${this.urlBase}/auth/profile`);
  }
}
