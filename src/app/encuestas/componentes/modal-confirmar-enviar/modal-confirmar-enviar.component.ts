import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CausasModal } from 'src/app/compartido/CausasModal';
import { RespuestaInvalida } from '../../modelos/RespuestaInvalida';

@Component({
  selector: 'app-modal-confirmar-enviar',
  templateUrl: './modal-confirmar-enviar.component.html',
  styleUrls: ['./modal-confirmar-enviar.component.css']
})
export class ModalConfirmarEnviarComponent {
  @ViewChild('modal', { static: true }) modal!: ElementRef;
  respuestasInvalidas: RespuestaInvalida[] = []
  mensajeItemsInvalidos = ""

  constructor(private servicioModal: NgbModal) { 
  }

  abrir({alAceptar, alCancelar, respuestasInvalidas}: {respuestasInvalidas: RespuestaInvalida[], alAceptar: Function, alCancelar: Function}){
    this.respuestasInvalidas = respuestasInvalidas
    this.mensajeItemsInvalidos = respuestasInvalidas.map(res => res.preguntaId).join(", ")
    this.servicioModal.open(this.modal, { centered: true, size: 'lg' }).result.then(
      (_) => {},
      (reason) => {
        console.log(reason);
        if(reason === CausasModal.ACEPTAR){
          alAceptar();
        }else if(reason === CausasModal.CANCELAR){
          alCancelar();
        }
      }
    );
  }

  aceptar(){
    this.servicioModal.dismissAll(CausasModal.ACEPTAR);
  }

  cerrar(){
    this.servicioModal.dismissAll(CausasModal.CANCELAR);
  }

}
