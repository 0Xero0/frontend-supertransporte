import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Autenticable } from 'src/app/administrador/servicios/compartido/Autenticable';
import { environment } from 'src/environments/environment';
import { ResumenReporteAsignado } from '../modelos/ResumenReporteAsignado';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { Encuesta } from 'src/app/encuestas/modelos/Encuesta';
import { Maestra } from '../modelos/Maestra';
import { RespuestaVerificacion } from 'src/app/encuestas/modelos/RespuestaVerificacion';
import { Observable } from 'rxjs';
import { ResumenReporteFaseDosAsignado } from '../modelos/ResumenReporteFaseDosAsignado';
import { EncuestaCuantitativa } from 'src/app/encuestas/modelos/EncuestaCuantitativa';
import { RespuestaVerificacionEvidencia } from 'src/app/encuestas/modelos/RespuestaVerificacionEvidencia';

@Injectable({
  providedIn: 'root'
})
export class ServicioVerificaciones extends Autenticable{

  private readonly host = environment.urlBackend
  private opcionesCumplimiento: Maestra[] = []
  private opcionesCorrespondencia: Maestra[] = []

  constructor(private clienteHttp: HttpClient) { 
    super() 
  }

  guardarVerificaciones(idReporte: number, verificaciones: RespuestaVerificacion[], noObligado:boolean){
    const endpoint = '/api/v1/respuestas/verificar'
    console.log(noObligado)
    return this.clienteHttp.post(
      `${this.host}${endpoint}`, 
      { idReporte: idReporte, respuestas: verificaciones, noObligado: noObligado }, 
      { headers: this.obtenerCabeceraAutorizacion() }
    )
  }

  guardarVerificacionesFaseDos({ idReporte, vigencia, evidencias }: { idReporte: number, vigencia: number, evidencias: RespuestaVerificacionEvidencia[] }){
    const endpoint = '/api/v1/inidicador/verificar'
    return this.clienteHttp.post(
      `${this.host}${endpoint}`, 
      { idReporte, anio: vigencia, evidencias },
      { headers: this.obtenerCabeceraAutorizacion() }
    )
  }

  enviarVerificaciones(idEncuesta: number, idReporte: number, idVigilado: string, noObligado: boolean){
    const endpoint = `/api/v1/respuestas/finalizar-verificacion`
    return this.clienteHttp.post<{mensaje: string}>(`${this.host}${endpoint}`, {idEncuesta, idReporte, idVigilado, noObligado}, { headers: this.obtenerCabeceraAutorizacion() })
  }

  enviarVerificacionesFaseDos({ idEncuesta, idReporte, idMes, idVigilado }:{ idEncuesta: number, idReporte: number, idMes: number, idVigilado: string }){
    const endpoint = `/api/v1/respuestas/finalizar-verificacion-fasedos`
    return this.clienteHttp.post(
      `${this.host}${endpoint}`, 
      { idReporte, idEncuesta, idMes, idVigilado },
      { headers: this.obtenerCabeceraAutorizacion() }
    )
  }

  obtenerReportes(pagina: number, limite: number, filtros: any){
    const endpoint = `/api/v1/reportes/asignados?pagina=${pagina}&limite=${limite}`
    return this.clienteHttp.get<{asignadas: ResumenReporteAsignado[], paginacion: Paginacion}>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }
  //To do: cambiar el tipado de los filtros
  obtenerReportesFaseDos(pagina: number, limite: number, filtros?: { idVerificador: string }){
    let endpoint = `/api/v1/reportes/asignados-fasedos?pagina=${pagina}&limite=${limite}`
    if(filtros?.idVerificador){
      endpoint+= `&idVerificador=${filtros.idVerificador}`
    }
    return this.clienteHttp.get<{ asignadas: ResumenReporteFaseDosAsignado[], paginacion: Paginacion }>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  obtenerReporte(idEncuesta?: number, idReporte?: number, idVigilado?: string){
    const endpoint = `/api/v1/reportes/visualizar?idEncuesta=${idEncuesta}&idReporte=${idReporte}&idVigilado=${idVigilado}`
    return this.clienteHttp.get<Encuesta>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  obtenerReporteFaseDos({
    idEncuesta,
    idReporte,
    idVigilado,
    idMes
  }: {
    idEncuesta: number,
    idReporte: number,
    idVigilado: string,
    idMes: number
  }){
    const endpoint = `/api/v1/reportes/formularios?idEncuesta=${idEncuesta}&idReporte=${idReporte}&idVigilado=${idVigilado}&idMes=${idMes}`
    return this.clienteHttp.get<EncuestaCuantitativa>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  obtenerOpcionesCumplimiento(): Observable<Maestra[]>{
    const endpoint = '/api/v1/validador/lista-cumple'
    return this.clienteHttp.get<Maestra[]>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  obtenerOpcionesCorrespondencia(): Observable<Maestra[]>{
    const endpoint = '/api/v1/validador/lista-corresponde'
    return this.clienteHttp.get<Maestra[]>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

}
