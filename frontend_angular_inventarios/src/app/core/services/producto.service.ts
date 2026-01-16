import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  urlBase = environment.servidor;
  http = inject(HttpClient);
  
  funListar(page: number = 1, limit: number = 10, search: string = '', sortBy= 'id', almacen=0){
    return this.http.get(`${this.urlBase}/producto?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&almacen=${almacen}`);
  }

  funGuardar(datos: any){
    return this.http.post(`${this.urlBase}/producto`, datos);
  }

  funMostrar(id: number){
    return this.http.get(`${this.urlBase}/producto/${id}`);
  }

  funModificar(id: number, datos: any){
    return this.http.patch(`${this.urlBase}/producto/${id}`, datos);
  }

  funEliminar(id: number){
    return this.http.delete(`${this.urlBase}/producto/${id}`);
  }

  actualizarImagen(id:number, formData: FormData){
    return this.http.post(`${this.urlBase}/producto/${id}/actualizar-imagen`, formData);
  }

}
