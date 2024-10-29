import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { DialogosEncuestas } from 'src/app/encuestas/dialogos-encuestas';
import { EncuestaCuantitativa, Formulario, Pregunta } from 'src/app/encuestas/modelos/EncuestaCuantitativa';
import { Mes } from 'src/app/encuestas/modelos/Mes';
import { Respuesta } from 'src/app/encuestas/modelos/Respuesta';
import { RespuestaEvidencia } from 'src/app/encuestas/modelos/RespuestaEvidencia';
import { RespuestaVerificacionEvidencia } from 'src/app/encuestas/modelos/RespuestaVerificacionEvidencia';
import { ServicioEncuestas } from 'src/app/encuestas/servicios/encuestas.service';
import { Maestra } from 'src/app/verificaciones/modelos/Maestra';
import { ServicioVerificaciones } from 'src/app/verificaciones/servicios/verificaciones.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-encuesta-cuantitativa',
  templateUrl: './encuesta-cuantitativa.component.html',
  styleUrls: ['./encuesta-cuantitativa.component.css']
})
export class EncuestaCuantitativaComponent implements OnInit, OnChanges {
  @ViewChild('popup') popup!: PopupComponent

  @Input() historico: boolean = false
  @Input() encuesta!: EncuestaCuantitativa
  @Input() habilitarCamposVigilado: boolean = true
  @Input() habilitarCamposVerificador: boolean = false

  @Output() hanHabidoCambios: EventEmitter<boolean>
  @Output() cambioDeMes: EventEmitter<number> //Emite el id del mes
  @Output() formularioGuardado: EventEmitter<number>

  estadoRespuestas: Respuesta[] = [];
  hayCambios: boolean = false;
  respuestas: Respuesta[] = [];
  evidencias: RespuestaEvidencia[] = [];
  verificaciones: RespuestaVerificacionEvidencia[] = [];
  evidenciasFaltantes: number[] = [];
  indicadoresFaltantes: number[] = [];
  opcionesCumplimiento: Maestra[] = []
  opcionesCorrespondencia: Maestra[] = []
  meses: Mes[] = []
  idMes?: number

  constructor(private servicio: ServicioEncuestas, private servicioVerificacion: ServicioVerificaciones, private router: Router) {
    this.hanHabidoCambios = new EventEmitter<boolean>()
    this.cambioDeMes = new EventEmitter<number>()
    this.formularioGuardado = new EventEmitter<number>()
  }

  ngOnInit(): void {
    this.obtenerOpcionesCumplimientoYCorrespondencia()
    this.obtenerMeses(this.encuesta.vigencia, this.historico)
    this.encuesta.formularios.forEach(tab => {
      tab.subIndicador.forEach(subindicador => {
        subindicador.preguntas.forEach(pregunta => {
          this.estadoRespuestas.push(this.obtenerRespuesta(pregunta))
        })
      })
    })
  }

  ngOnChanges(cambios: SimpleChanges) {
    if (cambios['historico']) {
      this.obtenerMeses(this.encuesta.vigencia, this.historico)
    }
  }

