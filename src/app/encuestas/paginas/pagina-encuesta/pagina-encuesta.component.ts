import { Component, OnInit, ViewChild } from '@angular/core';
import { ServicioEncuestas } from '../../servicios/encuestas.service';
import { Encuesta } from '../../modelos/Encuesta';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { EncuestaComponent } from '../../componentes/encuesta/encuesta.component';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { EncuestaCuantitativa, Formulario } from '../../modelos/EncuestaCuantitativa';
import { EncuestaCuantitativaComponent } from '../../componentes/encuesta-cuantitativa/encuesta-cuantitativa/encuesta-cuantitativa.component';
import { DateTime } from 'luxon';
import { ModalConfirmarEnviarComponent } from '../../componentes/modal-confirmar-enviar/modal-confirmar-enviar.component';
import { DialogosEncuestas } from '../../dialogos-encuestas';
import { RespuestaInvalida } from '../../modelos/RespuestaInvalida';

@Component({
  selector: 'app-pagina-encuesta',
  templateUrl: './pagina-encuesta.component.html',
  styleUrls: ['./pagina-encuesta.component.css']
})
export class PaginaEncuestaComponent implements OnInit {
  @ViewChild('popup') popup!: PopupComponent
  @ViewChild('modalConfirmar') modalConfirmar!: ModalConfirmarEnviarComponent
  @ViewChild('componenteEncuesta') componenteEncuesta!: EncuestaComponent
  @ViewChild('componenteEncuestaCuantitativa') componenteEncuestaCuantitativa!: EncuestaCuantitativaComponent
  usuario?: Usuario | null
  encuesta?: Encuesta
  encuestaCuantitativa?: EncuestaCuantitativa 
  vigencia?: string
  idVigilado?: string
  idReporte?: number
  idUsuario: string
  idEncuesta?: number
  soloLectura: boolean = false
  camposDeVerificacion: boolean = false
  camposDeVerificacionVisibles: boolean = true
  hayCambios: boolean = false

  constructor(
    private servicioEncuesta: ServicioEncuestas, 
    private servicioLocalStorage: ServicioLocalStorage,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    this.usuario = this.servicioLocalStorage.obtenerUsuario()
    this.idUsuario = this.usuario!.usuario
    this.activeRoute.queryParams.subscribe({
      next: (qs) => {
        this.idVigilado = qs['vigilado']
        this.idReporte = Number(qs['reporte'])
      }
    })
    this.activeRoute.params.subscribe({
      next: (parametros)=>{
        this.idEncuesta = parametros['idEncuestaDiligenciada']
        if(this.idEncuesta == 2){
          this.obtenerEncuestaCuantitativa( this.obtenerIdMesActual() )
        }else{
          this.obtenerEncuesta()
        }
      }
    }) 
    
  }

  ngOnInit(): void {
  }

  //Acciones

  exportarPDF(){
    this.componenteEncuesta.exportarPDF()
  }

  exportarExcel(){
    if(!this.idReporte){
      this.popup.abrirPopupFallido('No se pudo exportar el reporte.', 'No se ha asignado un reporte para exportar.')
      return;
    }
    this.servicioEncuesta.exportarExcel(this.idReporte).subscribe({
      next: (response)=>{
        saveAs(response, 'datos.xlsx')
      },
      error: ()=>{
        this.popup.abrirPopupFallido('Ocurrio un error inesperado.', 'Intentalo más tarde.')
      }
    })
  }

  guardarEncuesta(){
    if(this.idEncuesta == 2){
      this.guardarEncuestaCuantitativa()
      return;
    }
    this.componenteEncuesta.guardarRespuestas()
  }

  guardarEncuestaCuantitativa(){
    this.componenteEncuestaCuantitativa.guardar()
  }

  enviarEncuestaCuantitativa(){
    this.componenteEncuestaCuantitativa.enviar()
  }

  enviarEncuesta(){
    if(this.idEncuesta == 2){
      this.enviarEncuestaCuantitativa()
      return;
    }
    if(!this.idEncuesta || !this.idReporte || !this.idVigilado){
      this.popup.abrirPopupFallido('Error', 'Faltan datos de la encuesta, el reporte o el vigilado')
      return;
    }

    this.servicioEncuesta.enviarRespuesta(this.idEncuesta!, this.idReporte!,  this.idVigilado!).subscribe({
      next: ()=>{
        this.popup.abrirPopupExitoso('Formulario enviado', 'El formulario se ha enviado correctamente.')
        this.router.navigate(['/administrar', 'encuestas', this.idEncuesta!])
      },
      error: (error: HttpErrorResponse)=>{
        const faltantes = error.error.faltantes as RespuestaInvalida[]
        this.componenteEncuesta.resaltarRespuestasInvalidas(faltantes)
        this.modalConfirmar.abrir({
          respuestasInvalidas: faltantes,
          alAceptar: ()=>{
            this.servicioEncuesta.enviarRespuesta(this.idEncuesta!, this.idReporte!,  this.idVigilado!, true).subscribe({
              next: ()=>{
                this.popup.abrirPopupExitoso('Formulario enviado', 'El formulario se ha enviado correctamente.')
                this.router.navigate(['/administrar', 'encuestas', this.idEncuesta!])
              },
              error: (error: HttpErrorResponse)=>{
                this.popup.abrirPopupFallido(
                  DialogosEncuestas.ENVIAR_ENCUESTA_ERROR_TITULO, 
                  DialogosEncuestas.ENVIAR_ENCUESTA_ERROR_DESCRIPCION
                )
              }
            })
          },
          alCancelar: ()=>{}
        })
      }
    })
  }

  //Obtener información
  obtenerEncuestaCuantitativa(idMes: number){
    this.servicioEncuesta.obtenerEncuestaCuantitativa(this.idReporte!, this.idVigilado!, idMes).subscribe({
      next: (encuesta)=>{
        this.encuestaCuantitativa = encuesta
        this.soloLectura = false
        this.vigencia = encuesta.vigencia
      }
    })
  }

  obtenerIdMesActual(): number{
    return DateTime.now().month
  }

  obtenerEncuesta(){
    this.servicioEncuesta.obtenerEncuesta(this.idVigilado!, this.idEncuesta!, this.idReporte!).subscribe({
      next: ( encuesta )=>{
        this.encuesta = encuesta
        this.soloLectura = !encuesta.encuestaEditable
        this.camposDeVerificacion = encuesta.verificacionEditable
        this.camposDeVerificacionVisibles = encuesta.verificacionVisible
      }
    })
  }

  //Setters
  setHayCambios(hayCambios: boolean){
    this.hayCambios = hayCambios
  }

}
