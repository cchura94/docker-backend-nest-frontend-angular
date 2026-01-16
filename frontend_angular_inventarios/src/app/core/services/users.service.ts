import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

export interface User {
  username: string,
  email: string,
  password: string
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  urlBase = environment.servidor;
  // urlBase = "https://laravue2.blumbit.net/back/public/api"

  http = inject(HttpClient);

  funListar(){
    return this.http.get(`${this.urlBase}/users`);
  }

  funGuardar(data: User){
    return this.http.post(`${this.urlBase}/users`, data);
  }

  funModificar(data: User, id: number){
    return this.http.patch(`${this.urlBase}/users/:id`, data);
  }

}
