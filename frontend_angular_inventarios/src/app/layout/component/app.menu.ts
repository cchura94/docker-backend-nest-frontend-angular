import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Admin', icon: 'pi pi-fw pi-home', routerLink: ['/admin/categoria'] },
                { label: 'Perfil', icon: 'pi pi-fw pi-user', routerLink: ['/admin/perfil'] }]
            },
            {
                label: 'Users',
                items: [
                    { label: 'Usuarios', icon: 'pi pi-fw pi-users', routerLink: ['/admin/users'] },
                    
                ]
            },
            {
                label: 'Inventarios',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Categoria',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/admin/categoria']
                    },
                    
                    {
                        label: 'Productos',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/admin/producto']
                    },
                    {
                        label: 'Sucursales',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/admin/sucursal']
                    },
                    {
                        label: 'Almacen',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/admin/almacen']
                    },
                ]
            },
            {
                label: 'Compras y Ventas',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/admin'],
                items: [
                    {
                        label: 'Compra',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/admin/nota/compra']
                    },
                    
                    {
                        label: 'Venta',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/admin/nota/venta']
                    },
                    {
                        label: 'Reporte Compra/Venta',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/admin/nota/reportes']
                    },
                   
                ]
            }
        ];
    }
}
