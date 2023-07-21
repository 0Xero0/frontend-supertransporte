import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pregunta } from 'src/app/encuestas/modelos/EncuestaCuantitativa';
import { Respuesta } from 'src/app/encuestas/modelos/Respuesta';

@Component({
  selector: 'app-pregunta-encuesta-cuantitativa',
  templateUrl: './pregunta-encuesta-cuantitativa.component.html',
  styleUrls: ['./pregunta-encuesta-cuantitativa.component.css']
})
export class PreguntaEncuestaCuantitativaComponent implements OnInit {
  @Input('pregunta') pregunta!: Pregunta
  @Output('cambio') cambio: EventEmitter<Respuesta>
  valor: string = "";

  constructor(){
    this.cambio = new EventEmitter<Respuesta>();
  }
  
  ngOnInit(): void {
    this.setValor(this.pregunta.respuesta, false)
  }

  manejarCambio(valor: string){
    this.setValor(valor)
  }

  setValor(valor: string, emitirEvento: boolean = true){
    this.valor = valor
    if(emitirEvento) this.cambio.emit({
      preguntaId: this.pregunta.idPregunta,
      valor: this.valor
    });
  }
}
