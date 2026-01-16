import { Component, inject, signal } from '@angular/core';
import { UsersService } from '../../core/services/users.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-users',
  imports: [ReactiveFormsModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  userService = inject(UsersService);
  usuarios = signal<any>([]);
  abrirModal = signal<boolean>(false);
  user_id = signal<number>(-1)

  userForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(40)])
  });

  constructor(){
    this.listar()
  }

  abrirModalDialog(){
    this.abrirModal.set(true)
  }
  cerrarModalDialog(){
    this.abrirModal.set(false)
  }

  listar(){
    this.userService.funListar().subscribe(
      (res: any) => {
        this.usuarios.set(res.data);
      }
    )
  }

  guardarUser(){
    console.log(this.userForm.value);

    if(this.user_id() > -1){
      // editar
      const userData= {email: this.userForm.value.email || '', password: this.userForm.value.password || '', username: this.userForm.value.username || ''}
      this.userService.funModificar(userData, this.user_id()).subscribe(
        (res) => {
          this.userForm.reset()
          this.listar()
        }
      )
    }else{
      // guardar
      const userData= {email: this.userForm.value.email || '', password: this.userForm.value.password || '', username: this.userForm.value.username || ''}
      this.userService.funGuardar(userData).subscribe(
        (res) => {
          this.userForm.reset()
          this.listar()
        }
      )
    }

    this.user_id.set(-1)
  }

  funEditar(userData: any){
    this.abrirModalDialog()
    const {id, isActive, roles, ...rest} = userData;
    this.userForm.setValue(rest);
    this.user_id.set(id)
    // this.userForm.value.password;
    // this.userForm.value.username = userData.username
    // this.userForm.value.email = userData.email
    // this.userForm.value.password = userData.password
  }
}
