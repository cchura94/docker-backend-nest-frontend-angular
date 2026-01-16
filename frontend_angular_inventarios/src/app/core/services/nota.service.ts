import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NotaService {
  urlBase = environment.servidor;
  
  http = inject(HttpClient);

  listar(page: number = 1, limit: number = 10, selectedTipo: string=''){
    return this.http.get(`${this.urlBase}/nota?page=${page}&limit=${limit}&tipo_nota=${selectedTipo}`);
  }

  guardar(datos: any){
    return this.http.post(`${this.urlBase}/nota`, datos);
  }

  mostrar(id: number){
    return this.http.get(`${this.urlBase}/nota/${id}`);
  }


  modificar(id: number, datos: any){
    return this.http.patch(`${this.urlBase}/nota/${id}`, datos);
  }
}
