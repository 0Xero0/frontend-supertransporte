import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Autenticable } from 'src/app/administrador/servicios/compartido/Autenticable';
import { environment } from 'src/environments/environment';
import { ResumenReporteAsignados } from '../modelos/ResumenReporteAsignado';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { Encuesta } from 'src/app/encuestas/modelos/Encuesta';
import { Maestra } from '../modelos/Maestra';
import { RespuestaVerificacion } from 'src/app/encuestas/modelos/RespuestaVerificacion';

@Injectable({
  providedIn: 'root'
})
export class ServicioVerificaciones extends Autenticable{

  private readonly host = environment.urlBackend
  private opcionesCumplimiento: Maestra[] = []
  private opcionesCorrespondencia: Maestra[] = []

  constructor(private clienteHttp: HttpClient) { 
    super() 
    this.buscarOpcionesCumplimiento()
    this.buscarOpcionesCorrespondencia()
  }

  guardarVerificaciones(idReporte: number, verificaciones: RespuestaVerificacion[]){
    const endpoint = '/api/v1/respuestas/verificar'
    return this.clienteHttp.post(
      `${this.host}${endpoint}`, 
      { idReporte: idReporte, respuestas: verificaciones }, 
      { headers: this.obtenerCabeceraAutorizacion() }
    )
  }

  obtenerReportes(pagina: number, limite: number, filtros: any){
    const endpoint = `/api/v1/reportes/asignados?pagina=${pagina}&limite=${limite}`
    return this.clienteHttp.get<{asignadas: ResumenReporteAsignados[], paginacion: Paginacion}>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  obtenerReporte(idEncuesta: number, idReporte: number, idVigilado: string){
    const endpoint = `/api/v1/reportes/visualizar?idEncuesta=${idEncuesta}&idReporte=${idReporte}&idVigilado=${idVigilado}`
    return this.clienteHttp.get<Encuesta>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  obtenerOpcionesCumplimiento(): Maestra[]{
    return this.opcionesCumplimiento
  }

  obtenerOpcionesCorrespondencia(): Maestra[]{
    return this.opcionesCorrespondencia
  }

  private buscarOpcionesCumplimiento(){
    const endpoint = '/api/v1/validador/lista-cumple'
    return this.clienteHttp.get<Maestra[]>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
    .subscribe({
      next: (opciones)=>{
        this.opcionesCumplimiento = opciones
      }
    })
  }

  private buscarOpcionesCorrespondencia(){
    const endpoint = '/api/v1/validador/lista-corresponde'
    return this.clienteHttp.get<Maestra[]>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
    .subscribe({
      next: (opciones)=>{
        this.opcionesCorrespondencia = opciones
      }
    })
  }

}
