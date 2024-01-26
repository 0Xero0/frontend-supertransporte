import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { ActivatedRoute, Router } from '@angular/router';
//import { Observable } from 'rxjs';
//import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmpresaTecnologicaService } from '../servicios/empresa-tecnologica.service';
import { EmpresaTecnologica } from '../modelos/EmpresaTecnologica';
import { ModalActualizarSeleccionadasComponent } from '../componentes/modal-actualizar-seleccionadas.component';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-pagina-empresa-tecnologica',
  templateUrl: './pagina-empresa-tecnologica.component.html',
  styleUrls: ['./pagina-empresa-tecnologica.component.css']
})
export class PaginaEmpresaTecnologicaComponent {
  @ViewChild('modalActualizarSeleccionadas') modalActualizarSeleccionadas!: ModalActualizarSeleccionadasComponent
  @ViewChild('modal') modal!: ElementRef
  @ViewChild('popup') popup!: PopupComponent

  formulario: FormGroup
  empresas: EmpresaTecnologica[] = []
  seleccionadas: EmpresaTecnologica[] = []
  idEmpresa: string = ""
  nombre: string = ""
  fechaInicial: string = ""
  fechaFinal: string = ""

  constructor(
    private servicioEmpresaTecnologica: EmpresaTecnologicaService){
    this.listarEmpresas()
    this.empresasSeleccionadas()
    this.formulario = new FormGroup({
      nombre: new FormControl<string | undefined>("", [ Validators.required ]),
      fechaInicial: new FormControl<string | undefined>( "", [ Validators.required ] ),
      fechaFinal: new FormControl<string | undefined>( "", [ Validators.required ] ),
    })
  }
  

  listarEmpresas(){
    this.servicioEmpresaTecnologica.listarEmpresas().subscribe({
      next: (empresas)=>{
        this.empresas = empresas
      }
    })
  }

  empresasSeleccionadas(){
    //console.log(this.seleccionadas)
    this.servicioEmpresaTecnologica.seleccionadas().subscribe({
      next: (seleccionadas)=>{
        this.seleccionadas = seleccionadas
      }
    });
  }

  asignarEmpresa(){
    console.log(this.idEmpresa, this.fechaInicial, this.fechaFinal)
    if(this.idEmpresa === "" || this.fechaInicial === "" || this.fechaFinal === ""){
      this.popup.abrirPopupFallido("Debe rellenar todos los campos antes de asignar")
    }else{
      this.servicioEmpresaTecnologica.asignar(this.idEmpresa,this.fechaInicial,this.fechaFinal).subscribe({
        next: (respuesta)=>{
          console.log(respuesta)
          this.empresasSeleccionadas()
        },
        error: (error)=>{
          this.popup.abrirPopupFallido("Ocurrió un error inesperado")
        }
      })
    }
  }

  abrirModalActualizarSeleccionada(seleccionadas: EmpresaTecnologica){
    this.modalActualizarSeleccionadas.abrir(seleccionadas)
  }

  cambiarEstado(idEmpresa: string, estado: boolean){
    console.log(idEmpresa,estado)
    if(estado === false){
      estado = true
      console.log(idEmpresa, estado)
      this.servicioEmpresaTecnologica.activar(idEmpresa).subscribe({
        next: (respuesta)=>{
          //console.log(respuesta)
          this.empresasSeleccionadas() 
        },
        error: (error)=>{
          this.popup.abrirPopupFallido("Ocurrió un error inesperado", error)
        }
      })
    }else{
      estado = false
      console.log(idEmpresa, estado)
      this.empresasSeleccionadas()
    }
    
    
  }
}
