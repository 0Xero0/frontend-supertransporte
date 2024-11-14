import { Component, ViewChild } from '@angular/core';
import { EncuestaCuantitativa } from 'src/app/encuestas/modelos/EncuestaCuantitativa';
import { EnviadoSt } from 'src/app/encuestas/modelos/EncuestaCuantitativa';
import { ServicioVerificaciones } from '../../servicios/verificaciones.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { combineLatest } from 'rxjs'
import { EncuestaCuantitativaComponent } from 'src/app/encuestas/componentes/encuesta-cuantitativa/encuesta-cuantitativa/encuesta-cuantitativa.component';
import { ServicioEncuestas } from 'src/app/encuestas/servicios/encuestas.service';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { Rol } from 'src/app/autenticacion/modelos/Rol';
import { ModalAprobarObservacion2 } from '../../modal-aprobar-observacion/modal-aprobar-observacion.component';

@Component({
  selector: 'app-pagina-reporte-fase2-verificar',
  templateUrl: './pagina-reporte-fase2-verificar.component.html',
  styleUrls: ['./pagina-reporte-fase2-verificar.component.css']
})
export class PaginaReporteFase2VerificarComponent {
  @ViewChild('encuesta') encuesta!: EncuestaCuantitativaComponent
  @ViewChild('modalAprobarObservacion2') modalAprobarObservacion2!: ModalAprobarObservacion2
  idEncuesta: number = 2
  idMes?: number
  vigencia?: number
  idReporte?: number
  idVigilado?: string
  historico: boolean = false
  reporte?: EncuestaCuantitativa
  hayCambios: boolean = false
  soloLectura: boolean = false
  soloLecturaV: boolean = false
  envioSt?: EnviadoSt
  evidenciaEntregada?: string
  variablesEntregadas?: string
  rol: Rol | null
  esUsuarioAdministrador: boolean;
  observacionAdmin?: string
  aprobado?: boolean

  constructor(
    private servicioVerificacion: ServicioVerificaciones,
    private servicioEncuesta: ServicioEncuestas,
    private router: Router,
    private servicioLocalStorage: ServicioLocalStorage,
    private activedRoute: ActivatedRoute){
    combineLatest({
      parametros: this.activedRoute.params,
      query: this.activedRoute.queryParams
    }).subscribe({
      next: ({ parametros, query})=>{
        this.recogerParametrosUrl(parametros, query)
        this.servicioEncuesta.obtenerMeses(this.vigencia!,this.historico).subscribe({
          next: (respuesta) => {
            this.obtenerReporte(respuesta.meses[0].idMes)
          }
        })
      }
    })
    this.rol = this.servicioLocalStorage.obtenerRol()
    this.esUsuarioAdministrador = this.rol!.id === '001' ? true : false;
  }

  obtenerReporte(idMes: number){
    this.servicioVerificacion.obtenerReporteFaseDos({
      idEncuesta: this.idEncuesta,
      idMes: idMes,
      idReporte: this.idReporte!,
      idVigilado: this.idVigilado!
    }).subscribe({
      next: (reporte)=>{
        this.reporte = reporte
        this.soloLectura = reporte.soloLectura
        this.soloLecturaV = reporte.soloLecturaV
        this.evidenciaEntregada = reporte.evidenciasEntregadas.toFixed(2)
        this.variablesEntregadas = reporte.variablesEntregadas.toFixed(2)
        localStorage.removeItem("soloLecturaV")
        localStorage.setItem("soloLecturaV",reporte.soloLecturaV.toString())
        this.envioSt = reporte.enviadosSt[idMes-1]
        this.habilitarEnvioSt()
      }
    })
  }

  abrirModalAprobarObservacion(aprobar: boolean){
    this.modalAprobarObservacion2.abrir(aprobar,2)
  }

  aprobarVerificacion(aprobar: boolean){
    const observacion = document.getElementById('textArea') as HTMLTextAreaElement
    //console.log(aprobar)
    this.servicioVerificacion.aprovarVerificacion(this.idReporte, aprobar, observacion.value).subscribe(
      {
        next: () =>  this.router.navigate(['/administrar', 'verificar-reportes','fase-dos', 'reportes'])
      }
    )
  }

  habilitarEnvioSt(){
    if(this.envioSt?.envioSt === 'NO' || this.soloLecturaV){
      this.setHayCambios(true)
    }else{
      this.setHayCambios(false)
    }
  }

  guardarVerificacion(){
    this.encuesta.guardarVerificacion()
  }

  enviarVerificacion(){
    this.encuesta.enviarVerificacion()
  }

  recogerParametrosUrl(parametros: Params, query: Params){
    this.idReporte = parametros['idReporte']
    this.idMes = query['idMes']
    this.vigencia = Number(query['vigencia'])
    this.idVigilado = query['idVigilado']
  }

  setHayCambios(hayCambios: boolean){
    this.hayCambios = hayCambios
  }

  manejarFormularioGuardado(idMes: number){
    this.obtenerReporte(idMes)
  }
}
