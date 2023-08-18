import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { DialogosEncuestas } from 'src/app/encuestas/dialogos-encuestas';
import { EncuestaCuantitativa, Formulario, Pregunta } from 'src/app/encuestas/modelos/EncuestaCuantitativa';
import { Mes } from 'src/app/encuestas/modelos/Mes';
import { Respuesta } from 'src/app/encuestas/modelos/Respuesta';
import { RespuestaEvidencia } from 'src/app/encuestas/modelos/RespuestaEvidencia';
import { ServicioEncuestas } from 'src/app/encuestas/servicios/encuestas.service';

@Component({
  selector: 'app-encuesta-cuantitativa',
  templateUrl: './encuesta-cuantitativa.component.html',
  styleUrls: ['./encuesta-cuantitativa.component.css']
})
export class EncuestaCuantitativaComponent implements OnInit {
  @ViewChild('popup') popup!: PopupComponent
  @Input('encuesta') encuesta!: EncuestaCuantitativa
  @Input('idMesInicial') idMesInicial!: number
  @Output('hanHabidoCambios') hanHabidoCambios: EventEmitter<boolean>
  @Output('cambioDeMes') cambioDeMes: EventEmitter<number> //Emite el id del mes
  estadoRespuestas: Respuesta[] = [];
  hayCambios: boolean = false;
  respuestas: Respuesta[] = [];
  evidencias: RespuestaEvidencia[] = [];
  evidenciasFaltantes: number[] = [];
  indicadoresFaltantes: number[] = [];
  meses: Mes[] = []
  idMes?: number

  constructor(private servicio: ServicioEncuestas, private router: Router) {
    this.hanHabidoCambios = new EventEmitter<boolean>()
    this.cambioDeMes = new EventEmitter<number>()
  }

  ngOnInit(): void {
    this.obtenerMeses()
    this.setIdMes(this.idMesInicial, false)
    this.encuesta.formularios.forEach(tab => {
      tab.subIndicador.forEach(subindicador => {
        subindicador.preguntas.forEach(pregunta => {
          this.estadoRespuestas.push(this.obtenerRespuesta(pregunta))
        })
      })
    })
  }

  //Acciones
  guardar() {
    this.servicio.guardarRespuestasIndicadores(
      Number(this.encuesta.idReporte),
      this.respuestas,
      this.evidencias).subscribe({
        next: () => {
          this.setHayCambios(false)
          this.popup.abrirPopupExitoso(DialogosEncuestas.GUARDAR_ENCUESTA_EXITO)
        },
        error: () => {
          this.popup.abrirPopupFallido(
            DialogosEncuestas.GUARDAR_ENCUESTA_ERROR_TITULO,
            DialogosEncuestas.GUARDAR_ENCUESTA_ERROR_DESCRIPCION
          )
        }
      })
  }

  enviar() {
    this.servicio.enviarRespuestaIndicadores(this.encuesta.idEncuesta, Number(this.encuesta.idReporte), this.encuesta.idVigilado, this.idMes!).subscribe({
      next: ()=>{
        this.popup.abrirPopupExitoso(DialogosEncuestas.ENVIAR_ENCUESTA_EXITO)
        this.router.navigateByUrl(`/administrar/encuestas/${this.encuesta.idEncuesta}`)
      },
      error: (error: HttpErrorResponse)=>{
        this.evidenciasFaltantes = error.error.faltantesEvidencias
        this.indicadoresFaltantes = error.error.faltantesIndicadores
        this.popup.abrirPopupFallido('No se han respondido todas las preguntas.', 'Hay preguntas obligatorias sin responder.')
      }
    })
  }

  //Manejadores de eventos
  manejarEvidenciaExcedeTamano(tamano: number){
    this.popup.abrirPopupFallido('Limite de tamaño excedido.', `El archivo debe pesar como máximo ${tamano} megabytes.`)
  }

  manejarCambioDeMes(idMes: number) {
    const idMesActual = this.idMes
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

  manejarErrorAlCambiarEvidencia(error: HttpErrorResponse){
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

  private existeRespuesta(respuesta: Respuesta): boolean {
    const idPreguntasRespondidas = this.respuestas.map(preguntaRespondida => preguntaRespondida.preguntaId)
    return idPreguntasRespondidas.includes(respuesta.preguntaId) ? true : false
  }

  private existeEvidencia(respuesta: RespuestaEvidencia): boolean {
    const idEvidenciasRespondidas = this.evidencias.map(evidenciasRespondidas => evidenciasRespondidas.evidenciaId)
    return idEvidenciasRespondidas.includes(respuesta.evidenciaId)
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

  private obtenerRespuesta(pregunta: Pregunta): Respuesta {
    return {
      preguntaId: pregunta.idPregunta,
      valor: pregunta.respuesta ?? "",
      documento: pregunta.documento,
      nombreArchivo: pregunta.nombreOriginal,
      observacion: pregunta.observacion,
      ruta: pregunta.ruta
    }
  }
  //Obtener informacion

  obtenerMeses() {
    this.servicio.obtenerMeses().subscribe({
      next: (respuesta) => {
        this.meses = respuesta.meses
      },
      error: (e) => {
        this.popup.abrirPopupFallido(DialogosEncuestas.ERROR_GENERICO_TITULO, DialogosEncuestas.ERROR_GENERICO_DESCRIPCION)
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
