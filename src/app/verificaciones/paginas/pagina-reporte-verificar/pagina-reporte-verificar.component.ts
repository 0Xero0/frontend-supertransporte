import { Component, OnInit, ViewChild } from '@angular/core';
import { ServicioVerificaciones } from '../../servicios/verificaciones.service';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, forkJoin } from 'rxjs';
import { Encuesta } from 'src/app/encuestas/modelos/Encuesta';
import { EncuestaComponent } from 'src/app/encuestas/componentes/encuesta/encuesta.component';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { DialogosVerificaciones } from '../../Dialogos';
import { HttpErrorResponse } from '@angular/common/http';
import { RespuestaInvalida } from 'src/app/encuestas/modelos/RespuestaInvalida';
import { ModalTerminarVerificacion } from '../../componentes/modal-terminar-verificacion.component';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { Rol } from 'src/app/autenticacion/modelos/Rol';
import { ModalAprobarObservacion } from 'src/app/encuestas/componentes/modal-aprobar-observacion/modal-aprobar-observacion.component';

@Component({
  selector: 'app-pagina-reporte-verificar',
  templateUrl: './pagina-reporte-verificar.component.html',
  styleUrls: ['./pagina-reporte-verificar.component.css']
})
export class PaginaReporteVerificarComponent implements OnInit {
  @ViewChild('popup') popup!: PopupComponent
  @ViewChild('componenteEncuesta') componenteEncuesta!: EncuestaComponent
  @ViewChild('modalTerminarVerificacion') modalTerminarVerificacion!: ModalTerminarVerificacion
  @ViewChild('modalAprobarObservacion') modalAprobarObservacion!: ModalAprobarObservacion

  noObligado: boolean = false
  encuesta?: Encuesta
  idVigilado?: string
  idEncuesta?: number
  idReporte?: number
  camposDeVerificacion: boolean = true
  camposDeVerificacionVisibles: boolean = true
  soloLectura: boolean = true
  hayCambios: boolean = false
  nit?: string
  razonSocial?: string
  estadoActual?: string
  clasificacionResolucion?: string

  esUsuarioAdministrador: boolean;
  observacionAdmin?: string
  aprobado?: boolean
  rol: Rol | null

  constructor(
    private servicioVerificaciones: ServicioVerificaciones,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private servicioLocalStorage: ServicioLocalStorage
  ) {
      this.rol = this.servicioLocalStorage.obtenerRol()
      this.esUsuarioAdministrador = this.rol!.id === '001' ? true : false;
    }

  ngOnInit(): void {
    combineLatest({
      params: this.activatedRoute.params,
      queryParams: this.activatedRoute.queryParams
    }).subscribe({
      next: (parametros) => {
        this.servicioVerificaciones.obtenerReporte(
          Number(parametros.queryParams['idEncuesta']),
          Number(parametros.params['idReporte']),
          parametros.queryParams['idVigilado']
        ).subscribe({
          next: (encuesta)=>{
            this.encuesta = encuesta
            this.nit = parametros.queryParams['idVigilado']
            this.razonSocial = ''
            this.estadoActual = ''
            this.clasificacionResolucion = encuesta.clasificaion
            this.idEncuesta = Number(parametros.queryParams['idEncuesta'])
            this.idReporte = Number(parametros.params['idReporte'])
            this.idVigilado = parametros.queryParams['idVigilado']
            this.soloLectura = !encuesta.encuestaEditable
            this.camposDeVerificacion = encuesta.verificacionEditable
            this.camposDeVerificacionVisibles = encuesta.verificacionVisible
            this.noObligado = encuesta.noObligado
          }
        })
      }
    })
  }

  abrirModalAprobarObservacion(aprobar: boolean){
    this.modalAprobarObservacion.abrir(aprobar)
  }

  aprobarVerificacion(aprobar: boolean){
    const observacion = document.getElementById('textArea') as HTMLTextAreaElement
    //console.log(aprobar)
    this.servicioVerificaciones.aprovarVerificacion(this.idReporte, aprobar, observacion.value).subscribe(
      {
        next: () =>  this.router.navigate(['/administrar', 'verificar-reportes'])
      }
    )
  }

  formatoPorcentajes(porcentaje: number){
    if(porcentaje % 1==0){
      return porcentaje
    }else{
      return porcentaje.toFixed(2)
    }
  }

  toggleCheckbox() {
    this.noObligado = !this.noObligado;
    this.manejarHayCambios(true)
  }

  guardarVerificaciones(){
    //console.log('verificar', this.noObligado)
    this.componenteEncuesta.guardarVerificaciones()
  }

  abrirModalTerminarVerificacion(){
    var estadoCheckbox = document.getElementById('check') as HTMLInputElement
    //console.log(respuesta.checked)
    if(estadoCheckbox.checked == true){
      this.modalTerminarVerificacion.abrir()
    }else{
      this.enviarVerificaciones()
    }
  }

  manejarHayCambios(hayCambios: boolean){
    this.hayCambios = hayCambios
  }

  enviarVerificaciones(){
    this.servicioVerificaciones.enviarVerificaciones(this.idEncuesta!, this.idReporte!, this.idVigilado!, this.noObligado!).subscribe({
      next: (respuesta)=>{
        this.popup.abrirPopupExitoso(DialogosVerificaciones.VERIFICACION_ENVIADA)
        this.router.navigateByUrl('/administrar/verificar-reportes')
      },
      error: (e: HttpErrorResponse)=>{
        if(e.status === 400){
          this.popup.abrirPopupFallido(
            DialogosVerificaciones.FALTAN_VERIFICACIONES_TITULO,
            DialogosVerificaciones.FALTAN_VERIFICACIONES_DESCRIPCION
          )
          this.componenteEncuesta.resaltarRespuestasInvalidas( e.error.faltantes.map( (faltante: number) =>{
            let respuestaFaltante: RespuestaInvalida = {
              preguntaId: faltante,
              archivoObligatorio: false
            }
            return respuestaFaltante
          }))
        }else{
          this.popup.abrirPopupFallido(
            DialogosVerificaciones.VERIFICACION_ENVIADA_ERROR_TITULO,
            DialogosVerificaciones.VERIFICACION_ENVIADA_ERROR_DESCRIPCION
          )
        }

      }
    })
  }
}
