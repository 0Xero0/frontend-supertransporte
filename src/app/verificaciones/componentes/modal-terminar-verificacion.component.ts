import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { PaginaReporteVerificarComponent } from '../paginas/pagina-reporte-verificar/pagina-reporte-verificar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modal-terminar-verificacion',
    templateUrl: './modal-terminar-verificacion.component.html',
    styleUrls: ['./modal-terminar-verificacion.component.css']
  })
  export class ModalTerminarVerificacion implements OnInit {
    @ViewChild('popup') popup!: PopupComponent
    @ViewChild('modal') modal!: ElementRef
    //@ViewChild('paginaReporteVerificar') paginaReporteVerificar!: PaginaReporteVerificarComponent
    estadoObligado?: boolean

    constructor(
        private servicioModal: NgbModal,
        private paginaReporteVerificar: PaginaReporteVerificarComponent
        ){}

    ngOnInit(): void {
        this.estadoObligado = this.paginaReporteVerificar.noObligado
    }

    abrir(){
        this.servicioModal.open(this.modal, {
            size: 'x2'
        })
    }
    cerrar(){
        this.servicioModal.dismissAll();
    }

    terminarVerificacion(){
        this.paginaReporteVerificar.enviarVerificaciones()
        this.cerrar()
    }
  }