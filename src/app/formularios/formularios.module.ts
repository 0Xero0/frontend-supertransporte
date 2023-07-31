import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginaFormularioAspiranteProveedorTecnologicoComponent } from './paginas/pagina-formulario-aspirante-proveedor-tecnologico/pagina-formulario-aspirante-proveedor-tecnologico.component';
import { TemplatesModule } from '../templates/templates.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InputsModule } from '../inputs/inputs.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertasModule } from '../alertas/alertas.module';



@NgModule({
  declarations: [
    PaginaFormularioAspiranteProveedorTecnologicoComponent
  ],
  imports: [
    CommonModule,
    TemplatesModule,
    NgbModule,
    InputsModule,
    FormsModule,
    ReactiveFormsModule,
    AlertasModule
  ]
})
export class FormulariosModule { }
