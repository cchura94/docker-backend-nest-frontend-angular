import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { CategoriaInterface } from '../interfaces/CategoriaInterface';

@Injectable({
  providedIn: 'root',
})
export class Categoria {

    urlBase = environment.servidor;
  
  http = inject(HttpClient);

  listarCategorias(){
    return this.http.get(`${this.urlBase}/categoria`);
  }

  guardarCategoria(datos: CategoriaInterface){
    return this.http.post(`${this.urlBase}/categoria`, datos);
  }

  modificarCategoria(id: number, datos: CategoriaInterface){
    return this.http.patch(`${this.urlBase}/categoria/${id}`, datos);
  }

}
