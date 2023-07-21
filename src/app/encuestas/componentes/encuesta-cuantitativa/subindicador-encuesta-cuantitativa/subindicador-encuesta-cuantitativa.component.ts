import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubIndicador } from 'src/app/encuestas/modelos/EncuestaCuantitativa';
import { Respuesta } from 'src/app/encuestas/modelos/Respuesta';

@Component({
  selector: 'app-subindicador-encuesta-cuantitativa',
  templateUrl: './subindicador-encuesta-cuantitativa.component.html',
  styleUrls: ['./subindicador-encuesta-cuantitativa.component.css']
})
export class SubindicadorEncuestaCuantitativaComponent implements OnInit {
  @Input('subindicador') subindicador!: SubIndicador
  @Input('estadoRespuestas') estadoRespuestas: Respuesta[] = []
  @Output('nuevaRespuesta') nuevaRespuesta: EventEmitter<Respuesta>
  respuestas: Respuesta[] = []

  constructor(){
    this.nuevaRespuesta = new EventEmitter<Respuesta>()
  }

  ngOnInit(): void {
  }

  manejarCambioRespuesta(respuesta: Respuesta){
    this.nuevaRespuesta.emit(respuesta)
  }
}
