import { ChangeDetectorRef, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import /*ConfirmationService, MessageService*/ 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { Ripple } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RadioButton } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { TextareaModule } from 'primeng/textarea';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProductoService } from '../../../core/services/producto.service';
import { Categoria } from '../../../core/services/categoria';
import { ImageModule } from 'primeng/image';
import { FileUploadModule } from 'primeng/fileupload';


interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-producto.component',
  imports: [
    TableModule,
    Dialog,
    // Ripple,
    SelectModule,
    ToastModule,
    ToolbarModule,
    // ConfirmDialog,
    InputTextModule,
    TextareaModule,
    CommonModule,
    RadioButton,
    InputTextModule,
    InputNumber,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    FormsModule,
    ImageModule,
    FileUploadModule
  ],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.scss',
})
export class ProductoComponent {
  // @ViewChild('dt') dt!: Table;

  products = signal([]);
  product = signal<any>({});
  cols!: Column[];
  submitted = signal<boolean>(false);
  productDialog = signal<boolean>(false);
  totalRecords = signal(0);
  @ViewChild('dt') dt!: Table;
  categorias = signal<{id?:number, nombre: string}[]>([]);

  productoService = inject(ProductoService);
  categoriaService = inject(Categoria);
  statuses: any[] = [
    { label: 'ACTIVO', value: true },
    { label: 'INACTIVO', value: false }
  ];
  
  loading = signal(false)
  search = signal("");
  modalImage = signal(false);

  constructor(
    // private messageService: MessageService,
    // private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef
  ) {
    this.funGetProductos();
    this.GetCategorias();
  }

  funGetProductos(page: number = 1, limit: number = 5) {
    this.loading.set(true)

    this.productoService.funListar(page, limit, this.search()).subscribe((res: any) => {
      console.log(res);
      this.products.set(res.data);
      this.totalRecords.set(res.total);

      this.loading.set(false)
    });
  }

  GetCategorias(){
    this.categoriaService.listarCategorias().subscribe(
      (res: any) => {
        this.categorias.set(res);
      }
    )
  }

  hideDialog() {
    this.productDialog.set(false);
    this.submitted.set(false);
  }

  openNew() {
    this.product.set({});
    this.submitted.set(false);
    this.productDialog.set(true);
  }

  exportCSV(event: any) {
    // this.dt.exportCSV();
  }

  editProduct(product: any) {
    this.product = { ...product };
    this.productDialog.set(true);
  }

  cargarDatos(event: any){
    let page = event.first / event.rows + 1;

    this.funGetProductos(page, event.rows);
  }
  deleteProduct(product: any) {
    /*
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        variant: 'text',
      },
      acceptButtonProps: {
        severity: 'danger',
        label: 'Yes',
      },
      accept: () => {
        this.products.set(this.products().filter((val: any) => val.id !== product.id));
        this.product.set({});
        
          this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Producto Eliminado',
              life: 3000
          });
          
      },
    });
    */
  }

  saveProduct() {
    this.submitted.set(true);
    
    const now = new Date();

const day = String(now.getDate()).padStart(2, '0');
const month = String(now.getMonth() + 1).padStart(2, '0'); // meses empiezan en 0
const year = String(now.getFullYear()).slice(-2);

const formattedDate = `${day}-${month}-${year}`;

    const {precio_venta_actual, ...rest} = this.product();
    this.product.set({fecha_registro: formattedDate+"", precio_venta_actual: this.product().precio_venta_actual +"",...rest})
    console.log(this.product());

    if (this.product().nombre?.trim()) {
      if (this.product().id) {
      } else {
        this.productoService.funGuardar(this.product()).subscribe(
          (res: any) => {
            this.funGetProductos();
          }
        )
      }

      this.products.set([...this.products()]);
      this.productDialog.set(false);
      this.product.set({});
    }
  }

  showDialogImagenProduct(producto: any){
    this.modalImage.set(true)
    this.product.set(producto);

  }

  hideDialogImagenProduct(){
    this.modalImage.set(false)
    this.product.set({});

  }

  funSubirImagen(event: any){
    console.log(event.files[0]);
    const imagen = event.files[0];

    let formData = new FormData()
    formData.append("imagen", imagen);

    this.productoService.actualizarImagen(this.product().id, formData).subscribe(
      (res: any) => {
        this.hideDialogImagenProduct();
        this.funGetProductos()
      }
    )


  }
}
