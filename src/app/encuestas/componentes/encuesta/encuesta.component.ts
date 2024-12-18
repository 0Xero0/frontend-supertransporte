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
import { Maestra } from 'src/app/verificaciones/modelos/Maestra';
import { DialogosEncuestas } from '../../dialogos-encuestas';
import { Motivo } from '../../modelos/Motivo';
import Swal from 'sweetalert2';

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
  @Input('camposDeVerificacionVisibles') camposDeVerificacionVisibles: boolean = true
  @Input('noObligado') noObligado: boolean = false
  @Output('hanHabidoCambios') hanHabidoCambios: EventEmitter<boolean>
  @ViewChildren('clasificacion') clasificaciones!: QueryList<ClasificacionEncuestaComponent>
  @ViewChild('popup') popup!: PopupComponent
  @ViewChild('contenedorEncuesta') contenedorEncuesta!: ElementRef
  respuestas: Respuesta[] = []
  verificaciones: RespuestaVerificacion[] = []
  hayCambios: boolean = false
  opcionesCumplimiento: Maestra[] = []
  opcionesCorrespondencia: Maestra[] = []
  motivos: Motivo[] = []

  constructor(
    private servicioEncuestas: ServicioEncuestas,
    private servicioVerificacion: ServicioVerificaciones
  ){
    this.hanHabidoCambios = new EventEmitter<boolean>();
    console.log(this.noObligado,'encuenta')
  }

  ngOnInit(): void {
    this.obtenerMotivos()
    this.obtenerOpcionesCumplimientoYCorrespondencia()
  }

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

  obtenerOpcionesCumplimientoYCorrespondencia(){
    this.servicioVerificacion.obtenerOpcionesCumplimiento().subscribe({
      next: (opciones)=>{
        this.opcionesCumplimiento = opciones
      },
      error: ()=>{
        this.popup.abrirPopupFallido(
          DialogosEncuestas.ERROR_OPCIONES_CUMPLIMIENTO_TITULO,
          DialogosEncuestas.ERROR_OPCIONES_CUMPLIMIENTO_DESCRIPCION
        )
      }
    })
    this.servicioVerificacion.obtenerOpcionesCorrespondencia().subscribe({
      next: (opciones)=>{
        this.opcionesCorrespondencia = opciones
      },
      error: ()=>{
        this.popup.abrirPopupFallido(
          DialogosEncuestas.ERROR_OPCIONES_CORRESPONDENCIA_TITULO,
          DialogosEncuestas.ERROR_OPCIONES_CORRESPONDENCIA_DESCRIPCION
        )
      }
    })
  }

  obtenerMotivos(){
    this.servicioEncuestas.obtenerMotivos().subscribe({
      next: (motivos) =>{
        this.motivos = motivos
      }
    })
  }

  //Manejadores de eventos
  alResponderPreguntas(respuestas: any){
    this.setHayCambios(true)
  }

  alResponderVerificaciones(verificacion: any){
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
    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      text: 'Espere por favor...',
    });
    Swal.showLoading(null);
    this.servicioEncuestas.guardarRespuesta(this.idReporte, { respuestas: this.obtenerRespuestas() }).subscribe({
      next: ( respuesta ) =>{
        Swal.close()
        this.popup.abrirPopupExitoso(respuesta.mensaje)
        this.limpiarResaltado()
        this.setHayCambios(false)
      },
      error: (error: HttpErrorResponse) =>{
        Swal.close()
        this.popup.abrirPopupFallido('Error', error.error.message)
      }
    })

  }

  guardarVerificaciones(){
    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      text: 'Espere por favor...',
    });
    Swal.showLoading(null);
    this.servicioVerificacion.guardarVerificaciones(this.idReporte, this.obtenerVerificaciones(), this.noObligado).subscribe({
      next: ( respuesta: any ) =>{
        Swal.close()
        this.popup.abrirPopupExitoso('Se han guardado las verificaciones')
        this.limpiarResaltado()
        this.setHayCambios(false)
      },
      error: (error: HttpErrorResponse) =>{
        Swal.close()
        this.popup.abrirPopupFallido('Error', error.error.message)
      }
    })
  }

  resaltarRespuestasInvalidas(invalidas: RespuestaInvalida[]){ //reemplazar esto por un observable
    this.clasificaciones.forEach( clasificacion =>{
      clasificacion.resaltarRespuestasInvalidas(invalidas)
    })
  }

  limpiarResaltado(){
    this.clasificaciones.forEach( clasificacion =>{
      clasificacion.limpiarResaltado()
    } )
  }

  exportarPDF(){
    window.print()
  }

  setHayCambios(hayCambios: boolean){
    this.hayCambios = hayCambios
    this.hanHabidoCambios.emit(hayCambios)
  }
}