  //Acciones
  guardar() {
    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      text: 'Espere por favor...',
    });
    Swal.showLoading(null);
    this.servicio.guardarRespuestasIndicadores(
      Number(this.encuesta.idReporte),
      this.respuestas,
      this.evidencias,
      this.idMes!
    ).subscribe({
      next: () => {
        Swal.close()
        this.setHayCambios(false)
        this.popup.abrirPopupExitoso(DialogosEncuestas.GUARDAR_ENCUESTA_EXITO)
        this.indicadoresFaltantes = []
        this.evidenciasFaltantes = []
        this.formularioGuardado.emit(this.idMes)
      },
      error: () => {
        Swal.close()
        this.popup.abrirPopupFallido(
          DialogosEncuestas.GUARDAR_ENCUESTA_ERROR_TITULO,
          DialogosEncuestas.GUARDAR_ENCUESTA_ERROR_DESCRIPCION
        )
      }
    })
  }

  guardarVerificacion() {
    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      text: 'Espere por favor...',
    });
    Swal.showLoading(null);
    this.servicioVerificacion.guardarVerificacionesFaseDos({
      idReporte: Number(this.encuesta.idReporte),
      vigencia: Number(this.encuesta.vigencia),
      evidencias: this.verificaciones
    }).subscribe({
      next: () => {
        Swal.close()
        this.setHayCambios(false)
        this.evidenciasFaltantes = []
        this.indicadoresFaltantes = []
        this.popup.abrirPopupExitoso(DialogosEncuestas.GUARDAR_ENCUESTA_EXITO)
        this.formularioGuardado.emit(this.idMes)
      },
      error: () => {
        Swal.close()
        this.popup.abrirPopupFallido(
          DialogosEncuestas.GUARDAR_ENCUESTA_ERROR_TITULO,
          DialogosEncuestas.GUARDAR_ENCUESTA_ERROR_DESCRIPCION
        )
      }
    })
  }

  enviar() {
    this.servicio.enviarRespuestaIndicadores(this.encuesta.idEncuesta, Number(this.encuesta.idReporte), this.encuesta.idVigilado, this.idMes!).subscribe({
      next: () => {
        this.popup.abrirPopupExitoso(DialogosEncuestas.ENVIAR_ENCUESTA_EXITO)
        this.router.navigateByUrl(`/administrar/encuestas/${this.encuesta.idEncuesta}`)
      },
      error: (error: HttpErrorResponse) => {
        this.evidenciasFaltantes = error.error.faltantesEvidencias
        this.indicadoresFaltantes = error.error.faltantesIndicadores
        this.popup.abrirPopupFallido('No se han respondido todas las preguntas.', 'Hay preguntas obligatorias sin responder.')
      }
    })
  }

  enviarVerificacion(){
    this.servicioVerificacion.enviarVerificacionesFaseDos({
      idEncuesta: Number(this.encuesta.idReporte),
      idMes: this.idMes!,
      idReporte: Number(this.encuesta.idReporte),
      idVigilado: this.encuesta.idVigilado
    }).subscribe({
      next: ()=>{
        this.popup.abrirPopupExitoso(DialogosEncuestas.ENVIAR_ENCUESTA_EXITO)
        this.router.navigateByUrl(`/administrar/verificar-reportes/fase-dos/reportes`)
      },
      error: (error: HttpErrorResponse)=>{
        this.popup.abrirPopupFallido('No se han respondido todas las preguntas.', 'Hay preguntas obligatorias sin responder.')
        this.evidenciasFaltantes = error.error.faltantes
      }
    })
  }

  //Manejadores de eventos
  manejarEvidenciaExcedeTamano(tamano: number) {
    this.popup.abrirPopupFallido('Limite de tamaño excedido.', `El archivo debe pesar como máximo ${tamano} megabytes.`)
  }

  manejarCambioDeMes(idMes: number) {
    this.setIdMes(idMes)
  }

  manejarNuevaEvidencia(respuesta: RespuestaEvidencia) {
    this.agregarEvidencia(respuesta)
    this.setHayCambios(true)
  }

  manejarNuevaRespuesta(respuesta: Respuesta) {
    this.agregarRespuesta(respuesta)
    this.setHayCambios(true)
  }

  manejarNuevaVerificacion(verificacion: RespuestaVerificacionEvidencia) {
    this.agregarVerificacion(verificacion)
    this.setHayCambios(true)
  }

  manejarErrorAlCambiarEvidencia(error: HttpErrorResponse) {
    this.popup.abrirPopupFallido(error.error.mensaje)
  }

  private agregarRespuesta(respuesta: Respuesta) {
    if (this.existeRespuesta(respuesta)) {
      this.eliminarRespuesta(respuesta)
    }
    this.respuestas.push(respuesta)
  }

  private agregarEvidencia(respuesta: RespuestaEvidencia) {
    if (this.existeEvidencia(respuesta)) {
      this.eliminarEvidencia(respuesta)
    }
    this.evidencias.push(respuesta)
  }

  private agregarVerificacion(verificacion: RespuestaVerificacionEvidencia) {
    if (this.existeVerificacion(verificacion)) {
      this.eliminarVerificacion(verificacion)
    }
    this.verificaciones.push(verificacion)
  }

  private existeRespuesta(respuesta: Respuesta): boolean {
    const idPreguntasRespondidas = this.respuestas.map(preguntaRespondida => preguntaRespondida.preguntaId)
    return idPreguntasRespondidas.includes(respuesta.preguntaId) ? true : false
  }

  private existeEvidencia(respuesta: RespuestaEvidencia): boolean {
    const idEvidenciasRespondidas = this.evidencias.map(evidenciasRespondidas => evidenciasRespondidas.evidenciaId)
    return idEvidenciasRespondidas.includes(respuesta.evidenciaId)
  }

  private existeVerificacion(verificacion: RespuestaVerificacionEvidencia): boolean {
    const idVerificacionesRespondidas = this.verificaciones.map(verificacionesRespondidas => verificacionesRespondidas.evidenciaId)
    return idVerificacionesRespondidas.includes(verificacion.evidenciaId)
  }

  private eliminarRespuesta(respuesta: Respuesta): void {
    this.respuestas = this.respuestas.filter(preguntaRespondida => {
      return preguntaRespondida.preguntaId !== respuesta.preguntaId ? true : false
    })
  }

  private eliminarEvidencia(respuesta: RespuestaEvidencia) {
    this.evidencias = this.evidencias.filter(evidenciaRespondida => {
      return evidenciaRespondida.evidenciaId !== respuesta.evidenciaId ? true : false
    })
  }

  private eliminarVerificacion(verificacion: RespuestaVerificacionEvidencia) {
    this.verificaciones = this.verificaciones.filter(verificacionRespondida => {
      return verificacionRespondida.evidenciaId !== verificacion.evidenciaId ? true : false
    })
  }

  private obtenerRespuesta(pregunta: Pregunta): Respuesta {
    return {
      preguntaId: pregunta.idPregunta,
      valor: pregunta.respuesta.toString() ?? "",
      documento: pregunta.documento,
      nombreArchivo: pregunta.nombreOriginal,
      observacion: pregunta.observacion,
      ruta: pregunta.ruta
    }
  }
  //Obtener informacion

  obtenerMeses(vigencia: number, historico: boolean) {
    this.servicio.obtenerMeses(vigencia, historico).subscribe({
      next: (respuesta) => {
        this.meses = respuesta.meses
        if (this.meses.length > 0) {
          this.idMes = this.meses[0].idMes
        }
      },
      error: (e) => {
        this.popup.abrirPopupFallido(DialogosEncuestas.ERROR_GENERICO_TITULO, DialogosEncuestas.ERROR_GENERICO_DESCRIPCION)
      }
    })
  }

  obtenerOpcionesCumplimientoYCorrespondencia() {
    this.servicioVerificacion.obtenerOpcionesCumplimiento().subscribe({
      next: (opciones) => {
        this.opcionesCumplimiento = opciones
      },
      error: () => {
        this.popup.abrirPopupFallido(
          DialogosEncuestas.ERROR_OPCIONES_CUMPLIMIENTO_TITULO,
          DialogosEncuestas.ERROR_OPCIONES_CUMPLIMIENTO_DESCRIPCION
        )
      }
    })
    this.servicioVerificacion.obtenerOpcionesCorrespondencia().subscribe({
      next: (opciones) => {
        this.opcionesCorrespondencia = opciones
      },
      error: () => {
        this.popup.abrirPopupFallido(
          DialogosEncuestas.ERROR_OPCIONES_CORRESPONDENCIA_TITULO,
          DialogosEncuestas.ERROR_OPCIONES_CORRESPONDENCIA_DESCRIPCION
        )
      }
    })
  }

  //Setters
  setHayCambios(tocada: boolean) {
    this.hayCambios = tocada
    this.hanHabidoCambios.emit(tocada)
  }

  setIdMes(idMes: number, emitirEvento: boolean = true) {
    this.idMes = idMes
    if (emitirEvento) this.cambioDeMes.emit(idMes);
  }
}
