import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlantillaComponent } from './administrador/componentes/plantilla/plantilla.component';
import { InicioSesionComponent } from './autenticacion/componentes/inicio-sesion/inicio-sesion.component';
import { ActualizarContrasenaComponent } from './autenticacion/componentes/actualizar-contrasena/actualizar-contrasena.component';
import { AutenticacionGuard } from './guards/autenticacion.guard';
import { AutorizacionGuard } from './guards/autorizacion.guard';
import { ListadoEncuestasComponent } from './encuestas/paginas/listado-encuestas/listado-encuestas.component';
import { PaginaEncuestaComponent } from './encuestas/paginas/pagina-encuesta/pagina-encuesta.component';
import { PaginaInformacionGeneralVigiladoComponent } from './administrador/paginas/pagina-informacion-general-vigilado/pagina-informacion-general-vigilado.component';
import { PaginaSoporteComponent } from './administrador/paginas/pagina-soporte/pagina-soporte.component';
import { PaginaSoportesComponent } from './soportes/paginas/pagina-soportes/pagina-soportes.component';
import { PaginaResponderSoporteComponent } from './soportes/paginas/pagina-responder-soporte/pagina-responder-soporte.component';
import { PaginaCategorizacion } from './categorizacion/paginas/pagina-categorizacion/pagina-categorizacion.component';
import { SoporteAccesoComponent } from './autenticacion/componentes/soporte-acceso/soporte-acceso.component';
import { PaginaAsignacionTamanoOrganizacionComponent } from './categorizacion/paginas/pagina-asignacion-tamano-organizacion/pagina-asignacion-tamano-organizacion.component';
import { PaginaFormularioAspiranteProveedorTecnologicoComponent } from './formularios/paginas/pagina-formulario-aspirante-proveedor-tecnologico/pagina-formulario-aspirante-proveedor-tecnologico.component';



const routes: Routes = [
  {
    path: 'administrar',
    component: PlantillaComponent,
    canActivate: [AutenticacionGuard],
    children: [
      {
        path: 'encuestas/:idEncuesta',
        component: ListadoEncuestasComponent
      },
      {
        path: 'encuesta/:idEncuestaDiligenciada',
        component: PaginaEncuestaComponent
      },
      {
        path: 'informacion-general',
        component: PaginaInformacionGeneralVigiladoComponent
      },
      {
        path: 'soporte',
        component: PaginaSoporteComponent
      },
      {
        path: 'responder-soporte/:idSoporte',
        component: PaginaResponderSoporteComponent
      },
      {
        path: 'soportes',
        component: PaginaSoportesComponent
      },
      {
        path: 'categorizacion',
        component: PaginaCategorizacion
      },
      {
        path: 'asignacion',
        component: PaginaAsignacionTamanoOrganizacionComponent
      },
      { 
        path: 'asignaciones', 
        loadChildren: () => import('./asignaciones/asignaciones.module').then(m => m.AsignacionesModule) 
      },
      {
        path: 'verificar-reportes',
        loadChildren: () => import('./verificaciones/verificaciones.module').then(m => m.VerificacionesModule)
      },
      {
        path: 'usuarios',
        loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule)
      }
    ]
  },
  {
    path: 'inicio-sesion',
    component: InicioSesionComponent
  },
  {
    path: 'actualizar-contrasena',
    component: ActualizarContrasenaComponent
  },
  {
    path: 'soporte',
    component: SoporteAccesoComponent
  },
  {
    path: 'aspirante-proveedor-tecnologico',
    component: PaginaFormularioAspiranteProveedorTecnologicoComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'inicio-sesion'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
