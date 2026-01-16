import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SucursalService {
  urlBase = environment.servidor;
  
  http = inject(HttpClient);

  listar(){
    return this.http.get(`${this.urlBase}/sucursal`);
  }

  guardar(datos: any){
    return this.http.post(`${this.urlBase}/sucursal`, datos);
  }

  mostrar(id: number){
    return this.http.get(`${this.urlBase}/sucursal/${id}`);
  }


  modificar(id: number, datos: any){
    return this.http.patch(`${this.urlBase}/sucursal/${id}`, datos);
  }
}
