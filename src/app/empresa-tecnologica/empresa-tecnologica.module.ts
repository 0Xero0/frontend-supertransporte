import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { InputsModule } from '../inputs/inputs.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginaEmpresaTecnologicaComponent } from './pagina-empresa-tecnologica/pagina-empresa-tecnologica.component';



@NgModule({
  declarations: [
    PaginaEmpresaTecnologicaComponent
  ],
  imports: [
    CommonModule,
    InputsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ]
})
export class EmpresaTecnologicaModule { }
