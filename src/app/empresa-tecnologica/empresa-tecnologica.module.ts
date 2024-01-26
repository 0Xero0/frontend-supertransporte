import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { InputsModule } from '../inputs/inputs.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginaEmpresaTecnologicaComponent } from './pagina-empresa-tecnologica/pagina-empresa-tecnologica.component';
import { PipesModule } from "../pipes/pipes.module";
import { AlertasModule } from '../alertas/alertas.module';
import { ModalActualizarSeleccionadasComponent } from './componentes/modal-actualizar-seleccionadas.component';



@NgModule({
    declarations: [
        PaginaEmpresaTecnologicaComponent,
        ModalActualizarSeleccionadasComponent
    ],
    imports: [
        CommonModule,
        InputsModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        PipesModule,
        AlertasModule,
    ]
})
export class EmpresaTecnologicaModule { }
