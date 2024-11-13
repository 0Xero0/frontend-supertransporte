import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginaReporteVerificarComponent } from '../paginas/pagina-reporte-verificar/pagina-reporte-verificar.component';
import { PaginaReporteFase2VerificarComponent } from '../paginas/pagina-reporte-fase2-verificar/pagina-reporte-fase2-verificar.component';

@Component({
    selector: 'app-modal-aprobar-observacion2',
    templateUrl: './modal-aprobar-observacion.component.html',
    styleUrls: ['./modal-aprobar-observacion.component.css']
  })
  export class ModalAprobarObservacion2 implements OnInit {
    @ViewChild('popup') popup!: PopupComponent
    @ViewChild('modal') modal!: ElementRef

    mensaje: string = ''
    aprobar: boolean = false
    fase?: number

    constructor(
        private servicioModal: NgbModal,
        private ReporteVerificar: PaginaReporteVerificarComponent,
        private ReporteVerificarFase2: PaginaReporteFase2VerificarComponent
        ){}

    ngOnInit(): void {}

    abrir(aprobar: boolean, fase:number){
        this.aprobar = aprobar
        this.fase = fase
        this.servicioModal.open(this.modal, {
            size: 'x1',
        })
    }
    cerrar(){
        this.servicioModal.dismissAll();
    }

    aprobarObservacion(aprobar: boolean, fase?: number){
      //console.log(aprobar,fase)
      if(fase === 1){
        this.ReporteVerificar.aprobarVerificacion(aprobar)
      }
      else if(fase === 2) {
        //console.log(aprobar,fase)
        this.ReporteVerificarFase2.aprobarVerificacion(aprobar)
      }
      this.cerrar()
    }
  }
