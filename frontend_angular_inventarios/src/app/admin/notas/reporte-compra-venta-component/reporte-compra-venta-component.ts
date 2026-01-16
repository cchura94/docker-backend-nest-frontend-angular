import { Component, inject, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { NotaService } from '../../../core/services/nota.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reporte-compra-venta-component',
  imports: [TableModule, ButtonModule, DialogModule, SelectModule, FormsModule],
  templateUrl: './reporte-compra-venta-component.html',
  styleUrl: './reporte-compra-venta-component.scss',
})
export class ReporteCompraVentaComponent {

  notas = signal([]);
  notaService = inject(NotaService);
  movimientos = signal([]);

  totalRecords = signal(0);

  visible = signal(false);

  loading = signal(false);

  selectedTipo = signal<any>('venta')

  constructor(){
    this.getListaNotas()
  }

  getListaNotas(page: number = 1, limit: number = 5){
    this.loading.set(true)
    this.notaService.listar(page, limit, this.selectedTipo()).subscribe(
      (res: any) => {
        this.notas.set(res.data)
        this.totalRecords.set(res.total);

        this.loading.set(false)
      }
    )
  }

  getFecha(fecha: any){
    return new Date(fecha).toLocaleDateString()
  }

  showMovimientos(nota: any){
    this.movimientos.set(nota.movimientos);
    this.visible.set(true)
  }

  cargarDatos(event: any){
    let page = event.first / event.rows + 1;

    console.log(page);
    this.getListaNotas(page, event.rows);
  }
}
