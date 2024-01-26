import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaginaReportesVerificarComponent } from './paginas/pagina-reportes-verificar/pagina-reportes-verificar.component';
import { PaginaReporteVerificarComponent } from './paginas/pagina-reporte-verificar/pagina-reporte-verificar.component';
import { PaginaReportesFase2VerificarComponent } from './paginas/pagina-reportes-fase2-verificar/pagina-reportes-fase2-verificar.component';
import { PaginaReporteFase2VerificarComponent } from './paginas/pagina-reporte-fase2-verificar/pagina-reporte-fase2-verificar.component';



const routes: Routes = [
  
  {
    path: '',
    component: PaginaReportesVerificarComponent
  },
  {
    path: ':idReporte',
    component: PaginaReporteVerificarComponent
  },
  {
    path: 'fase-dos/reportes',
    component: PaginaReportesFase2VerificarComponent
  },
  {
    path: 'fase-dos/reportes/:idReporte',
    component: PaginaReporteFase2VerificarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerificacionesRoutingModule { }
