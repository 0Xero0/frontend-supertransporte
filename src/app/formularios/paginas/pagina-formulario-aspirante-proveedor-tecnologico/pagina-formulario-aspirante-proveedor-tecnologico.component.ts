import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { ServicioFormularios } from '../../servicios/formularios.service';
import { ServicioArchivos } from 'src/app/archivos/servicios/archivos.service';
import { ArchivoGuardado } from 'src/app/archivos/modelos/ArchivoGuardado';

@Component({
  selector: 'app-pagina-formulario-aspirante-proveedor-tecnologico',
  templateUrl: './pagina-formulario-aspirante-proveedor-tecnologico.component.html',
  styleUrls: ['./pagina-formulario-aspirante-proveedor-tecnologico.component.css']
})
export class PaginaFormularioAspiranteProveedorTecnologicoComponent implements OnInit{
  @ViewChild('popup') popup!: PopupComponent

  formulario: FormGroup
  documentoCertificacion?: ArchivoGuardado
  documentoCamara?: ArchivoGuardado

  constructor(private servicio: ServicioFormularios, private servicioArchivos: ServicioArchivos){
    this.formulario = new FormGroup({
      razon_social: new FormControl('', [ Validators.required ]),
      nit: new FormControl('', [ Validators.required ]),
      dv: new FormControl('', [ Validators.required ]),
      sigla: new FormControl('', [ Validators.required ]),
      estado_matricula: new FormControl('', [ Validators.required ]),
      correo_notificacion: new FormControl('', [ Validators.required ]),
      direccion: new FormControl('', [ Validators.required ]),
      
      nombres_rep_legal: new FormControl('', [ Validators.required ]),
      apellidos_rep_legal: new FormControl('', [ Validators.required ]),
      tipo_documento_rep_legal: new FormControl('', [ Validators.required ]),
      identificacion_rep_legal: new FormControl('', [ Validators.required ]),
      numero_contacto_rep_legal: new FormControl('', [ Validators.required ]),
      correo_rep_legal: new FormControl('', [ Validators.required ]),
      direccion_rep_legal: new FormControl('', [ Validators.required ]),
      
      nombres_cont_tecnico: new FormControl('', [ Validators.required ]),
      apellidos_cont_tecnico: new FormControl('', [ Validators.required ]),
      tipo_documento_cont_tecnico: new FormControl('', [ Validators.required ]),
      identificacion_cont_tecnico: new FormControl('', [ Validators.required ]),
      numero_contacto_cont_tecnico: new FormControl('', [ Validators.required ]),
      correo_cont_tecnico: new FormControl('', [ Validators.required ]),
      direccion_cont_tecnico: new FormControl('', [ Validators.required ]),

      doc_certificacion: new FormControl(null, [ Validators.required ]),
      doc_camara: new FormControl(null, [ Validators.required ]),
    })
  }

  ngOnInit(): void {
    this.formulario.get('doc_certificacion')?.valueChanges.subscribe({
      next: (valor: File | null)=>{
        this.manejarCambioDocumentoCertificacion(valor)
      }
    })

    this.formulario.get('doc_camara')?.valueChanges.subscribe({
      next: (valor: File | null)=>{
        this.manejarCambioDocumentoCamara(valor)
      }
    })
  }

  enviarFormulario(){
    if(this.formulario.invalid){
      marcarFormularioComoSucio(this.formulario)
      this.popup.abrirPopupFallido('Formulario inválido.', 'Rellena todos los campos correctamente.')
      return;
    }
    const controles = this.formulario.controls
    this.servicio.enviarFormularioAspiranteTecnologico({
      razonSocial: controles['razon_social'].value,
      nit: controles['nit'].value,
      dv: controles['dv'].value,
      sigla: controles['sigla'].value,
      estadoMatricula: controles['estado_matricula'].value,
      correoNotificacion: controles['correo_notificacion'].value,
      direccion: controles['direccion'].value,

      nombresRepLegal: controles['nombres_rep_legal'].value,
      apellidosRepLegal: controles['apellidos_rep_legal'].value,
      correoRepLegal: controles['correo_rep_legal'].value,
      direccionRepLegal: controles['direccion_rep_legal'].value,
      numeroContactoRepLegal: controles['numero_contacto_rep_legal'].value,
      tipoDocumentoRepLegal: controles['tipo_documento_rep_legal'].value,
      identificacionRepLegal: controles['identificacion_rep_legal'].value,
    
      nombresContTecnico: controles['nombres_cont_tecnico'].value,
      apellidosContTecnico: controles['apellidos_cont_tecnico'].value,
      correoContTecnico: controles['correo_cont_tecnico'].value,
      direccionContTecnico: controles['direccion_cont_tecnico'].value,
      numeroContactoContTecnico: controles['numero_contacto_cont_tecnico'].value,
      tipoDocumentoContTecnico: controles['tipo_documento_cont_tecnico'].value,
      identificacionContTecnico: controles['identificacion_cont_tecnico'].value,
      
      docCamaraNombre: this.documentoCamara ? this.documentoCamara.nombreAlmacenado : '',
      docCamaraNombreOriginal: this.documentoCamara ? this.documentoCamara.nombreOriginalArchivo : '',
      docCamaraRuta: this.documentoCamara ? this.documentoCamara.ruta : '',

      docCertificacionNombre: this.documentoCertificacion ? this.documentoCertificacion.nombreAlmacenado : '',
      docCertificacionNombreOriginal: this.documentoCertificacion ? this.documentoCertificacion.nombreOriginalArchivo : '',
      docCertificacionRuta: this.documentoCertificacion ? this.documentoCertificacion.ruta : ''
    }).subscribe({
      next: (aspirante)=>{
        this.popup.abrirPopupExitoso('Formulario enviado correctamente.')
        this.formulario.reset()
      },
      error: (error)=>{
        this.popup.abrirPopupFallido('Ha ocurrido un error.', 'Intentalo más tarde.')
      }
    })
  }

  manejarCambioDocumentoCamara(file: File | null){
    if(file){
      this.guardarArchivoCamara(file)
    }
  }

  manejarCambioDocumentoCertificacion(file: File | null){
    if(file){
      this.guardarArchivoCertificacion(file)
    }
  }

  guardarArchivoCamara(file: File){
    this.servicioArchivos.guardarArchivo(file, 'proveedor', this.formulario.get('nit')!.value).subscribe({
      next: (archivo)=>{
        this.documentoCamara = archivo
      }
    })
  }

  guardarArchivoCertificacion(file: File){
    this.servicioArchivos.guardarArchivo(file, 'proveedor', this.formulario.get('nit')!.value).subscribe({
      next: (archivo)=>{
        this.documentoCertificacion = archivo
      }
    })
  }

}
