import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pregunta } from '../../modelos/Encuesta';
import { Respuesta } from '../../modelos/Respuesta';
import { ArchivosEncuestasService } from '../../servicios/archivos-encuestas.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EncuestasService } from '../../servicios/encuestas.service';
import { Motivo } from '../../modelos/Motivo';
import { RespuestaVerificacion } from '../../modelos/RespuestaVerificacion';
import { ServicioVerificaciones } from 'src/app/verificaciones/servicios/verificaciones.service';
import { Maestra } from 'src/app/verificaciones/modelos/Maestra';

@Component({
  selector: 'app-pregunta-encuesta',
  templateUrl: './pregunta-encuesta.component.html',
  styleUrls: ['./pregunta-encuesta.component.css']
})
export class PreguntaEncuestaComponent implements OnInit {
  @Output('valorModificado') valorModificado: EventEmitter<Respuesta>
  @Output('nuevaVerificacion') nuevaVerificacion: EventEmitter<RespuestaVerificacion>
  @Output('haHabidoErrorArchivo') haHabidoErrorArchivo: EventEmitter<HttpErrorResponse> 

  @Input('pregunta') pregunta!: Pregunta
  @Input('idVigilado') idVigilado!: string
  @Input('soloLectura') soloLectura: boolean = true
  @Input('camposDeVerificacion') camposDeVerificacion: boolean = false
  @Input('justificable') justificable: boolean = false

  observacionEvidenciaCorrespondeDeshabilitado: boolean = false
  observacionDocumentoCumpleDeshabilitado:      boolean = false
  motivoDeshabilitado:               boolean = false
  archivoDeshabilitado:              boolean = false
  invalida:                          boolean = false

  motivos         : Motivo[] = []
  opcionesCorrespondencia: Maestra[] = []
  opcionesCumplimiento: Maestra[] = []
  valoresNegativos: string[] = ["N", "NO", "NO APLICA"]

  observacion:              string = ""
  observacionNoCorresponde: string = ""
  observacionNoCumple:      string = ""
  valor:                    string = ""
  nombreOriginalDocumento?: string
  nombreDocumento?:         string
  rutaDocumento?:           string
  documentoCumple:          number = 1
  evidenciaCorresponde:     number = 1

  documento: File | null = null
  clasesRespuestas = {}
  
  constructor(
    private servicioArchivos: ArchivosEncuestasService,
    private servicioEncuesta: EncuestasService,
    private servicioVerificaciones: ServicioVerificaciones
  ) { 
    this.valorModificado = new EventEmitter<Respuesta>();
    this.nuevaVerificacion = new EventEmitter<RespuestaVerificacion>();
    this.haHabidoErrorArchivo = new EventEmitter<HttpErrorResponse>() 
  }

  ngOnInit(): void {
    this.obtenerMotivos()
    this.obtenerOpcionesCorrespondencia()
    this.obtenerOpcionesCumplimiento()

    if(this.pregunta.corresponde && this.pregunta.corresponde != ""){
      this.setEvidenciaCorresponde(Number(this.pregunta.corresponde), false)
    }else{
      this.setEvidenciaCorresponde(undefined, false)
    }
    
    if(this.pregunta.cumple && this.pregunta.cumple != ""){
      this.setDocumentoCumple(Number(this.pregunta.cumple), false)
    }else{
      this.setDocumentoCumple(undefined, false)
    }
    this.setObservacionNoCorresponde(this.pregunta.observacionCorresponde, false)
    this.setObservacionNoCumple(this.pregunta.observacionCumple, false)
     
    this.pregunta.respuesta ? this.setValor(this.pregunta.respuesta, false) : ""
    this.clasesRespuestas = {
      'respuesta-positiva': this.pregunta.respuesta === 'SI' && this.soloLectura,
      'respuesta-negativa': this.pregunta.respuesta === 'NO' && this.soloLectura,
    }
  }

  //Obtener recursos
  obtenerMotivos(){
    this.motivos = this.servicioEncuesta.obtenerMotivos()
  }

  obtenerOpcionesCorrespondencia(){
    this.opcionesCorrespondencia = this.servicioVerificaciones.obtenerOpcionesCorrespondencia()
  }

  obtenerOpcionesCumplimiento(){
    this.opcionesCumplimiento = this.servicioVerificaciones.obtenerOpcionesCumplimiento()
  }

  //Manejadores de eventos
  alCambiarArchivo(){
    if(this.documento){
      this.guardarArchivoTemporal()
    }else{
      this.nombreDocumento = undefined
      this.nombreOriginalDocumento = undefined
      this.rutaDocumento = undefined
      this.emitirValorModificado()
    }
  }

  alCambiarRespuesta(respuesta: string){
    this.setValor(respuesta)
    this.emitirValorModificado()
  }

