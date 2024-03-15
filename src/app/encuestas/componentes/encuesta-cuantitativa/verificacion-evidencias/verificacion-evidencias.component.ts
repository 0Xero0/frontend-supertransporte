import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EncuestaCuantitativa, Evidencia } from 'src/app/encuestas/modelos/EncuestaCuantitativa';
import { RespuestaVerificacionEvidencia } from 'src/app/encuestas/modelos/RespuestaVerificacionEvidencia';
import { Maestra } from 'src/app/verificaciones/modelos/Maestra';
import { PaginaReporteFase2VerificarComponent } from 'src/app/verificaciones/paginas/pagina-reporte-fase2-verificar/pagina-reporte-fase2-verificar.component';

@Component({
  selector: 'app-verificacion-evidencias',
  templateUrl: './verificacion-evidencias.component.html',
  styleUrls: ['./verificacion-evidencias.component.css']
})
export class VerificacionEvidenciasComponent implements OnInit{
  @Input() evidencia!: Evidencia
  @Input() reporte!: EncuestaCuantitativa
  @Input() opcionesCumplimiento: Maestra[] = []
  @Input() opcionesCorrespondencia: Maestra[] = []
  @Input() habilitarCamposVerificador: boolean = false

  @Output('nuevaVerificacion') nuevaVerificacion: EventEmitter<RespuestaVerificacionEvidencia>

  cumple: number = 0
  observacionCumple: string = ""
  corresponde: number = 0
  observacionCorresponde: string = ""
  soloLecturaV: string = "false"

  constructor(){
    this.nuevaVerificacion = new EventEmitter<RespuestaVerificacionEvidencia>();
  }

  ngOnInit(): void {
    this.cumple = Number(this.evidencia.cumple)
    this.corresponde = Number(this.evidencia.corresponde)
    this.observacionCorresponde = this.evidencia.observacionCorresponde 
    this.observacionCumple = this.evidencia.observacionCumple
    this.soloLecturaV =  localStorage.getItem("soloLecturaV")??"false"
  }

  manejarCambioCorresponde(corresponde: number, evidenciaId: number){
    if(corresponde == 1){
      this.observacionCorresponde = ""
    }
    this.nuevaVerificacion.emit({
      evidenciaId: evidenciaId,
      corresponde: corresponde,
      cumple: this.cumple,
      observacionCorresponde: this.observacionCorresponde,
      observacionCumple: this.observacionCumple
    })
  }
  manejarCambioObservacionCorresponde(observacion: string, evidenciaId: number){
    this.nuevaVerificacion.emit({
      evidenciaId: evidenciaId,
      corresponde: this.corresponde,
      cumple: this.cumple,
      observacionCorresponde: observacion,
      observacionCumple: this.observacionCumple
    })
  }
  manejarCambioCumple(cumple: number, evidenciaId: number){
    if(cumple == 1){
      this.observacionCumple = ""
    }
    this.nuevaVerificacion.emit({
      evidenciaId: evidenciaId,
      corresponde: this.corresponde,
      cumple: cumple,
      observacionCorresponde: this.observacionCorresponde,
      observacionCumple: this.observacionCumple
    })
  }
  manejarCambioObservacionCumple(observacion: string, evidenciaId: number){
    this.nuevaVerificacion.emit({
      evidenciaId: evidenciaId,
      corresponde: this.corresponde,
      cumple: this.cumple,
      observacionCorresponde: this.observacionCorresponde,
      observacionCumple: observacion
    })
  }
}
