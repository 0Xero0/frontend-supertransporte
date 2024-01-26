import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginaReportesVerificarComponent } from './paginas/pagina-reportes-verificar/pagina-reportes-verificar.component';
import { VerificacionesRoutingModule } from './verificaciones-routing.module';
import { EncuestasModule } from '../encuestas/encuestas.module';
import { PaginaReporteVerificarComponent } from './paginas/pagina-reporte-verificar/pagina-reporte-verificar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from '../pipes/pipes.module';
import { AlertasModule } from '../alertas/alertas.module';
import { PaginaReportesFase2VerificarComponent } from './paginas/pagina-reportes-fase2-verificar/pagina-reportes-fase2-verificar.component';
import { PaginaReporteFase2VerificarComponent } from './paginas/pagina-reporte-fase2-verificar/pagina-reporte-fase2-verificar.component';



@NgModule({
  declarations: [
    PaginaReportesVerificarComponent,
    PaginaReporteVerificarComponent,
    PaginaReportesFase2VerificarComponent,
    PaginaReporteFase2VerificarComponent
  ],
  imports: [
    CommonModule,
    VerificacionesRoutingModule,
    EncuestasModule,
    PipesModule,
    NgbModule,
    AlertasModule
  ],
  exports: [
    PaginaReportesVerificarComponent
  ]
})
export class VerificacionesModule { }
