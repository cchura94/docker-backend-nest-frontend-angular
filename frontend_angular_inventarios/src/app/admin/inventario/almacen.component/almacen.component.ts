import { Component, inject, signal } from '@angular/core';
import { AlmacenService } from '../../../core/services/almacen.service';
import { TableModule } from 'primeng/table';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { SucursalService } from '../../../core/services/sucursal.service';

@Component({
  selector: 'app-almacen.component',
  imports: [TableModule, ReactiveFormsModule, InputTextModule, InputNumberModule, ButtonModule, SelectModule, FormsModule],
  templateUrl: './almacen.component.html',
  styleUrl: './almacen.component.scss',
})
export class AlmacenComponent {
  almacenes = signal<any>([])
  almacenService = inject(AlmacenService);
  sucursalService = inject(SucursalService)
  visible = signal(false)
  id_sucursal = signal(-1);
  sucursales = signal([]);
  selectedSucursal = signal(-1);

  almacenForm = new FormGroup({
    nombre: new FormControl('',  [Validators.required]),
    codigo: new FormControl(''),
    descripcion: new FormControl(""),
    sucursal: new FormControl("")
  });
  
  constructor(){
    this.funAlmacenes();
    this.funGetSucursales();
  }


  funAlmacenes(sucursalId:any=1){
    this.almacenService.listar(sucursalId).subscribe(
      (res) => {
        this.almacenes.set(res);
      }
    )
  }

  funSelectedSucursal(){
    this.funAlmacenes(this.selectedSucursal())
  }

  funGetSucursales(){
    this.sucursalService.listar().subscribe(
      (res: any) => {
        this.sucursales.set(res);
      }

    )
  }

  funGuardar(){
    this.almacenService.guardar(this.almacenForm.value).subscribe(
    (res: any) => {
      this.funAlmacenes();
      this.almacenForm.reset()
    },
    (error) => {
      alert("Error al intentar recuperar los almacenes");
    }
  )}
}
