import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AlmacenService {
  urlBase = environment.servidor;
  
  http = inject(HttpClient);

  listar(sucursalId?: number){
    return this.http.get(`${this.urlBase}/almacen?sucursalId=`+sucursalId);
  }

  guardar(datos: any){
    return this.http.post(`${this.urlBase}/almacen`, datos);
  }

  mostrar(id: number){
    return this.http.get(`${this.urlBase}/almacen/${id}`);
  }


  modificar(id: number, datos: any){
    return this.http.patch(`${this.urlBase}/almacen/${id}`, datos);
  }
}
