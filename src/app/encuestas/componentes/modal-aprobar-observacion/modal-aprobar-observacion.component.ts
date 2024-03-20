import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { PaginaEncuestaComponent } from '../../paginas/pagina-encuesta/pagina-encuesta.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modal-aprobar-observacion',
    templateUrl: './modal-aprobar-observacion.component.html',
    styleUrls: ['./modal-aprobar-observacion.component.css']
  })
  export class ModalAprobarObservacion implements OnInit {
    @ViewChild('popup') popup!: PopupComponent
    @ViewChild('modal') modal!: ElementRef

    mensaje: string = ''
    aprobar: boolean = false

    constructor(
        private servicioModal: NgbModal,
        private paginaEncuesta: PaginaEncuestaComponent
        ){}

    ngOnInit(): void {}

    abrir(aprobar: boolean){
        this.aprobar = aprobar
        this.servicioModal.open(this.modal, {
            size: 'x1',
        })
    }
    cerrar(){
        this.servicioModal.dismissAll();
    }

    aprobarObservacion(aprobar: boolean){
        this.paginaEncuesta.aprobarVerificacion(aprobar)
        this.cerrar()
    }
  }