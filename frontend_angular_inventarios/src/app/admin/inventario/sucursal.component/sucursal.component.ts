import { Component, inject, signal } from '@angular/core';
import { SucursalService } from '../../../core/services/sucursal.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-sucursal.component',
  imports: [ReactiveFormsModule, TableModule, InputTextModule, ButtonModule],
  templateUrl: './sucursal.component.html',
  styleUrl: './sucursal.component.scss',
})
export class SucursalComponent {

  sucursales = signal<any>([])
  sucursalService = inject(SucursalService);
  visible = signal(false)
  id_sucursal = signal(-1);
  constructor(){
    this.funSucursal()
  }


  sucursalForm = new FormGroup({
    nombre: new FormControl('',  [Validators.required]),
    direccion: new FormControl(''),
    ciudad: new FormControl("")
    
  });

  funSucursal(){
    this.sucursalService.listar().subscribe(
      (res: any) => {
        this.sucursales.set(res);
      }
    )
  }

  funGuardar(){
    this.sucursalService.guardar(this.sucursalForm.value).subscribe(
      (res: any) => {
        this.funSucursal()
        this.sucursalForm.reset();
      },
      (error) => {
        alert("Error al intentar registrar una sucursal")
      }
    )
  }
}
