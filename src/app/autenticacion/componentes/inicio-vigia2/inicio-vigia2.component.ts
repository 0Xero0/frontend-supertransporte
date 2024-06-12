import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { IniciarSesionRespuesta } from '../../modelos/IniciarSesionRespuesta';
import { AutenticacionService } from '../../servicios/autenticacion.service';
import { ModalRecuperacionContrasenaComponent } from '../modal-recuperacion-contrasena/modal-recuperacion-contrasena.component';
import { environment } from 'src/environments/environment';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';

@Component({
  selector: 'app-inicio-vigia2',
  templateUrl: './inicio-vigia2.component.html',
  styleUrls: ['./inicio-vigia2.component.css']
})
export class InicioVigia2Component {
  @ViewChild('popup') popup!: PopupComponent
  public readonly llaveCaptcha = environment.llaveCaptcha

  token: string | null = null

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void{
    // Obtener el token de la URL
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');
      console.log('Token:', this.token);
      // Aquí puedes hacer algo con el token, como almacenarlo en el localStorage
      if (this.token) {
        localStorage.setItem('authToken', this.token);
      }
    });
  }

}
