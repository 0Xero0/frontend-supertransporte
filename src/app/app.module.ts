import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdministradorModule } from './administrador/administrador.module';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorAutorizacion } from './administrador/interceptores/InterceptorAutorizacion';
import { AlertasModule } from './alertas/alertas.module';
import { InputsModule } from './inputs/inputs.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AsignacionesModule } from './asignaciones/asignaciones.module';
import { FormulariosModule } from './formularios/formularios.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    AdministradorModule,
    AutenticacionModule,
    AsignacionesModule,
    FormulariosModule,
    AlertasModule,
    InputsModule,
    SweetAlert2Module.forRoot(),
  ],
  exports:[
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorAutorizacion,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
