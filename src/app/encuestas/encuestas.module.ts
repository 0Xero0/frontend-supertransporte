import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListadoEncuestasComponent } from './paginas/listado-encuestas/listado-encuestas.component';
import { InputsModule } from '../inputs/inputs.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginaEncuestaComponent } from './paginas/pagina-encuesta/pagina-encuesta.component';
import { RouterModule } from '@angular/router';
import { EncuestaComponent } from './componentes/encuesta/encuesta.component';
import { PreguntaEncuestaComponent } from './componentes/pregunta-encuesta/pregunta-encuesta.component';
import { ClasificacionEncuestaComponent } from './componentes/clasificacion-encuesta/clasificacion-encuesta.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertasModule } from '../alertas/alertas.module';
import { PipesModule } from '../pipes/pipes.module';
import { EncuestaCuantitativaComponent } from './componentes/encuesta-cuantitativa/encuesta-cuantitativa/encuesta-cuantitativa.component';
import { TabEncuestaCuantitativaComponent } from './componentes/encuesta-cuantitativa/tab-encuesta-cuantitativa/tab-encuesta-cuantitativa.component';
import { PreguntaEncuestaCuantitativaComponent } from './componentes/encuesta-cuantitativa/pregunta-encuesta-cuantitativa/pregunta-encuesta-cuantitativa.component';
import { SubindicadorEncuestaCuantitativaComponent } from './componentes/encuesta-cuantitativa/subindicador-encuesta-cuantitativa/subindicador-encuesta-cuantitativa.component';
import { EvidenciaEncuestaCuantitativaComponent } from './componentes/encuesta-cuantitativa/evidencia-encuesta-cuantitativa/evidencia-encuesta-cuantitativa.component';
import { ModalConfirmarEnviarComponent } from './componentes/modal-confirmar-enviar/modal-confirmar-enviar.component';



@NgModule({
  declarations: [
    ListadoEncuestasComponent,
    PaginaEncuestaComponent,
    EncuestaComponent,
    PreguntaEncuestaComponent,
    ClasificacionEncuestaComponent,
    EncuestaCuantitativaComponent,
    TabEncuestaCuantitativaComponent,
    PreguntaEncuestaCuantitativaComponent,
    SubindicadorEncuestaCuantitativaComponent,
    EvidenciaEncuestaCuantitativaComponent,
    ModalConfirmarEnviarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    InputsModule,
    AlertasModule,
    PipesModule
  ],
  exports: [
    ListadoEncuestasComponent,
    PaginaEncuestaComponent,
    EncuestaComponent,
    PreguntaEncuestaComponent,
    ClasificacionEncuestaComponent
  ]
})
export class EncuestasModule { }
