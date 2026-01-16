import { Component, inject, signal, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProductoService } from '../../../core/services/producto.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputText } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { AlmacenService } from '../../../core/services/almacen.service';
import { SucursalService } from '../../../core/services/sucursal.service';
import { ClienteProveedorService } from '../../../core/services/clienteproveedor.service';
import { NotaService } from '../../../core/services/nota.service';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}


@Component({
  selector: 'app-venta.component',
  imports: [TableModule, IconFieldModule, InputIconModule, FormsModule, ReactiveFormsModule, ImageModule, ButtonModule, CommonModule, InputText, DialogModule, SelectModule],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.scss',
})
export class VentaComponent {

  carrito = signal<any>([]);
  products = signal([]);
  cols!: Column[];
  totalRecords = signal(0);
  @ViewChild('dt') dt!: Table;
  loading = signal(false);
  search = signal("");
  buscar_cliente = signal("");
  visibleCliente = signal(false);
  sucursales = signal([]);
  almacenes = signal<any>([])
  lista_cliente_proveedor = signal<any>([])
  selectedSucursal = signal(-1);

  productoService = inject(ProductoService);
  almacenService = inject(AlmacenService);
  sucursalService = inject(SucursalService);
  clienteProveedorService = inject(ClienteProveedorService)
  notaService = inject(NotaService);

  almacen = signal<any>({});
  clienteProveedor = signal<any>({});

  proveedorForm = new FormGroup({
    tipo : new FormControl('cliente'),
    razon_social: new FormControl('',  [Validators.required]),
    identificacion: new FormControl('',  [Validators.required]),
    telefono: new FormControl('',  [Validators.required]),
    direccion: new FormControl('',  [Validators.required]),
    correo: new FormControl('',  [Validators.required]),
    estado: new FormControl(true,  [Validators.required]),
  });


  constructor(){
    this.funSelectedSucursal()
    this.funGetSucursales();
  }


  funSelectedSucursal(){
    this.almacen.set({});
    this.funAlmacenes(this.selectedSucursal())
  }

  funGetSucursales(){
    this.sucursalService.listar().subscribe(
      (res: any) => {
        this.sucursales.set(res);
      }

    )
  }

  seleccionarAlmacen(alm: any){
    this.almacen.set(alm);
    this.funGetProductos()
  }

  seleccionarClienteProveedor(clie: any){
    this.clienteProveedor.set(clie)
  }


  cargarDatos(event: any){
    let page = event.first / event.rows + 1;

    this.funGetProductos(page, event.rows);
  }

  funGetProductos(page: number = 1, limit: number = 10) {
    this.loading.set(true)

    this.productoService.funListar(page, limit, this.search(), 'id', this.almacen().id).subscribe((res: any) => {
      console.log(res);
      this.products.set(res.data);
      this.totalRecords.set(res.total);

      this.loading.set(false)
    });
  }

  funAlmacenes(sucursalId:any=1){
    this.almacenService.listar(sucursalId).subscribe(
      (res) => {
        this.almacenes.set(res);
      }
    )
  }

  funGetCLienteProveedor(){
    this.clienteProveedor.set({});
    this.clienteProveedorService.listar(this.buscar_cliente()).subscribe(
      (res: any) => {
        this.lista_cliente_proveedor.set(res); 
      }
    )
  }

  funGuardarProveedor(){
    this.clienteProveedorService.guardar(this.proveedorForm.value).subscribe(
      (res: any) => {
        this.clienteProveedor.set(res);

        this.proveedorForm.reset();
        this.visibleCliente.set(false);
      }
    );

  }

  funRegCompraProductos(){
    const hoy = new Date();

    // capturar el user_id
    const token = localStorage.getItem("access_token");
    const base64url = token?.split('.')[1] || "";
    const payload = JSON.parse(atob(base64url));
    
    const fecha_hora_actual = hoy.toLocaleString('sv-SE', {hour12: false})

    if(this.clienteProveedor().id && payload && this.carrito().length > 0){
      
      const movimientos = [];
      for (let i = 0; i < this.carrito().length; i++) {
        const prod = this.carrito()[i];
        movimientos.push({
          "producto_id": prod.id_producto,
          "almacen_id": this.almacen().id,
          "cantidad": parseInt(prod.cantidad),
          "tipo_movimiento": "salida",
          "precio_unitario_compra": prod.precio,
          "precio_unitario_venta": prod.precio,
          "observaciones": "NINGUNO"
         });
      }
  
      const datos = {
        "fecha": fecha_hora_actual,
        "tipo_nota": "venta",
        "cliente_id": this.clienteProveedor().id,
        "user_id": payload.id,
        "impuestos": "0",
        "descuento": "0",
        "estado_nota": "NINGUNO",
        "observaciones": "NINGUNO",
        "movimientos": movimientos
      }

      console.log(datos);

      this.notaService.guardar(datos).subscribe(
        (res: any) => {
          this.carrito.set([]);
          this.clienteProveedor.set({})
          this.almacen.set({});

          this.funGetProductos();
        },
        (error:any) => {
          console.log(error?.error?.message);
          alert(error?.error?.message);
        }
      )

    }




  }

  addCarrito(prod: any){
    const carritoActual = this.carrito();

    const index = carritoActual.findIndex(
      (item: any) => item.id_producto === prod.id
    );
    
    if(index !== -1){
      // El producto ya existe : aumentar la cantidad
      const carritoActualizado = carritoActual.map((item: any, i: number) => 
        i === index ? {...item, cantidad: item.cantidad + 1}: item
      );

      this.carrito.set(carritoActualizado);
    }else{
      // El producto no existe : agregar nuevo
      this.carrito.set([...this.carrito(), { id_producto: prod.id ,nombre: prod.nombre, cantidad: 1, precio: prod.precio_venta_actual }]);
    }

  }

  quitarCarrito(prod:any){
 
    const carritoActual = [...this.carrito()] // clonando
    const index = carritoActual.findIndex(
      item => item.id_producto === prod
    );


    if(index !== -1){
      carritoActual.splice(index, 1);
      this.carrito.set(carritoActual);
    }
  }

  showDialogCliente(){
    this.visibleCliente.set(true);
  }
}
