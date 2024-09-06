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
import { HttpErrorResponse } from '@angular/common/http';
import { ArchivoGuardado } from 'src/app/archivos/modelos/ArchivoGuardado';
import Swal from 'sweetalert2';
import { ServicioArchivos } from 'src/app/archivos/servicios/archivos.service';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';

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

  contrato?:ArchivoGuardado
  tamanoMaximoMb:number = 5
  usuario:Usuario | null

  constructor(
    private servicioEmpresaTecnologica: EmpresaTecnologicaService,
    private servicioArchivos: ServicioArchivos,
    private servicioLocalStorage: ServicioLocalStorage
  ){
    this.usuario = servicioLocalStorage.obtenerUsuario()
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
    if(this.idEmpresa === "" || this.fechaInicial === "" || this.fechaFinal === "" || this.contrato === undefined){
      this.popup.abrirPopupFallido("Debe rellenar todos los campos antes de asignar")
    }else{
      this.servicioEmpresaTecnologica.asignar(this.idEmpresa,this.fechaInicial,this.fechaFinal,this.contrato!).subscribe({
        next: (respuesta)=>{
          console.log(respuesta)
          this.limpiarForm()
          this.empresasSeleccionadas()
        },
        error: (error)=>{
          this.popup.abrirPopupFallido('Ya existe un registro con esta empresa')
        }
      })
    }
  }

  abrirModalActualizarSeleccionada(seleccionadas: EmpresaTecnologica){
    this.modalActualizarSeleccionadas.abrir(seleccionadas)
  }

  cambiarEstado(idEmpresa: string, estado: boolean){
    console.log(idEmpresa,estado)
    this.servicioEmpresaTecnologica.activar(idEmpresa).subscribe({
      next: (respuesta)=>{
        this.empresasSeleccionadas()
      },
      error: (error)=>{
        this.popup.abrirPopupFallido("Ocurrió un error inesperado", error)
      }
    })
  }

  guardarArchivo(event:any,codigo?:string){
    if(event){
      Swal.fire({
        icon: 'info',
        allowOutsideClick: false,
        text: 'Espere por favor...',
      });
      Swal.showLoading(null);
      console.log(this.tamanoValido(event.target.files[0]))
      if(this.tamanoValido(event.target.files[0])){
        this.servicioArchivos.guardarArchivo(event.target.files[0], 'contratos', this.usuario?.usuario!).subscribe({
          next: (archivo:any)=>{
            Swal.close()
            this.contrato = archivo
            console.log(this.contrato)
          }
        })
      }else{
        Swal.fire({icon: 'error', titleText: '¡Error alcargar el archivo!',text:'El tamaño máximo del archivo debe ser de hasta '+this.tamanoMaximoMb+'Mb.'});
      }
    }
  }

  manejarRemoverArchivo(input:HTMLInputElement,event:any,codigo?:string){
    input.value = ''
    event.preventDefault();
    this.contrato = undefined
    //this.removeFile(codigo)
  }

  private tamanoValido(archivo: File): boolean{
    if(this.tamanoMaximoMb){
      return this.tamanoMaximoMb * 1048576 >= archivo.size ? true : false
    }else{
      return true
    }
  }

  limpiarForm(){
    this.idEmpresa = ''
    this.fechaInicial = ''
    this.fechaFinal = ''
    this.contrato = undefined
  }
}
