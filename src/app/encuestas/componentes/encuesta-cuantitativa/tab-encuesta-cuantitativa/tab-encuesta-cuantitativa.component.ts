import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Evidencia, SubIndicador } from 'src/app/encuestas/modelos/EncuestaCuantitativa';
import { Respuesta } from 'src/app/encuestas/modelos/Respuesta';
import { RespuestaEvidencia } from 'src/app/encuestas/modelos/RespuestaEvidencia';

@Component({
  selector: 'app-tab-encuesta-cuantitativa',
  templateUrl: './tab-encuesta-cuantitativa.component.html',
  styleUrls: ['./tab-encuesta-cuantitativa.component.css']
})
export class TabEncuestaCuantitativaComponent implements OnInit{
  @Input('idVigilado') idVigilado!: string
  @Input('subindicadores') subindicadores: SubIndicador[] = []
  @Input('evidencias') evidencias: Evidencia[] = []
  @Input('mensaje') mensaje!: string
  @Input('estadoRespuestas') estadoRespuestas: Respuesta[] = []
  @Input() evidenciasFaltantes: number[] = []
  @Input() indicadoresFaltantes: number[] = []

  @Output('nuevaRespuesta') nuevaRespuesta: EventEmitter<Respuesta>
  @Output('nuevaEvidencia') nuevaEvidencia: EventEmitter<RespuestaEvidencia>
  @Output('evidenciaExcedeTamano') evidenciaExcedeTamano: EventEmitter<number>
  @Output('errorAlCargarEvidencia') errorAlCargarEvidencia: EventEmitter<HttpErrorResponse>
  respuestas: Respuesta[] = [];
  

  constructor(){
    this.nuevaRespuesta = new EventEmitter<Respuesta>();
    this.nuevaEvidencia = new EventEmitter<RespuestaEvidencia>();
    this.evidenciaExcedeTamano = new EventEmitter<number>();
    this.errorAlCargarEvidencia = new EventEmitter<HttpErrorResponse>();
  }

  ngOnInit(): void {}

  manejarEvidenciaExcedeTamano(tamano: number){
    this.evidenciaExcedeTamano.emit(tamano)
  }

  manejarNuevaRespuesta(respuesta: Respuesta){
    this.nuevaRespuesta.emit(respuesta)
  }

  manejarNuevaEvidencia(respuesta: RespuestaEvidencia){
    this.nuevaEvidencia.emit(respuesta)
  }

  manejarErrorAlCargar(error: HttpErrorResponse){
    this.errorAlCargarEvidencia.emit(error)
  }
}
