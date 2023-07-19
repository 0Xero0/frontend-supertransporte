import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Encuesta } from '../../modelos/Encuesta';
import { ClasificacionEncuestaComponent } from '../clasificacion-encuesta/clasificacion-encuesta.component';
import { Respuesta } from '../../modelos/Respuesta';
import { ServicioEncuestas } from '../../servicios/encuestas.service';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { RespuestaInvalida } from '../../modelos/RespuestaInvalida';
import { RespuestaVerificacion } from '../../modelos/RespuestaVerificacion';
import { ServicioVerificaciones } from 'src/app/verificaciones/servicios/verificaciones.service';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})
export class EncuestaComponent implements OnInit {
  @Input('encuesta') encuesta!: Encuesta
  @Input('idReporte') idReporte!: number
  @Input('idEncuesta') idEncuesta!: number
  @Input('idVigilado') idVigilado!: string
  @Input('soloLectura') soloLectura: boolean = true
  @Input('justificable') justificable: boolean = false
  @Input('camposDeVerificacion') camposDeVerificacion: boolean = false
  @Output('hanHabidoCambios') hanHabidoCambios: EventEmitter<boolean>
  @ViewChildren('clasificacion') clasificaciones!: QueryList<ClasificacionEncuestaComponent>
  @ViewChild('popup') popup!: PopupComponent
  @ViewChild('contenedorEncuesta') contenedorEncuesta!: ElementRef
  respuestas: Respuesta[] = []
  verificaciones: RespuestaVerificacion[] = []
  hayCambios: boolean = false
  
  constructor(
    private servicioEncuestas: ServicioEncuestas,
    private servicioVerificacion: ServicioVerificaciones,
    private router: Router
  ) {
    this.hanHabidoCambios = new EventEmitter<boolean>();
  }

  ngOnInit(): void {}

  //Obtener recursos
  obtenerRespuestas(): Respuesta[]{
    this.respuestas = []
    this.clasificaciones.forEach(clasificacion => {
      this.respuestas = [ ...this.respuestas, ...clasificacion.obtenerRespuestas()]
    })
    return this.respuestas
  }

  obtenerVerificaciones(): RespuestaVerificacion[]{
    this.verificaciones = []
    this.clasificaciones.forEach(clasificacion => {
      this.verificaciones = [ ...this.verificaciones, ...clasificacion.obtenerVerificaciones()]
    })
    return this.verificaciones
  }
  
  //Manejadores de eventos
  alResponderPreguntas(respuestas: any){
    this.setHayCambios(true)
  }

  manejarErrorCargaArchivo(error: HttpErrorResponse){
    this.popup.abrirPopupFallido('Error al cargar el archivo', 'Intentalo más tarde.')
  }

  manejarArchivoExcedeTamano(tamano: number){
    this.popup.abrirPopupFallido('Limite de tamaño excedido.', `El archivo debe pesar como máximo ${tamano} megabytes.`)
  }

  //Acciones
  guardarRespuestas(){
    this.servicioEncuestas.guardarRespuesta(this.idReporte, { respuestas: this.obtenerRespuestas() }).subscribe({
      next: ( respuesta ) =>{
        this.popup.abrirPopupExitoso(respuesta.mensaje)
        this.router.navigate(['/administrar','encuestas', this.idEncuesta])
      },
      error: (error: HttpErrorResponse) =>{
        this.popup.abrirPopupFallido('Error', error.error.message)
      }
    })

  }

  guardarVerificaciones(){
    this.servicioVerificacion.guardarVerificaciones(this.idReporte, this.obtenerVerificaciones()).subscribe({
      next: ( respuesta: any ) =>{
        this.popup.abrirPopupExitoso('Se han guardado las verificaciones')
      },
      error: (error: HttpErrorResponse) =>{
        this.popup.abrirPopupFallido('Error', error.error.message)
      }
    })
  }

  resaltarRespuestasInvalidas(invalidas: RespuestaInvalida[]){ //reemplazar esto por un observable
    this.clasificaciones.forEach( clasificacion =>{
      clasificacion.resaltarRespuestasInvalidas(invalidas)
    })
  }

  exportarPDF(){
    window.print()
  }

  setHayCambios(hayCambios: boolean){
    this.hayCambios = hayCambios
    this.hanHabidoCambios.emit(hayCambios)
  }
}
