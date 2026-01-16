import { Component, inject, signal } from '@angular/core';
import { Categoria } from '../../../core/services/categoria';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaInterface } from '../../../core/interfaces/CategoriaInterface';


@Component({
  selector: 'app-categoria',
  imports: [ReactiveFormsModule,TableModule, ButtonModule, DialogModule, InputTextModule],
  templateUrl: './categoria.html',
  styleUrl: './categoria.scss',
})
export class CategoriaComponent {

  categorias = signal<any>([])
  categoriaService = inject(Categoria);
  visible = signal(false)
  id_categoria = signal(-1);


  categoriaForm = new FormGroup({
    nombre: new FormControl('',  [Validators.required]),
    descripcion: new FormControl('')
  });

  constructor(){
    this.funListado()
  }

  funListado(){
    this.categoriaService.listarCategorias().subscribe(
      (res: any) => {
        this.categorias.set(res);
      }
    )
  }

  showDialog(){
    this.id_categoria.set(-1);
    this.categoriaForm.reset()
    this.visible.set(true);
  }

  funGuardar(){
    const cate: CategoriaInterface = {
      nombre: this.categoriaForm.value.nombre ?? '',
      descripcion: this.categoriaForm.value.descripcion ?? undefined
    }
    
    if(this.id_categoria()>0) {
      this.categoriaService.modificarCategoria(this.id_categoria(), cate).subscribe(
        (res) => {
          this.visible.set(false);
          this.categoriaForm.reset();
          this.funListado()
        },
        (error) => {
          alert("Error al modificar la categoria")
        }
      )
    }else{
      this.categoriaService.guardarCategoria(cate).subscribe(
        (res) => {
          this.visible.set(false);
          this.categoriaForm.reset();
          this.funListado()
        },
        (error) => {
          alert("Error al registrar la categoria")
        }
      )

    }
  }

  funEditar(cat: CategoriaInterface){
    this.visible.set(true)
    this.id_categoria.set(cat.id ?? -1);
    this.categoriaForm.patchValue(cat);
  }
}
