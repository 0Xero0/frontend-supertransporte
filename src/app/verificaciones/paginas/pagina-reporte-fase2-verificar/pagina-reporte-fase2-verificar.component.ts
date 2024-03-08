import { Component, ViewChild } from '@angular/core';
import { EncuestaCuantitativa } from 'src/app/encuestas/modelos/EncuestaCuantitativa';
import { ServicioVerificaciones } from '../../servicios/verificaciones.service';
import { ActivatedRoute, Params } from '@angular/router';
import { combineLatest } from 'rxjs'
import { EncuestaCuantitativaComponent } from 'src/app/encuestas/componentes/encuesta-cuantitativa/encuesta-cuantitativa/encuesta-cuantitativa.component';
import { ServicioEncuestas } from 'src/app/encuestas/servicios/encuestas.service';

@Component({
  selector: 'app-pagina-reporte-fase2-verificar',
  templateUrl: './pagina-reporte-fase2-verificar.component.html',
  styleUrls: ['./pagina-reporte-fase2-verificar.component.css']
})
export class PaginaReporteFase2VerificarComponent {
  @ViewChild('encuesta') encuesta!: EncuestaCuantitativaComponent
  idEncuesta: number = 2
  idMes?: number
  vigencia?: number
  idReporte?: number
  idVigilado?: string
  historico: boolean = false
  reporte?: EncuestaCuantitativa
  hayCambios: boolean = false
  soloLectura: boolean = false

  constructor(
    private servicioVerificacion: ServicioVerificaciones,
    private servicioEncuesta: ServicioEncuestas, 
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
      }
    })
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
