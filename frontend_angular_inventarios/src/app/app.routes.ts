import { Routes } from '@angular/router';
import { Inicio } from './web/inicio/inicio';
import { Nosotros } from './web/nosotros/nosotros';
import { Galeria } from './web/galeria/galeria';
import { Profile } from './admin/profile/profile';
import { Users } from './admin/users/users';
import { authGuardGuard } from './core/guards/auth-guard-guard';
import { WebLayout } from './layout/web-layout/web-layout';
import { CategoriaComponent } from './admin/inventario/categoria/categoria';
import { AppLayout } from './layout/component/app.layout';
import { ProductoComponent } from './admin/inventario/producto.component/producto.component';
import { SucursalComponent } from './admin/inventario/sucursal.component/sucursal.component';
import { AlmacenComponent } from './admin/inventario/almacen.component/almacen.component';
import { CompraComponent } from './admin/notas/compra.component/compra.component';
import { VentaComponent } from './admin/notas/venta.component/venta.component';
import { ReporteCompraVentaComponent } from './admin/notas/reporte-compra-venta-component/reporte-compra-venta-component';

export const routes: Routes = [
    {
        path: '',
        component: WebLayout,
        children: [
            { path: '', component: Inicio },
            { path: 'nosotros', component: Nosotros },
            { path: 'galeria', component: Galeria },
            { path: 'auth', loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule) },
        ]
    },
    {
        path: 'admin',
        component: AppLayout,
        children: [
            { path: 'perfil', component: Profile, canActivate: [authGuardGuard] },
            { path: 'users', component: Users, canActivate: [authGuardGuard] },
            { path: 'categoria', component: CategoriaComponent, canActivate: [authGuardGuard] },
            {
                path: 'producto',
                component: ProductoComponent,
                canActivate: [authGuardGuard]
            },
            {
                path: 'sucursal',
                component: SucursalComponent,
                canActivate: [authGuardGuard]
            },
            {
                path: 'almacen',
                component: AlmacenComponent,
                canActivate: [authGuardGuard]
            },
            
            {
                path: 'nota/compra',
                component: CompraComponent,
                canActivate: [authGuardGuard],
                
            },
            
            {
                path: 'nota/venta',
                component: VentaComponent,
                canActivate: [authGuardGuard],
                
            },
            
            {
                path: 'nota/reportes',
                component: ReporteCompraVentaComponent,
                canActivate: [authGuardGuard],
                
            }
        
        ]
    }


];
