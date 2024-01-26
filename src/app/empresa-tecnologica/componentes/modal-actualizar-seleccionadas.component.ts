import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { EmpresaTecnologicaService } from '../servicios/empresa-tecnologica.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmpresaTecnologica } from '../modelos/EmpresaTecnologica'; 
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { DateTime } from 'luxon';
import { PaginaEmpresaTecnologicaComponent } from '../pagina-empresa-tecnologica/pagina-empresa-tecnologica.component';

@Component({
  selector: 'app-modal-actualizar-seleccionadas',
  templateUrl: './modal-actualizar-seleccionadas.component.html',
  styleUrls: ['./modal-actualizar-seleccionadas.component.css']
})
export class ModalActualizarSeleccionadasComponent {
  @ViewChild('modal') modal!: ElementRef
  @ViewChild('popup') popup!: PopupComponent

  @Output('empresaActualizado') empresaActualizada: EventEmitter<void>;
  formulario: FormGroup
  empresas: EmpresaTecnologica[] = []
  seleccionadas: EmpresaTecnologica[] = []
  idEmpresa: string = ""
  nombre: string = ""
  fechaInicial: string = ""
  fechaFinal: string = ""

  constructor(private servicioModal: NgbModal, 
    private servicioEmpresaTecnologica: EmpresaTecnologicaService,
    private paginaEmpresaTecnologicaComponent: PaginaEmpresaTecnologicaComponent
    ){
    this.empresaActualizada = new EventEmitter<void>();
    this.formulario = new FormGroup({
      idEmpresa: new FormControl<string | undefined>("", [ Validators.required ]),
      nombre: new FormControl<string | undefined>("", [ Validators.required ]),
      fechaInicial: new FormControl<string | undefined>( "", [ Validators.required ] ),
      fechaFinal: new FormControl<string | undefined>( "", [ Validators.required ] ),
    })
  }

  abrir(seleccionadas: EmpresaTecnologica){
    this.rellenarFormulario(seleccionadas)
    this.servicioModal.open(this.modal, {
      size: 'xl'
    })
  }

  cerrar(){
    this.servicioModal.dismissAll();
  }

  actualizar(){
    console.log(this.formulario.controls)
    if(this.formulario.invalid){
      marcarFormularioComoSucio(this.formulario)
      return;
    }
    const controls = this.formulario.controls
    this.servicioEmpresaTecnologica.editar({
      idEmpresa: controls['idEmpresa'].value,
      nombre: '',
      fechaInicial: controls['fechaInicial'].value,
      fechaFinal: controls['fechaFinal'].value,
      idVigilado: 0,
      token: '',
      estado: false
    }).subscribe({
      next: ()=>{
        this.empresaActualizada.emit();
        this.cerrar()
        this.popup.abrirPopupExitoso('Actualización exitosa')
        this.paginaEmpresaTecnologicaComponent.empresasSeleccionadas()
      },
      error: ()=>{
        this.popup.abrirPopupFallido("Error al actualizar la asignación de la empresa", "Intentalo más tarde.")
      }
    })
  }

  rellenarFormulario(seleccionadas: EmpresaTecnologica){
    const controls = this.formulario.controls
    controls['idEmpresa'].setValue(seleccionadas.idEmpresa)
    controls['nombre'].setValue(seleccionadas.nombre)
    controls['fechaInicial'].setValue(DateTime.fromISO(seleccionadas.fechaInicial).toFormat('yyyy-MM-dd'))
    controls['fechaFinal'].setValue(DateTime.fromISO(seleccionadas.fechaFinal).toFormat('yyyy-MM-dd'))
  }

  limpiarFormulario(){
    this.formulario.reset()
  }

}
