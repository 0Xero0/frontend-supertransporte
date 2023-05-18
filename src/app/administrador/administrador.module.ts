import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministradorRoutingModule } from './administrador-routing.module';
import { PlantillaComponent } from './componentes/plantilla/plantilla.component';
import { MenuComponent } from './componentes/menu/menu.component';
import { BarraNavegacionComponent } from './componentes/barra-navegacion/barra-navegacion.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { EncuestasModule } from '../encuestas/encuestas.module';



@NgModule({
  declarations: [
    PlantillaComponent,
    MenuComponent,
    BarraNavegacionComponent,
  ],
  imports: [
    CommonModule,
    AdministradorRoutingModule,
    EncuestasModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    SweetAlert2Module.forRoot(),
  ],
  exports:[]
})
export class AdministradorModule { }
