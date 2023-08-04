import { Injectable } from '@angular/core';
import { Encuesta } from '../modelos/Encuesta';
import { HttpClient } from '@angular/common/http';
import { ResumenReporte } from '../modelos/ResumenReporte';
import { environment } from 'src/environments/environment';
import { Autenticable } from 'src/app/administrador/servicios/compartido/Autenticable';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { RespuestaEnviar } from '../modelos/RespuestaEnviar';
import { Motivo } from '../modelos/Motivo';
import { EncuestaCuantitativa, Formulario } from '../modelos/EncuestaCuantitativa';
import { Observable } from 'rxjs';
import { Mes } from '../modelos/Mes';
import { RespuestaEvidencia } from '../modelos/RespuestaEvidencia';
import { FiltrosReportes } from '../modelos/FiltrosReportes';

@Injectable({
  providedIn: 'root'
})
export class ServicioEncuestas extends Autenticable {

  private readonly host = environment.urlBackend
  private motivos: Motivo[] = []

  constructor(private http: HttpClient) {
    super()
    this.establecerMotivos()
  }

  obtenerMeses():Observable<{ meses: Mes[] }>{
    const endpoint = '/api/v1/maestras/meses'
    return this.http.get<{ meses: Mes[] }>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  obtenerEncuestas(pagina: number, limite: number, idUsuario: string, idEncuesta: number, filtros?: FiltrosReportes)
  :Observable<{ reportadas: ResumenReporte[], paginacion: Paginacion }>{
    let endpoint = `/api/v1/encuestas/listar?pagina=${pagina}&limite=${limite}&idVigilado=${idUsuario}&idEncuesta=${idEncuesta}`
    if(filtros){
      if(filtros.termino) endpoint+= `&termino=${filtros.termino}`;
    }
    return this.http.get<{ reportadas: ResumenReporte[], paginacion: Paginacion }>(
      `${this.host}${endpoint}`,
      { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }
    )
  }

  obtenerEncuesta(idVigilado: string, idEncuesta: number, idReporte: number)
  :Observable<Encuesta>{
    return this.http.get<Encuesta>(
      `${this.host}/api/v1/encuestas/visualizar?idVigilado=${idVigilado}&idEncuesta=${idEncuesta}&idReporte=${idReporte}`,
      { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }
    )
  }

  obtenerEncuestaCuantitativa(idReporte: number, idVigilado: string, idMes: number)
  :Observable<EncuestaCuantitativa>{
    const endpoint = `/api/v1/inidicador/formularios?idReporte=${idReporte}&idVigilado=${idVigilado}&idMes=${idMes}`
    return this.http.get<EncuestaCuantitativa>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  guardarRespuesta(idReporte: number, peticion: { respuestas: RespuestaEnviar[] })
  :Observable<{ mensaje: string}>{
    const enpoint = `/api/v1/respuestas/${idReporte}`
    return this.http.post<{ mensaje: string }>(
      `${this.host}${enpoint}`,
      peticion,
      {
        headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` }
      })
  }

  guardarRespuestasIndicadores(idReporte: number, respuestas: RespuestaEnviar[], evidencias: RespuestaEvidencia[]){
    const endpoint = `/api/v1/inidicador/respuestas`
    return this.http.post(`${this.host}${endpoint}`, { reporteId: idReporte, respuestas, evidencias }, {
      headers: this.obtenerCabeceraAutorizacion()
    })
  }

  enviarRespuesta(idEncuesta: number, idReporte: number, idVigilado: string, confirmar: boolean = false):Observable<{ mensaje: string }>{
    const enpoint = `/api/v1/encuestas/enviar`
    return this.http.post<{ mensaje: string }>(
      `${this.host}${enpoint}`,
      { idEncuesta, idReporte, idVigilado, confirmar },
      {
        headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` }
      })
  }

  enviarRespuestaIndicadores(idEncuesta: number, idReporte: number, idVigilado: string, idMes: number){
    const enpoint = `/api/v1/inidicador/enviar`
    return this.http.post<{ mensaje: string }>(
      `${this.host}${enpoint}`,
      { idEncuesta, idReporte, idVigilado, idMes },
      {
        headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` }
      })
  }

  establecerMotivos(): void {
    const endpoint = '/api/v1/encuestas/listar-motivo'
    this.http.get<Motivo[]>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() }).subscribe({
      next: (motivos)=>{
        this.motivos = motivos
      }
    })
  }

  obtenerMotivos(): Motivo[] {
    return this.motivos
  }

  exportarExcel(idReporte: number){
    const endpoint = `/api/v1/exportar/encuesta?idReporte=${idReporte}`
    return this.http.get(`${this.host}${endpoint}`, { 
      headers: this.obtenerCabeceraAutorizacion(),
      responseType: 'blob',
    })
  }

}
