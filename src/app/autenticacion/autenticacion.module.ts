import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InicioSesionComponent } from './componentes/inicio-sesion/inicio-sesion.component';
import { HttpClientModule } from '@angular/common/http'
import { NgxCaptchaModule } from 'ngx-captcha';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ModalRecuperacionContrasenaComponent } from './componentes/modal-recuperacion-contrasena/modal-recuperacion-contrasena.component';
import { ActualizarContrasenaComponent } from './componentes/actualizar-contrasena/actualizar-contrasena.component';
import { SoporteAccesoComponent } from './componentes/soporte-acceso/soporte-acceso.component';
import { AlertasModule } from '../alertas/alertas.module';
import { InputsModule } from '../inputs/inputs.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    InicioSesionComponent,
    ModalRecuperacionContrasenaComponent,
    ActualizarContrasenaComponent,
    SoporteAccesoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgxCaptchaModule,
    NgbModule,
    InputsModule,
    SweetAlert2Module.forRoot(),
    AlertasModule,
    RouterModule
  ]
})
export class AutenticacionModule { }
