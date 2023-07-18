import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DateTime } from 'luxon';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { DialogosEncuestas } from 'src/app/encuestas/dialogos-encuestas';
import { Formulario, Pregunta } from 'src/app/encuestas/modelos/Formulario';
import { Mes } from 'src/app/encuestas/modelos/Mes';
import { Respuesta } from 'src/app/encuestas/modelos/Respuesta';
import { ServicioEncuestas } from 'src/app/encuestas/servicios/encuestas.service';

@Component({
  selector: 'app-encuesta-cuantitativa',
  templateUrl: './encuesta-cuantitativa.component.html',
  styleUrls: ['./encuesta-cuantitativa.component.css']
})
export class EncuestaCuantitativaComponent implements OnInit {
  @ViewChild('popup') popup!: PopupComponent
  @Input('formularios') formularios!: Formulario[]
  @Input('idMesInicial') idMesInicial!: number
  @Output('tocada') hanHabidoCambios: EventEmitter<boolean>
  @Output('cambioDeMes') cambioDeMes: EventEmitter<number> //Emite el id del mes
  estadoRespuestas: Respuesta[] = [];
  hayCambios: boolean = false;
  respuestas: Respuesta[] = [];
  meses: Mes[] = []
  idMes?: number
  
  constructor(private servicio: ServicioEncuestas){
    this.hanHabidoCambios = new EventEmitter<boolean>()
    this.cambioDeMes = new EventEmitter<number>()
  }

  ngOnInit(): void {
    this.obtenerMeses()
    this.setIdMes(this.idMesInicial, false) 
    this.formularios.forEach( tab => {
      tab.subIndicador.forEach( subindicador =>{
        subindicador.preguntas.forEach( pregunta =>{
          this.estadoRespuestas.push( this.obtenerRespuesta(pregunta) )
        })
      })
    })
  }

  //Acciones
  guardar(){
    this.servicio.guardarRespuestasIndicadores(2, this.respuestas).subscribe({
      next: ()=>{
        this.popup.abrirPopupExitoso(DialogosEncuestas.GUARDAR_ENCUESTA_EXITO)
      },
      error: ()=>{
        this.popup.abrirPopupFallido(
          DialogosEncuestas.GUARDAR_ENCUESTA_ERROR_TITULO, 
          DialogosEncuestas.GUARDAR_ENCUESTA_ERROR_DESCRIPCION
        )
      }
    })
  }

  enviar(){
    this.popup.abrirPopupExitoso(DialogosEncuestas.ENVIAR_ENCUESTA_EXITO)
  }

  //Manejadores de eventos
  manejarCambioDeMes(idMes: number){
    const idMesActual = this.idMes
    this.setIdMes(idMes)
  }

  manejarNuevaRespuesta(respuesta: Respuesta){
    this.agregarRespuesta(respuesta)
    this.setHayCambios(true)
  }

  private agregarRespuesta(respuesta: Respuesta){
    if(this.existeRespuesta(respuesta)){
      this.eliminarRespuesta(respuesta)
    }
    this.respuestas.push(respuesta)
  }

  private existeRespuesta(respuesta: Respuesta):boolean{
    const idPreguntasRespondidas = this.respuestas.map( preguntaRespondida => preguntaRespondida.preguntaId )
    return idPreguntasRespondidas.includes( respuesta.preguntaId ) ? true : false
  }

  private eliminarRespuesta(respuesta: Respuesta): void{
    this.respuestas = this.respuestas.filter( preguntaRespondida => { 
      return preguntaRespondida.preguntaId !== respuesta.preguntaId ? true : false
    })
  }

  private obtenerRespuesta(pregunta: Pregunta): Respuesta{
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

  obtenerMeses(){
    this.servicio.obtenerMeses().subscribe({
      next: (respuesta)=>{
        this.meses = respuesta.meses
      },
      error: (e)=>{
        this.popup.abrirPopupFallido(DialogosEncuestas.ERROR_GENERICO_TITULO, DialogosEncuestas.ERROR_GENERICO_DESCRIPCION)
      }
    })
  }

  //Setters
  setHayCambios(tocada: boolean){
    this.hayCambios = tocada
    this.hanHabidoCambios.emit(tocada)
  }

  setIdMes(idMes: number, emitirEvento: boolean = true){
    this.idMes = idMes
    if(emitirEvento) this.cambioDeMes.emit(idMes);
  }
}