  alCambiarObservacion(){ //Motivo
    this.emitirValorModificado()
  }

  alCambiarEvidenciaCorresponde(corresponde: number){
    this.setEvidenciaCorresponde(corresponde)
  }

  alCambiarObservacionEvidenciaNoCorresponde(observacion: string){
    this.setObservacionNoCorresponde(observacion)
  }

  alCambiarDocumentoCumple(cumple: number){
    this.setDocumentoCumple(cumple)
  }

  alCambiarObservacionDocumentoNoCumple(observacion: string){
    this.setObservacionNoCumple(observacion)
  }
  //Acciones

  descargarArchivo(nombreArchivo: string, ruta: string, nombreOriginal: string){
    this.servicioArchivos.descargarArchivo(nombreArchivo, ruta, nombreOriginal)
  }

  guardarArchivoTemporal(){
    if(!this.documento){
      return;
    }
    this.servicioArchivos.guardarArchivoTemporal(this.documento, this.pregunta.idPregunta, this.idVigilado).subscribe({
      next: (archivo)=>{
        this.nombreDocumento = archivo.nombreAlmacenado
        this.nombreOriginalDocumento = archivo.nombreOriginalArchivo
        this.rutaDocumento = archivo.ruta
        this.emitirValorModificado()
      },
      error: (e: HttpErrorResponse)=>{
        this.haHabidoErrorArchivo.emit(e)
      }
    })
  }

  private emitirValorModificado(){
    this.valorModificado.emit({
      preguntaId: this.pregunta.idPregunta,
      valor: this.valor,
      documento: this.nombreDocumento,
      nombreArchivo: this.nombreOriginalDocumento,
      ruta: this.rutaDocumento,
      observacion: this.observacion
    })
  }

  private emitirVerificacion(){
    this.nuevaVerificacion.emit({
      corresponde: this.evidenciaCorresponde,
      cumple: this.documentoCumple,
      observacionCorresponde: this.observacionNoCorresponde,
      observacionCumple: this.observacionNoCumple,
      preguntaId: this.pregunta.idPregunta
    })
  }

  marcarInvalida(){
    this.invalida = true
  }

  marcarValida(){
    this.invalida = false
  }

  //Setters

  setValor(valor: string, dispararEvento: boolean = true){
    this.valor = valor
    if( this.valoresNegativos.includes(valor) ){
      this.setMotivoDeshabilitado(false)
      this.setArchivoDeshabilitado(true)
    }else{
      this.setMotivoDeshabilitado(true)
      this.setArchivoDeshabilitado(false)
    }
    if(dispararEvento) this.emitirVerificacion();
  }

  setMotivoDeshabilitado(motivoDeshabilitado: boolean){
    this.motivoDeshabilitado = motivoDeshabilitado
    if(motivoDeshabilitado && this.observacion != ""){
      this.observacion = ""
    }
  }

  setArchivoDeshabilitado(archivoDeshabilitado: boolean){
    this.archivoDeshabilitado = archivoDeshabilitado
    if(archivoDeshabilitado && this.documento != null){
      this.documento = null
    }
  }

  setDocumentoCumple(cumple: number = 0, dispararEvento: boolean = true){
    this.documentoCumple = cumple
    if(cumple == 2){
      this.setObservacionDocumentoCumpleDeshabilitado(false)
    }else{
      this.setObservacionDocumentoCumpleDeshabilitado(true)
    }
    if(dispararEvento) this.emitirVerificacion();
  }

  setObservacionNoCumple(observacion: string, dispararEvento: boolean = true){
    this.observacionNoCumple = observacion
    if(dispararEvento) this.emitirVerificacion();
  }

  setEvidenciaCorresponde(corresponde: number = 0, dispararEvento: boolean = true){
    this.evidenciaCorresponde = corresponde
    if(corresponde == 2){
      this.setObservacionEvidenciaCorrespondeDeshabilitado(false)
    }else{
      this.setObservacionEvidenciaCorrespondeDeshabilitado(true)
    }
    if(dispararEvento) this.emitirVerificacion();
  }

  setObservacionNoCorresponde(observacion: string, dispararEvento: boolean = true){
    this.observacionNoCorresponde = observacion
    if(dispararEvento) this.emitirVerificacion();
  }

  setObservacionDocumentoCumpleDeshabilitado(deshabilitado: boolean){
    this.observacionDocumentoCumpleDeshabilitado = deshabilitado
    if(deshabilitado){
      this.observacionNoCumple = ""
    }
  }

  setObservacionEvidenciaCorrespondeDeshabilitado(deshabilitado: boolean){
    this.observacionEvidenciaCorrespondeDeshabilitado = deshabilitado
    if(deshabilitado){
      this.observacionNoCorresponde = ""
    }
  }
}
